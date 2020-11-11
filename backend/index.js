const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http').Server(app)
const socketConfig = require('./config')
const io = require('socket.io')(http, socketConfig)
const port = process.env.PORT || 8081
const logger = require("./logger");
const Database = require("./storage/db");
const db = new Database();
const ChatMessage = require("./model/chat-message");

let rooms = {}
let roomsCreatedAt = new WeakMap() 
let names = new WeakMap() 
let roomId, name 

app.use(cors())

app.get('/rooms/:roomId', (req, res) => {
	const {roomId} = req.params
	const room = rooms[roomId]

	if (room) {
		const createdAt = roomsCreatedAt.get(room)
		if (!createdAt) {
			logger.warn(`Missing createdAt for room with id ${roomId}`)
		} 

		res.json({
			createdAt: createdAt || "N/A", 
			users: Object.values(room).map((socket) => names.get(socket)),
		})
	}

	logger.log(`Room with room ID ${roomId} could not be found`)
	res.status(404).send("Room could not be found. Try again or contact support.")
})

app.get('/rooms', (req, res) => {
	res.json(Object.keys(rooms))
})

io.on('connection', (socket) => {
	socket.on('join', (_roomId, _name, callback) => {
		logger.log(`Joining room ${_roomId} ${_name}`)
		// validate further for undefined
		if (!_roomId || !_name) {
			logger.err(`${socket.id} attempting to connect without roomId or name`, {roomId, name})
			if (callback) {
				return callback(new Error(`'roomId' and 'name' parameters are required`))
			}
			return
		}
		roomId = _roomId
		name = _name

		if (rooms[roomId]) {
			rooms[roomId][socket.id] = socket
		} else {
			rooms[roomId] = {[socket.id]: socket}
			roomsCreatedAt.set(rooms[roomId], new Date())
		}

		socket.join(roomId)

		names.set(socket, name)
		logger.log(`${name} joined ${roomId}`);
		io.to(roomId).emit('system message', `${name} joined ${roomId}`)
		
		if (callback) {
			callback(null, {success: true})
		}
	})

	socket.on('chat message', async(msg, _name, timestamp) => {
		logger.log(`Got chat message by ${_name}`)
		try {
			const message = new ChatMessage({message: msg, username: _name, roomId, timestamp});
			await db.messages.save(message);
			io.to(roomId).emit('chat message', msg, _name, timestamp);
		}
		catch (err) {
			logger.error(err);
			io.to(roomId).emit('system message', `Error occured on saving message. Error: ${err.message}`);
		}		
	})

	socket.on('message history', async ({roomId, oldestMessageTimestamp, limit}) => {
		logger.log(`Getting message history for roomId ${roomId} and earliest timestamp ${oldestMessageTimestamp} and limit ${limit}.`)
		try {
			const results = await db.messages.listOlder(roomId, oldestMessageTimestamp, limit)
			io.to(roomId).emit('message history', results || [])
		}
		catch (err) {
			logger.error(err);
			io.to(roomId).emit('system message', `There was an error loading message history. Error: ${err.message}`)
		}		
	})

	socket.on('disconnect', () => {		
		io.to(roomId).emit('system message', `${name} left ${roomId}`)

		const room = rooms[roomId];

		if (!room) {
			logger.log(new Error(`Could not find room with id ${roomId}`))
			return
		}
		delete room[socket.id]
		logger.log(`${name} left ${roomId}`);
		if (!Object.keys(room).length) {
			delete room
		}
	})
})

http.listen(port, '0.0.0.0', () => {
	logger.log(`listening on *: ${port}`)
})
