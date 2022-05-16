import { IMessage } from '../types/message.interface'
import { Chat } from '../models/chat'

const createMessage = async (key: string, message: IMessage): Promise<IMessage> => {
  const chat = await Chat.findOne({ key })
  if (!chat) {
    throw new Error('Chat not found')
  }

  chat.messages.push(message)
  await chat.save()

  return message
}

export const registerMessage = async (key: string, user: string, content: string): Promise<IMessage> => {
  return await createMessage(key, { user, type: 'message', content })
}

export const registerJoinMsg = async (key: string, user: string): Promise<IMessage> => {
  return await createMessage(key, { user, type: 'join' })
}

export const registerLeaveMsg = async (key: string, user: string): Promise<IMessage> => {
  return await createMessage(key, { user, type: 'leave' })
}
