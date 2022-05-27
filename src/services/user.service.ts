import randomstring from 'randomstring'
import { Chat } from '../models/chat'
import { IUser } from '../types/user.interface'

export const generateName = (): string => {
  return randomstring.generate({
    length: 4,
    charset: 'alphabetic',
    capitalization: 'uppercase'
  })
}

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

export const userJoined = async (key: string, name: string): Promise<boolean> => {
  const user = await Chat.exists({
    $and: [
      { key },
      { 'users.name': name }]
  }).exec()

  return user !== null
}
