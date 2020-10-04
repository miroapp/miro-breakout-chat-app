<script lang="ts">
	import {onMount, afterUpdate, beforeUpdate} from 'svelte'
	import Message from './Message.svelte'

	import type {
		MessageHandler,
		EmitHandler,
		Message as MessageInterface,
		ChatController,
		ChatSettings,
	} from '../../interfaces/chat'

	export let chatFactory: (settings: ChatSettings) => ChatController
	export let roomId: string
	export let name: string
	export let div: any
	let autoscroll: boolean

	let newMessageText: string = ''

	let chatController: ChatController = null

	let messages: Array<MessageInterface> = []
	const handleNewMessage: MessageHandler = (text, author) => {
		messages = [...messages, {text, author, timestamp: new Date()}]
	}

	const handleMessageSend = () => {
		if (!newMessageText) return

		chatController.sendMessage(newMessageText)

		newMessageText = ''

		return false
	}

	onMount(() => {
		chatController = chatFactory({roomId, name, messageHandler: handleNewMessage})
	})

	beforeUpdate(() => {
		autoscroll = div && (div.offsetHeight + div.scrollTop) > (div.scrollHeight - 20)
	})

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight)
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
		height: calc(100% - 120px);
		padding: 0 24px;
		overflow-y: auto;
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
	<div class="sidebar__body" bind:this={div}>
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
