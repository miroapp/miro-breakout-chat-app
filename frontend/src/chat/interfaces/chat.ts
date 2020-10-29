export interface Message {
	text: string
	author: string
	timestamp: Date
}

export type MessageHandler = (msg: string, name: string) => void

export type EmitHandler = (error: any, response: any) => void

export interface ChatSettings {
  boardId: string
	roomId: string
	name: string
  messageHandler: MessageHandler
  token: string
}

export interface ChatController {
	sendMessage: (msg: string) => void
}
