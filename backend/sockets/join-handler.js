const {boards} = require('../boards/boards')
const {isAuthorized} = require('./authorization')
const {chatMessageHandler} = require('./chat-message-handler')
const {disconnectHandler} = require('./disconnect-handler')

const isValidJoinRequest = (boardId, roomId, name) => {
	return boardId && roomId && name
}

/*
 * Boards will be in the following format
 * {
 *  boardId: {
 *    roomId: {
 *      createdAt: time it was created,
 *      sockets: {
 *        socketId: {
 *          socket: reference to the socket,
 *          name: username that owns the socket
 *        }
 *      }
 *    }
 *  }
 * }
 */

module.exports.joinHandler = (io, socket) => async (boardId, roomId, name, callback) => {
	const isValid = isValidJoinRequest(boardId, roomId, name)

	if (!isValid) {
		console.warn(`${socket.id} attempting to connect without roomId, name or boardId`, {roomId, name, boardId})
		callback(`boardId, roomId and name are required to connect`)
		return
	}

	const authorized = await isAuthorized(socket, boardId)

	if (!authorized) {
		console.warn(`${name} attempted to connect without the proper authorization`)
		callback(`Unauthorized`)
		return
	}

	if (!boards[boardId]) boards[boardId] = {}
	if (!boards[boardId][roomId]) {
		boards[boardId][roomId] = {
			createdAt: new Date(),
			sockets: {},
		}
	}
	if (!boards[boardId][roomId].sockets[socket.id]) {
		boards[boardId][roomId].sockets[socket.id] = {socket, name}
	}

	socket.join(roomId)
	console.log(`${name} joined ${roomId}`)

	io.to(roomId).emit('system message', `${name} joined ${roomId}`)

	socket.on('chat message', chatMessageHandler(io, roomId))

	socket.on('disconnect', disconnectHandler(io, socket, boardId, roomId, name))

	if (callback) {
		callback(null, {success: true})
	}
}
