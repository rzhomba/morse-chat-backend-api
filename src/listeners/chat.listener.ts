import { SIOServer, SIOSocket, SocketData } from '../types/socket.types'
import { findChat } from '../services/chat.service'
import { registerMessage } from '../services/message.service'

export const chatListener = (io: SIOServer, socket: SIOSocket): void => {
  const authData = (key?: string): SocketData | undefined => {
    if (socket.data.auth && (!key || key === socket.data.auth.key)) {
      return {
        auth: socket.data.auth
      }
    }
  }

  socket.on('join', async (key: string) => {
    const chat = await findChat(key)

    const socketData = authData(chat.key)
    if (!socketData) {
      return
    }

    socket.join(chat.key)
  })

  socket.on('message', async (content: string): Promise<void> => {
    const socketData = authData()
    if (!socketData) {
      throw new Error('Auth failed')
    }

    const { key, user } = socketData.auth
    const message = await registerMessage(key, user, content)

    io.to(key).emit('message', message)
  })

  socket.on('disconnect', () => {
    const socketData = authData()
    if (!socketData) {
      return
    }

    // TODO: mark user as offline
  })
}
