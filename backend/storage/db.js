'use strict'

const Datastore = require('nedb-promises')
const MessageStore = require('./message-store')
const logger = require('./../logger')
const PATH_MESSAGE_STORAGE = 'storage/messages.db'

class Database {
	constructor() {
		if (!this._messages) {
			logger.log(`Creating new message datastore at ${PATH_MESSAGE_STORAGE}`)
			this._messages = new MessageStore(
				Datastore.create({filename: PATH_MESSAGE_STORAGE, autoload: true, timestampData: true}),
			)
		}
	}

	get messages() {
		if (!this._messages) {
			return new Error('Database needs to be instantiated first')
		}
		return this._messages
	}
}

module.exports = Database
