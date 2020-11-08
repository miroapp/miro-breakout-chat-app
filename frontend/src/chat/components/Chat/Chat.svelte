<script lang="ts">
	import {onMount} from 'svelte'
	import Message from './Message.svelte'

	import type {
		MessageHandler,
		Message as MessageInterface,
		ChatController,
		ChatSettings,
		User,
		AuthHandler,
	} from '../../interfaces/chat'
	import { ChatState } from '../../interfaces/chat'

	export let chatFactory: (settings: ChatSettings) => ChatController
	export let roomId: string
	export let user: User

	let newMessageText: string = ''
	let chatController: ChatController = null
	let token = user.token
	let chatState = ChatState.Loading

	let messages: Array<MessageInterface> = []
	const handleNewMessage: MessageHandler = (text, author) => {
		messages = [...messages, {text, author: author.name, timestamp: new Date()}]
	}
	const authHandler: AuthHandler = (isAuthorized) => {
		chatState = isAuthorized ? ChatState.Success : ChatState.Unauthorized
	}

	const handleMessageSend = () => {
		if (!newMessageText) return

		chatController.sendMessage(newMessageText)

		newMessageText = ''

		return false
	}

	onMount(() => {
		chatController = chatFactory({roomId, token, authHandler, messageHandler: handleNewMessage})
	})
</script>

<style>
	.sidebar__container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 100%;
	}

	.sidebar__header {
		padding: 24px;
		height: 64px;
	}

	.sidebar__body {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		height: calc(100% - 120px);
		padding: 0 24px;
	}

	.sidebar__footer {
		padding: 0 8px;
	}

	.sidebar__footer input {
		width: 100%;
	}
</style>

<div class="sidebar__container">
	<div class="sidebar__header">
		<span class="miro-h2">Breakout Chat</span>
	</div>
	<div class="sidebar__body">
		{#each messages as message}
			<Message {message} />
		{/each}
	</div>
	<div class="sidebar__footer">
		{#if chatState === ChatState.Loading}
			<p>Loading</p>
		{:else if chatState === ChatState.Unauthorized}
			<p>Not authorized</p>
		{:else}
			<form on:submit|preventDefault={handleMessageSend}>
				<input
					disabled={chatController === null}
					type="text"
					class="miro-input miro-input--primary"
					bind:value={newMessageText}
					placeholder="Type your message here" />
			</form>
		{/if}
	</div>
</div>
