import io from 'socket.io-client'

import {CHAT_HOST, CHAT_OPTIONS} from '../../config'

import type {ChatSettings, ChatController} from '../interfaces/chat'

const initChat = ({roomId, name, boardId, token, messageHandler}: ChatSettings) => {
	const socket = io(`${CHAT_HOST}?token=${token}&boardId=${encodeURIComponent(boardId)}`, CHAT_OPTIONS)

	socket.emit('join', roomId, name, () => {})

	socket.on('chat message', messageHandler)

	return {
		sendMessage: (msg: string) => {
			socket.emit('chat message', msg, () => {})
		},
	} as ChatController
}

export default initChat
