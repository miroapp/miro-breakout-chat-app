module.exports.chatMessageHandler = (io, roomId) => (msg, name) => {
  io.to(roomId).emit('chat message', msg, name)
}
