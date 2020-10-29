const got = require('got')

const getToken = (socket) => {
  return socket.handshake.query.token
}

module.exports.isAuthorized = async (socket, boardId) => {
  try {
    const url = `${process.env.MIRO_API_URL}/boards/${boardId}`;
    const token = getToken(socket)
    const options = {
      headers: {
        Authorization: `Bearer ${token}`
      },
      throwHttpErrors: false
    }
  
    const response = await got(url, options)

    if(response.statusCode === 200) return true

    console.warn(`Unauthorized access attempt`, {token, boardId, code: response.statusCode})
    return false
  } catch (error) {
    console.error('Error reaching Miro API', error)
    return false
  }
}