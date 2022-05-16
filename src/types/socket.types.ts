import { Server, Socket } from 'socket.io'
import { IMessage } from './message.interface'

interface ClientToServerEvents {
  join: (key: string) => void
  message: (content: string) => void
}

interface ServerToClientEvents {
  message: (msg: IMessage) => void
}

interface InterServerEvents {
}

export interface SocketData {
  key: string
  user: string
}

export class SIOServer extends Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {}
export class SIOSocket extends Socket<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData> {}
