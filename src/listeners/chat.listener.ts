import { serialize } from 'cookie'
import { SIOServer, SIOSocket, SocketData } from '../types/socket.types'
import { findChat } from '../services/chat.service'
import { generateName, initializeUser, removeUser } from '../services/user.service'
import { registerMessage, registerLeaveMsg } from '../services/message.service'
import { createToken } from '../services/auth.service'

export const chatListener = (io: SIOServer, socket: SIOSocket): void => {
  const authData = (key?: string): SocketData | undefined => {
    if (socket.data.auth && key === socket.data.auth.key) {
      return {
        auth: socket.data.auth
      }
    }
  }

  socket.on('join', async (key: string, callback) => {
    const chat = await findChat(key)

    const socketData = authData(chat.key)
    if (!socketData) {
      callback()
      return
    }

    callback({
      name: socketData.auth.user
    })
  })

  socket.on('register', async (key: string, callback) => {
    const chat = await findChat(key)
    const name = generateName()
    const user = await initializeUser(chat.key, name)
    const token = await createToken(chat.key, user.name)

    io.engine.once('headers', (headers: any) => {
      headers['set-cookie'] = serialize('jwt', token, {
        httpOnly: true,
        domain: '192.168.100.48',
        sameSite: true
      })
    })

    callback({
      name: user.name
    })
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

  socket.on('leave', async (roomKey: string): Promise<void> => {
    const socketData = authData(roomKey)
    if (!socketData) {
      throw new Error('Auth failed')
    }

    const { key, user } = socketData.auth
    const message = await registerLeaveMsg(key, user)

    await removeUser(key, user)

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
