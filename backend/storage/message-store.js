'use strict'

const ChatMessage = require('./../model/chat-message')
const logger = require('./../logger')

class MessageStore {
	constructor(db) {
		this.db = db
	}

	async save(chatMessage) {
		const result = this.validateMessage(chatMessage)
		if (!result.valid) {
			throw new Error(result.message)
		}

		// TODO: move toDatabaseObject to a generic layer
		const record = await this.db.insert(chatMessage.toDatabaseObject())
		logger.log(`Successfully inserted record from user ${record.username} with ID ${record._id}`)

		return record
	}

	async saveBatch(chatMessages) {
		chatMessages.forEach((chatMessage) => {
			const result = this.validateMessage(chatMessage)
			if (!result.valid) {
				return result.message
			}
		})

		const records = await this.db.insert(chatMessages)
		records.forEach((record) => {
			logger.log(`Successfully inserted record from user ${record.user} with ID ${record._id}`)
		})

		return records
	}

	async listOlder(roomId, _timestamp, limit = 30) {
		if (!_timestamp) {
			return await this.db.find({roomId}).sort({timestamp: -1}).limit(limit).sort({timestamp: 1})
		}

		return await this.db
			.find({roomId, timestamp: {$lt: _timestamp}})
			.sort({timestamp: -1})
			.limit(limit)
			.sort({timestamp: 1})
	}

	validateMessage(chatMessage) {
		if (!chatMessage || !(chatMessage instanceof ChatMessage)) {
			return {valid: false, message: new Error('Chat message is required an should be an instance of ChatMessage')}
		}

		return {valid: true}
	}
}

module.exports = MessageStore
