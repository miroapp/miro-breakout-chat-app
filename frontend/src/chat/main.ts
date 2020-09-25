import socketIoControllerFactory from './controllers/socketIoController'
import Chat from './components/Chat/Chat.svelte'
import Error from './components/Error.svelte'
import {BoardPermission} from '../constants'
import {CLIENT_ID} from '../config'
import type {ChatSettings} from './interfaces/chat'

const initApp = ({roomId, name, boardId, token}: Omit<ChatSettings, 'messageHandler'>) => {
	new Chat({
		target: document.body,
		props: {
			roomId,
			name,
			boardId,
			token,
			chatFactory: socketIoControllerFactory,
		},
	})
}

const getCurrentUserName = async () => {
	const id = await miro.currentUser.getId()
	const onlineUsers: SDK.OnlineUser[] = await miro.board.getOnlineUsers()

	return onlineUsers.find((user: SDK.OnlineUser) => user.id === id)?.name
}

miro.onReady(async () => {
	const savedState = await miro.__getRuntimeState()
	const name = await getCurrentUserName()
	const token = await miro.getToken()
	const {id: boardId, currentUserPermissions: permissions}: SDK.IBoardInfo = await miro.board.info.get()

	const roomId: string = savedState[CLIENT_ID]?.breakoutChatRoomId
	// Additional check for UI only, Business logic can be wrong since I am not familiar with it in general
	const currentUserHasEditCommentsPermissions: boolean = permissions.includes(BoardPermission.EDIT_COMMENTS)

	if (currentUserHasEditCommentsPermissions && savedState[CLIENT_ID]?.breakoutChatRoomId && name) {
		initApp({
			roomId,
			name,
			boardId,
			token,
		})
	} else {
		const app = new Error({
			target: document.body,
			props: {
				message: !currentUserHasEditCommentsPermissions
					? 'Sorry, you don\'t have write access to this board.'
					: 'Error!',
			},
		})
	}
})
