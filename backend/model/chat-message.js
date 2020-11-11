'use strict'

class ChatMessage {
	constructor({message, username, roomId, timestamp}) {
		if (!message) {
			throw new Error('Message is required')
		}

		if (!username) {
			throw new Error('Username is required')
		}

		if (!roomId) {
			throw new Error('RoomId is required')
		}

		this._message = message
		// assumes names are unique per room
		this._username = username
		this._roomId = roomId
		this._timestamp = timestamp || Date.now()
	}

	get message() {
		return this._message
	}

	get username() {
		return this._username
	}

	get roomId() {
		return this._roomId
	}

	get timestamp() {
		return this._timestamp
	}

	toDatabaseObject() {
		return {
			message: this.message,
			username: this.username,
			roomId: this.roomId,
			timestamp: this.timestamp,
		}
	}
}

module.exports = ChatMessage
