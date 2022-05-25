import { SocketIO } from '../utils/socket-io'
import { registerJoinMsg, registerLeaveMsg } from './message.service'

export const emitJoin = async (key: string, user: string) => {
  const io = SocketIO.instance().server()

  const message = await registerJoinMsg(key, user)
  io.to(key).emit('message', message)
}

export const emitLeave = async (key: string, user: string) => {
  const io = SocketIO.instance().server()

  const message = await registerLeaveMsg(key, user)
  io.to(key).emit('message', message)
}
