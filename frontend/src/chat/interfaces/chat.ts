export interface Message {
	text: string
	author: string
	timestamp: number
}

export type MessageHandler = (msg: string, name: string, timestamp: number) => void
export type MessageHistoryHandler = (messages: []) => void

export type EmitHandler = (error: any, response: any) => void

export interface ChatSettings {
	roomId: string
	name: string
	messageHandler: MessageHandler,
	messageHistoryHandler: MessageHistoryHandler
}

export interface ChatController {
	sendMessage: (msg: string, timestamp: number) => void
	getMessageHistory: ({roomId, oldestMessageTimestamp, limit}) => void
}
