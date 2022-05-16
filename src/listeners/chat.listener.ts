import randomstring from 'randomstring'
import { serialize } from 'cookie'
import { SIOServer, SIOSocket, SocketData } from '../types/socket.types'
import { socketAuth } from '../middleware/auth'
import { findChat } from '../services/chat.service'
import { initializeUser } from '../services/user.service'
import { registerMessage, registerLeaveMsg } from '../services/message.service'
import { createToken } from '../services/auth.service'

export const chatListener = (io: SIOServer, socket: SIOSocket): void => {
  const getData = (): SocketData => {
    const { key, user } = socket.data
    if (!key || !user) {
      throw new Error('Invalid socket data')
    }
    return { key, user }
  }

  socket.on('join', async (key: string) => {
    const chat = await findChat(key)

    const name = randomstring.generate({
      length: 4,
      charset: 'alphabetic',
      capitalization: 'uppercase'
    })
    const user = await initializeUser(chat.key, name)
    const token = await createToken(chat.key, user.name)

    socket.handshake.headers.cookie = serialize('jwt', token, { httpOnly: true })
  })

  socket.on('message', async (content: string): Promise<void> => {
    io.use(socketAuth)

    const { key, user } = getData()
    const message = await registerMessage(key, user, content)

    io.to(key).emit('message', message)
  })

  socket.on('disconnect', async () => {
    if (!socket.data.key || socket.data.user) {
      return
    }

    const { key, user } = getData()
    const message = await registerLeaveMsg(key, user)

    io.to(key).emit('message', message)
  })
}
