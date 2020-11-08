class Room {
	constructor(roomId, createdAt) {
		this.roomId = roomId
		this.createdAt = createdAt
		this.sockets = {}
		this.names = {}
	}

	allSockets() {
		return Object.assign({}, this.sockets)
	}

	addSocket(socket) {
		this.sockets[socket.id] = socket
	}

	hasSockets() {
		return Object.keys(this.sockets).length > 0
	}

	removeSocket(socket) {
		delete this.sockets[socket.id]
	}

	allNames() {
		return Object.assign({}, this.names)
	}

	addName(socket, name) {
		this.names[socket.id] = name
	}

	removeName(socket) {
		delete this.sockets[socket.id]
	}
}

class Rooms {
	constructor() {
		this._rooms = {}
		this._currentRoomId = null
	}

	currentRoomId() {
		return this._currentRoomId
	}

	setCurrentRoomId(roomId) {
		this._currentRoomId = roomId
	}

	add(roomId) {
		const room = new Room(roomId, new Date())

		this._rooms[roomId] = room

		return room
	}

	all() {
		return Object.assign({}, this._rooms);
	}

	get(roomId) {
		return this._rooms[roomId]
	}

	has(roomId) {
		return !!this._rooms[roomId]
	}

	remove(roomId) {
		return delete this._rooms[roomId]
	}
}

module.exports = new Rooms();
