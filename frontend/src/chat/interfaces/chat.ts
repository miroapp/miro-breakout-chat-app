export interface Message {
	text: string
	author: string
	timestamp: Date
}

export type AuthHandler = (isAuthorized: boolean) => void
export type MessageHandler = (msg: string, user: User) => void

export type EmitHandler = (error: any, response: any) => void

export enum ChatState {
	Loading,
	Unauthorized,
	Success
}

export interface ChatSettings {
	roomId: string
	token: string
	authHandler: AuthHandler
	messageHandler: MessageHandler
}

export interface User {
	id: string
	name: string
	token?: string
}

export interface ChatController {
	sendMessage: (msg: string) => void
}
