import { SIOServer, SIOSocket } from '../types/socket.types'
import { chatListener } from './chat.listener'

export default async (io: SIOServer, socket: SIOSocket) => {
  await chatListener(io, socket)
}
