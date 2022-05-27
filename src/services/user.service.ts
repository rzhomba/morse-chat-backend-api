import randomstring from 'randomstring'
import { Chat } from '../models/chat'
import { IUser, UserRole } from '../types/user.interface'

export const generateName = (): string => {
  return randomstring.generate({
    length: 4,
    charset: 'alphabetic',
    capitalization: 'uppercase'
  })
}

export const initializeUser = async (key: string, name: string, role: UserRole = 'member'): Promise<IUser> => {
  const chat = await Chat.findOne({ key })
  if (!chat) {
    throw new Error('Chat not found')
  }

  const user = { name, role } as IUser
  chat.users.push(user)
  await chat.save()

  return user
}

export const findUser = async (key: string, name: string): Promise<IUser> => {
  const query = await Chat
    .aggregate([
      { $match: { key } },
      { $unwind: '$users' },
      { $match: { 'users.name': name } },
      { $project: { users: 1 } }
    ])

  if (!query || query.length === 0) {
    throw new Error(`User ${name} not found`)
  }

  return query[0].users as IUser
}

export const removeUser = async (key: string, name: string): Promise<void> => {
  const chat = await Chat.findOne({ key })
  if (!chat) {
    throw new Error('Chat not found')
  }

  chat.users = chat.users.filter(i => i.name !== name)
  chat.save()
}
