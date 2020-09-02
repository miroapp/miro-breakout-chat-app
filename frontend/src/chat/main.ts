import socketioControllerFactory from './controllers/socketIoController';
import Chat from './components/Chat/Chat.svelte';
import Error from './components/Error.svelte';

import { APP_ID } from '../config';

const initApp = (
	roomId: string,
	name: string,
) => {
	const app = new Chat({
		target: document.body,
		props: {
			roomId,
			name,
			chatFactory: socketioControllerFactory,
		}
	});
}

const getCurrentUserName = async () => {
	const id = await miro.currentUser.getId();
	// @ts-ignore
	const onlineUsers = await miro.board.getOnlineUsers();

	return onlineUsers.find(user => user.id === id)?.name;
}

miro.onReady(async () => {
	const savedState = await miro.__getRuntimeState();
	const name = await getCurrentUserName();

	if (savedState[APP_ID]?.breakoutChatRoomId && name) {
		initApp(
			savedState[APP_ID]?.breakoutChatRoomId,
			name,
		);
	} else {
		const app = new Error({
			target: document.body,
		})
	}
});