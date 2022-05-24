import { Server, Socket } from 'socket.io'
import { IMessage } from './message.interface'
import { IUser } from './user.interface'

interface ClientToServerEvents {
  join: (key: string, callback: (response?: IUser) => void) => void
  register: (key: string, callback: (response: IUser) => void) => void
  message: (content: string) => void
  leave: (key: string) => void
}

interface ServerToClientEvents {
  message: (msg: IMessage) => void
}

interface InterServerEvents {
}

export interface SocketData {
  auth: {
    key: string
    user: string
  }
}

export class SIOServer extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {}

export class SIOSocket extends Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {}
