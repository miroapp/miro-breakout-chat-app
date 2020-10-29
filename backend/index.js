require('dotenv').config()
var express = require('express')
var app = express()
var cors = require('cors')
var http = require('http').Server(app)
var socketConfig = require('./config')
var io = require('socket.io')(http, socketConfig)
var port = process.env.PORT || 8081

const {getAllRooms} = require('./boards/boards')
const {joinHandler} = require('./sockets/join-handler')

app.use(cors())

app.get('/rooms/:roomId', (req, res) => {
	const {roomId} = req.params
	const rooms = getAllRooms()

	const room = rooms.find((r) => (r.roomId = roomId))

	if (room) {
		res.json(room)
	} else {
		res.status(404).end()
	}
})

app.get('/rooms', (req, res) => {
	res.json(getAllRooms())
})

io.on('connection', (socket) => {
	socket.on('join', joinHandler(io, socket))
})

http.listen(port, '0.0.0.0', () => {
	console.log('listening on *:' + port)
})
