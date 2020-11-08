const http = require('http')
const port = require('./config').port

module.exports = (app) => {
	const server = http.Server(app)

	return {
		server,
		serve() {
			server.listen(port, '0.0.0.0', () => {
				console.log('listening on *:' + port)
			})
		}
	}
}
