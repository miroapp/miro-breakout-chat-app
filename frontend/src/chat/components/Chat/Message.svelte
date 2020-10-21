<script lang="ts">
	import type {Message} from '../../interfaces/chat'
	export let message: Message

	let hovering: Boolean;

	const enter = () => hovering = true
	const leave = () => hovering = false
</script>

<div class="message__container" class:userIsAuthor="{message.userIsAuthor}" class:isConsecutive="{message.isConsecutive}">
	<div class="message__timestamp" class:hidden="{!hovering}">
		{message.timestamp.toLocaleTimeString().slice(0, 5)}
	</div>
	<div class="message__content" class:userIsAuthor="{message.userIsAuthor}"  on:mouseenter={enter} on:mouseleave={leave}>
		{#if !message.isConsecutive}
			<div class="message__header">
				<strong>{decodeURIComponent(message.author)}</strong>
			</div>
		{/if}
		<div class="message__body">
			<p class="message__text">{message.text}</p>
		</div>
	</div>
</div>

<style>
	.message__container {
		width: 100%;
		display: flex;
		flex-direction: row;
		padding: 2px;
	}

    	.message__container:not(.isConsecutive) {
        	margin-top: 10px;
    	}

    	.message__container:not(.userIsAuthor) {
		flex-direction: row-reverse;
    	}

    	.message__timestamp {
        	margin: 0 5px;
        	padding-top: 10px;
      	color: #bbb;
	}

    	.message__timestamp.hidden {
      	visibility: hidden;
    	}

	.message__content {
		border-radius: 5px 5px;
		padding: 5px;
		max-width: 60%;
	}

	.message__header,
	.message__text {
		margin: 5px;
    	}

	.message__content.userIsAuthor {
		background-color: rgb(66, 98, 255);
		color: white;
	}

    	.message__content:not(.userIsAuthor) {
		background-color: rgb(235, 235, 239);
		color: black;
	}
</style>
