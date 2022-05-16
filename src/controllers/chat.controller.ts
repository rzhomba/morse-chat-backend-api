import { Request, Response, NextFunction } from 'express'
import { initializeChat, findChat } from '../services/chat.service'

export const createChat = async (req: Request, res: Response, next?: NextFunction) => {
  const chat = await initializeChat()
  res.send(chat)

  if (next) {
    next()
  }
}

export const getChat = async (req: Request, res: Response, next?: NextFunction) => {
  const key = req.params.key as string
  const chat = await findChat(key)

  res.send(chat)

  if (next) {
    next()
  }
}
