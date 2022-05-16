import jwt from 'jsonwebtoken'
import { jwtSecret } from '../utils/env'
import { Chat } from '../models/chat'

export const createToken = async (key: string, user: string): Promise<string> => {
  const check = await Chat.exists({
    $and: [
      { key },
      { 'users.name': user }
    ]
  })

  if (!check) {
    throw new Error('User not found')
  }

  return jwt.sign({
    key,
    user
  }, jwtSecret)
}
