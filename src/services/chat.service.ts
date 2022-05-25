import randomstring from 'randomstring'
import { IChat } from '../types/chat.interface'
import { Chat } from '../models/chat'

export const initializeChat = async (): Promise<IChat> => {
  const key = randomstring.generate({ length: 8 })

  const chat = new Chat({
    key,
    users: [],
    messages: []
  })

  return await chat.save()
}

export const findChat = async (key: string): Promise<IChat> => {
  const chat = await Chat
    .findOne({ key })
    .lean()

  if (!chat) {
    throw new Error(`Chat ${chat} not found`)
  }

  return chat
}

export const removeChat = async (key: string): Promise<void> => {
  await Chat
    .findOne({ key })
    .remove()
    .exec()
}
