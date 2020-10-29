const boards = {}

module.exports.boards = boards

// this function should be deprecated or secured only for admin usages
module.exports.getAllRooms = () => {
	const allRooms = Object.entries(boards).reduce((prev, [boardId, rooms]) => {

    Object.entries(rooms).forEach(([roomId, room]) => {
      prev.push({
        boardId,
        roomId,
        createdAt: room.createdAt,
        users: Object.values(room.sockets).map(socket => socket.name)
      })
    })

		return prev
	}, [])

	return allRooms
}
