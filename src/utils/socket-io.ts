import { ServerOptions } from 'socket.io'
import { SIOServer } from '../types/socket.types'
import { Server as HttpServer } from 'http'

export class SocketIO {
  // eslint-disable-next-line no-use-before-define
  private static _instance?: SocketIO
  private static server?: SIOServer

  private constructor () {
    SocketIO._instance = this
  }

  static instance (): SocketIO {
    return this._instance || (this._instance = new this())
  }

  initialize (httpServer: HttpServer, opts?: Partial<ServerOptions>) {
    SocketIO.server = new SIOServer(httpServer, opts)

    return SocketIO.server
  }

  ready (): boolean {
    return SocketIO.server !== null
  }

  server (): SIOServer {
    if (!SocketIO.server) {
      throw new Error('Socket.IO server requested before initialization')
    }

    return SocketIO.server
  }
}
