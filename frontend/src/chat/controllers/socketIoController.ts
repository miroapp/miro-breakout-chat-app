import io from 'socket.io-client'

import {CHAT_HOST, CHAT_OPTIONS} from '../../config'

import type {ChatSettings, ChatController} from '../interfaces/chat'

const initChat = ({roomId, name, messageHandler, messageHistoryHandler}: ChatSettings) => {
	const socket = io(CHAT_HOST, CHAT_OPTIONS)

	socket.emit('join', roomId, name, () => {})

	socket.on('chat message', messageHandler)

	socket.on('message history', messageHistoryHandler);

	return {
		sendMessage: (msg: string, timestamp: number) => {
			socket.emit('chat message', msg, name, timestamp, () => {})
		},
		getMessageHistory: ({roomId, oldestMessageTimestamp, limit}) => {
			socket.emit('message history', {roomId, oldestMessageTimestamp, limit}, () => {})
		}
	} as ChatController
}

export default initChat
