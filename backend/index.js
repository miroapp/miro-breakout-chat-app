require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')
var http = require('http').Server(app)
var socketConfig = require('./config')
const { joinHandler } = require('./sockets/join-handler')
var io = require('socket.io')(http, socketConfig)
var port = process.env.PORT || 8081

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

// io.use((socket, next) => {
//   console.log(socket.handshake.query.token)
//   next()
// })

io.on('connection', (socket) => {
	socket.on('join', joinHandler(io, socket))

	socket.on('chat message', (roomId, msg, name) => {
    console.log(socket.handshake.query.token)
    console.log({msg, name, roomId})
		io.to(roomId).emit('chat message', msg, name)
	})

	socket.on('disconnect', () => {
		io.to(roomId).emit('system message', `${name} left ${roomId}`)

    try {
      delete rooms[roomId][socket.id]
      const room = rooms[roomId]
      if (!Object.keys(room).length) {
        delete rooms[roomId]
      }
    } catch (error) {
      console.warn('Could not remove socket reference or room for', {roomId, socketId: socket.id})
      console.error(error)
    }
	})
})

http.listen(port, '0.0.0.0', () => {
	console.log('listening on *:' + port)
})
