import socketioControllerFactory from './controllers/socketIoController'
import Chat from './components/Chat/Chat.svelte'
import Error from './components/Error.svelte'

import {CLIENT_ID} from '../config'

const initApp = (roomId: string, name: string, token: string, boardId: string) => {
	const app = new Chat({
		target: document.body,
		props: {
			roomId,
			name,
      chatFactory: socketioControllerFactory,
      token,
      boardId
		},
	})
}

const getCurrentUserName = async () => {
	const id = await miro.currentUser.getId()
	// @ts-ignore
	const onlineUsers = await miro.board.getOnlineUsers()

	return onlineUsers.find((user) => user.id === id)?.name
}

const getBreakoutChatRoomId = async (): Promise<string> => {
	const savedState = await miro.__getRuntimeState()
  return savedState[CLIENT_ID] ? savedState[CLIENT_ID].breakoutChatRoomId : ''
}

miro.onReady(async () => {
  const breakoutChatRoomId = await getBreakoutChatRoomId()
  const name = await getCurrentUserName()
  const token = await miro.getToken()
  const board = await miro.board.info.get()

	if (breakoutChatRoomId && name) {
		initApp(breakoutChatRoomId, name, token, board.id)
	} else {
		const app = new Error({
			target: document.body,
		})
	}
})
