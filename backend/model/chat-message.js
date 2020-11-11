"use strict";

class ChatMessage {
    constructor({message, username, roomId}) {
        if (!message) {
            throw new Error("Message is required");
        }

        if (!username) {
            throw new Error("Username is required");
        }

        if (!roomId) {
            throw new Error("RoomId is required");
        }

        this._message = message;
        // assumes names are unique per room
        this._username = username;
        this._roomId = roomId;
    }

    get message() {
        return this._message;
    }

    get username() {
        return this._username;
    }

    get roomId() {
        return this._roomId;
    }

    toDatabaseObject() {
        return {
            message: this.message,
            username: this.username,
            roomId: this.roomId
        };
    }
}

module.exports = ChatMessage;