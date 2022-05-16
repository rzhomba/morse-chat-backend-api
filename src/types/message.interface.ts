export type MessageType = 'message' | 'join' | 'leave'

export interface IMessage {
  user: string
  type: MessageType
  content?: string
}
