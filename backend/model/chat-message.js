"use strict";

class ChatMessage {
    constructor(message, username, roomId) {
        this._message = message;
        // assumes names are unique per room
        this._username = username;
        this._roomId = roomId;
    }

    get message() {
        return this._message;
    }

    get name() {
        return this.name;
    }

    get roomId() {
        return this.roomId;
    }
}

module.exports = ChatMessage;