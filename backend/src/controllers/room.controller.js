const roomsStorage = require('../db/roomsStorage')

class RoomController {
	all(req, res) {
		res.json(Object.keys(roomsStorage.all()))
	}

	get(req, res) {
		const room = roomsStorage.get(req.params.roomId)
	
		if (room) {
			res.json({
				createdAt: room.createdAt,
				users: Object.values(room.allNames()),
			})
		} else {
			res.status(500).end()
		}
	}
}

module.exports = new RoomController()
