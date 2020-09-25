var express = require('express')
var app = express()
var axios = require('axios')
var cors = require('cors')
var http = require('http').Server(app)
var socketConfig = require('./config')
var io = require('socket.io')(http, socketConfig)
var port = process.env.PORT || 8081

const apiBaseUrl = 'https://api.miro.com/v1'
var rooms = {}
var roomsCreatedAt = new WeakMap()
var names = new WeakMap()
var roomId
var name

app.use(cors())

app.get('/rooms/:roomId', (req, res) => {
	const {roomId} = req.params
	const room = rooms[roomId]

	if (room) {
		res.json({
			createdAt: roomsCreatedAt.get(room),
			users: Object.values(room).map((socket) => names.get(socket)),
		})
	} else {
		res.status(500).end()
	}
})

app.get('/rooms', (req, res) => {
	res.json(Object.keys(rooms))
})

// token validation helper
const isTokenValid = async ({boardId, token}) => {
	if (!boardId || !token) return false

	try {
		const headers = {Authorization: `Bearer ${token}`}
		const response = await axios.get(`${apiBaseUrl}/boards/${boardId}`, {headers})
		// Business logic can be wrong since I am not familiar with it in general
		return ['commentor', 'editor', 'owner'].includes(response.data.currentUserConnection.role)
	} catch (error) {
		console.error(`Token validation error: ${error.message}`, {boardId, token})
		return false
	}
}

// socket auth middleware connection will be established only if connection valid
io.use(async (socket, next) => {
	const {boardId, token} = socket.handshake.query
	const isConnectionValid = await isTokenValid({boardId, token})
	return isConnectionValid ? next() : next(new Error('authentication error'))
})

io.on('connection', (socket) => {
	socket.on('join', (_roomId, _name, callback) => {
		if (!_roomId || !_name) {
			if (callback) {
				callback('roomId and name params required')
			}
			console.warn(`${socket.id} attempting to connect without roomId or name`, {roomId, name})
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

		io.to(roomId).emit('system message', `${name} joined ${roomId}`)

		if (callback) {
			callback(null, {success: true})
		}
	})

	socket.on('chat message', (msg) => {
		io.to(roomId).emit('chat message', msg, name)
	})

	socket.on('disconnect', () => {
		io.to(roomId).emit('system message', `${name} left ${roomId}`)

		delete rooms[roomId][socket.id]

		const room = rooms[roomId]
		if (!Object.keys(room).length) {
			delete rooms[roomId]
		}
	})
})

http.listen(port, '0.0.0.0', () => {
	console.log('listening on *:' + port)
})
