<script lang="ts">
	import {onMount, afterUpdate} from 'svelte'
	import Message from './Message.svelte'

	import type {
		MessageHandler,
		MessageHistoryHandler,
		EmitHandler,
		Message as MessageInterface,
		ChatController,
		ChatSettings,
	} from '../../interfaces/chat'

	export let chatFactory: (settings: ChatSettings) => ChatController
	export let roomId: string
	export let name: string

	const COUNT_LOAD_MESSAGES = 20;
	let newMessageText: string = ''
	let noOlderMessages: boolean = true;

	let chatController: ChatController = null

	let messages: Array<MessageInterface> = []
	const handleNewMessage: MessageHandler = (text, author, timestamp) => {
		messages = [...messages, {text, author, timestamp}]
		messages = messages.sort((a,b) => (a.timestamp > b.timestamp) ? 1 : 
                ((b.timestamp > a.timestamp) ? -1 : 0))
	}

	const handleMessageSend = () => {
		if (!newMessageText) return

		chatController.sendMessage(newMessageText, Date.now())

		newMessageText = ''

		return false
	}

	const handleRequestMessageHistory = () => {
		chatController.getMessageHistory({
			roomId, 
			oldestMessageTimestamp: messages.length ? messages[0].timestamp : null,
			limit: COUNT_LOAD_MESSAGES})
	}

	const handleReceiveMessageHistory : MessageHistoryHandler = (_messages) => {
		if (!_messages.length) {
			noOlderMessages = true;
		}
		else {
			messages = [..._messages.map((record: any) => {return {
				author: record.username,
				text: record.message,
				timestamp: record.timestamp
			}}), ...messages]
		}
	}

	onMount(() => {
		chatController = chatFactory({roomId, name, messageHandler: handleNewMessage, messageHistoryHandler: handleReceiveMessageHistory})
		chatController.getMessageHistory({roomId, oldestMessageTimestamp: null, limit: COUNT_LOAD_MESSAGES});
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
		{#if !noOlderMessages}
			<button on:click={handleRequestMessageHistory}>
				Load older messages..
			</button>
  		{/if}
		{#each messages as message}
			<Message {message} />
		{/each}
	</div>
	<div class="sidebar__footer">
		<form on:submit|preventDefault={handleMessageSend}>
			<input
				disabled={chatController === null}
				type="text"
				class="miro-input miro-input--primary"
				bind:value={newMessageText}
				placeholder="Type your message here" />
		</form>
	</div>
</div>
