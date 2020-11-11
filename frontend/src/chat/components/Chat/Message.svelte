<script lang="ts">
	import type {Message} from '../../interfaces/chat'
	export let message: Message
</script>

<div class="message__container">
	<div class="message__header">
		<strong>{decodeURIComponent(message.author)}</strong>
		<span>{new Date(message.timestamp).toLocaleTimeString().slice(0, 5)}</span>
	</div>
	<div class="message__body">
		<p class="message__text">{message.text}</p>
	</div>
</div>

<style>
	.message__container {
		/* display: flex;
        width: 100%; */
		margin: 6px 0;
	}

	.message__header {
		margin-top: 12px;
	}

	.message__text {
		margin: 6px 0px 0px 0px;
	}
</style>
