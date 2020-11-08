const passport = require('passport')
const fetch = require('node-fetch')
const Strategy = require('passport-http-bearer').Strategy
const STRATEGY_NAME = 'bearer'

passport.use(STRATEGY_NAME, new Strategy((token, done) => {
	fetch('https://api.miro.com/v1/oauth-token', {
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		},
	}).then(res => res.json())
	.then(data => {
		return done(null, {
			...data,
			token
		})
	})
	.catch(err => done(err))
}))

passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((obj, done) => done(null, obj));

module.exports = {
	init(socket, next) {
		passport.initialize()(socket.request, {}, next)
	},

	authenticate(socket, next) {
		passport.authenticate(STRATEGY_NAME, { session: false }, (err, user) => {
			if (err) {
				return next(err);
			}

			socket.request.login(user, next);
		})(socket.handshake)
	}
} 