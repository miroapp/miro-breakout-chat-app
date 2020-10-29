const {boards} = require('../boards/boards')

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

module.exports.disconnectHandler = (io, socket, boardId, roomId) => () => {
  io.to(roomId).emit('system message', `${name} left ${roomId}`)

  try {
    delete boards[boardId][roomId].sockets[socket.id]

    const roomSockets = boards[boardId][roomId].sockets
    if (!Object.keys(roomSockets).length) {
      delete boards[boardId][roomId]
    }

    const boardRooms = boards[boardId]
    if(!Object.keys(boardRooms).length){
      delete boards[boardId]
    }
  } catch (error) {
    console.warn('Could complete cleanup on socket disconnect', {boardId, roomId, socketId: socket.id})
    console.error(error)
  }
}
