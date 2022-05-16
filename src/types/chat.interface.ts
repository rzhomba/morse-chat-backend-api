import { IUser } from './user.interface'
import { IMessage } from './message.interface'

export interface IChat {
  key: string
  users: Array<IUser>
  messages: Array<IMessage>
}
