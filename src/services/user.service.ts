import { Chat } from '../models/chat'
import { IUser } from '../types/user.interface'

export const initializeUser = async (key: string, name: string): Promise<IUser> => {
  const chat = await Chat.findOne({ key })
  if (!chat) {
    throw new Error('Chat not found')
  }

  const user = { name } as IUser
  chat.users.push(user)
  await chat.save()

  return user
}

export const removeUser = async (key: string, name: string): Promise<void> => {
  const chat = await Chat.findOne({ key })
  if (!chat) {
    throw new Error('Chat not found')
  }

  chat.users = chat.users.filter(i => i.name !== name)
  chat.save()
}
