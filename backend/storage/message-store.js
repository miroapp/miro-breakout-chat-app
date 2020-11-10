"use strict";

const { v4: uuidv4 } = require("uuid");
const ChatMessage = require("./../model/chat-message");
const logger = require("./../logger");

class MessageStore {
    constructor(db) {
        this.db = db;
    }

    async save(chatMessage) {
        // TODO: move to util 
        const result = this.validateMessage(chatMessage);
        if (!result.valid) {
            return result.message;
        }

        const record = await this.db.insert(chatMessage);
        logger.log(`Successfully inserted record from user ${record.user} with ID ${record._id}`);

        return record;
    }

    async saveBatch(chatMessages) {
        chatMessages.forEach((chatMessage) => {
            const result = this.validateMessage(chatMessage);
            if (!result.valid) {
                return result.message;
            }
        });

        const records = await this.db.insert(chatMessages);
        records.forEach((record) => {
            logger.log(`Successfully inserted record from user ${record.user} with ID ${record._id}`);
        });

        return records;
    }

    async listOlder(roomId, _timestamp, limit = 30) {
        if (_timestamp) {
            return await this.db.find({ roomId })
                .sort({timestamp: -1})
                .limit(limit)
                .sort({timestamp: 1})
        }

        return await this.db.find({ roomId, timestamp: { $lt: _timestamp}})
            .sort({timestamp: -1})
            .limit(limit)
            .sort({timestamp: 1})
    }

    validateMessage(chatMessage) {
        if (!chatMessage || chatMessage instanceof ChatMessage) {
            return {valid: false, 
                message: new Error("Chat message is required an should be an instance of ChatMessage")};
        }

        // https://trello.com/c/tCa9sBkX/4-as-a-user-i-want-messages-to-be-saved-so-that-i-can-always-access-the-history 
        // - story is only about persistence of chat messages in rooms, not standalone messages
        if (!chatMessage.user || !chatMessage.roomId) {
            return {valid: false, message: new Error("Chat message requires user and room")};
        }

        return {valid: true};
      }
}

module.exports = MessageStore;