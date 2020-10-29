import io from 'socket.io-client'

import {CHAT_HOST, CHAT_OPTIONS} from '../../config'

import type {ChatSettings, ChatController} from '../interfaces/chat'

const initChat = ({roomId, name, messageHandler, token, boardId}: ChatSettings) => {
	const socket = io(CHAT_HOST, {
		...CHAT_OPTIONS,
		query: {token},
	})

	socket.emit('join', boardId, roomId, name, console.log)

	socket.on('chat message', messageHandler)

	return {
		sendMessage: (msg: string) => {
			socket.emit('chat message', msg, name, console.log)
		},
	} as ChatController
}

export default initChat
