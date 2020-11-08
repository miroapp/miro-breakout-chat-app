const express = require('express')
const cors = require('cors')
const app = express()
const server = require('./core/server')(app)
const socketConfig = require('./core/config').socket
const auth = require('./core/auth');
const io = require('socket.io')(server.server, socketConfig)
const router = require('./core/router')
const ChatController = require('./controllers/chat.controller')

app.use(cors())
app.use(router)

io.use(auth.init)
io.use(auth.authenticate)

io.on('connection', (socket) => {
	const chatController = new ChatController(io, socket)

	socket.on('join', chatController.connect.bind(chatController))
	socket.on('chat message', chatController.sendMessage.bind(chatController))
	socket.on('disconnect', chatController.disconnect.bind(chatController))
})

server.serve()
