'use strict'

const assert = require('assert')
const ChatMessage = require('./chat-message')

describe(__filename, () => {
	describe('constructor', () => {
		it('should throw error if parameters are missing', () => {
			const message = 'fake message'
			const username = 'fake username'
			const roomId = Math.random().toString(36).slice(2)

			const testCases = [
				{
					label: 'Missing username',
					input: {message, roomId},
				},
				{
					label: 'Missing roomId',
					input: {message, username},
				},
				{
					label: 'Missing message',
					input: {username, roomId},
				},
			]
			testCases.forEach((testCase) =>
				assert.throws(() => {
					new ChatMessage(testCase.input),
						{message: 'Message, username and roomId are required'},
						`expected to throw errors on missing params. Test case: ${testCase.label}`
				}),
			)
		})
	})
})
