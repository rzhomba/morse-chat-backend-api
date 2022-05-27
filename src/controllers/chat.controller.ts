import { Request, Response, NextFunction } from 'express'
import { initializeChat, findChat, removeChat } from '../services/chat.service'
import { generateName, initializeUser, findUser, removeUser } from '../services/user.service'
import { createToken } from '../services/auth.service'
import { IChat } from '../types/chat.interface'
import { emitJoin, emitLeave } from '../services/sockets.service'
import { ChatRequest, ChatResponse, SuccessResponse } from '../types/request.types'
import { IUser, UserRole } from '../types/user.interface'
import { cookiesDomain } from '../utils/env'

const createUser = async (res: Response, chat: IChat, admin: boolean = false): Promise<IUser> => {
  const name = generateName()
  const role: UserRole = admin ? 'admin' : 'member'
  const user = await initializeUser(chat.key, name, role)
  const token = await createToken(chat.key, user.name)
  await emitJoin(chat.key, user.name)

  res.cookie('jwt', token, {
    httpOnly: true,
    domain: cookiesDomain,
    sameSite: true
  })

  return user
}

export const createChat = async (req: Request, res: ChatResponse, next?: NextFunction) => {
  const chat = await initializeChat()
  const user = await createUser(res, chat, true)

  const resChat = await findChat(chat.key)
  res.send({
    key: resChat.key,
    users: resChat.users,
    messages: resChat.messages,
    user
  })

  if (next) {
    next()
  }
}

export const getChat = async (req: ChatRequest, res: ChatResponse, next?: NextFunction) => {
  const key = req.params.key
  const chat = await findChat(key)

  const { auth } = res.locals
  const user = await findUser(auth!.key, auth!.user)

  res.send({
    key: chat.key,
    users: chat.users,
    messages: chat.messages,
    user
  })

  if (next) {
    next()
  }
}
export const deleteChat = async (req: ChatRequest, res: SuccessResponse, next?: NextFunction) => {
  const { auth } = res.locals

  if (!auth) {
    res.send({
      success: false
    })
    if (next) {
      next()
    }
    return
  }

  // TODO: check user role
  await removeChat(auth.key)

  res.clearCookie('jwt')
  res.send({
    success: true
  })

  if (next) {
    next()
  }
}

export const joinChat = async (req: ChatRequest, res: SuccessResponse, next?: NextFunction) => {
  const key = req.params.key as string
  const chat = await findChat(key)

  await createUser(res, chat)

  res.send({
    success: true
  })

  if (next) {
    next()
  }
}

export const leaveChat = async (req: ChatRequest, res: SuccessResponse, next?: NextFunction) => {
  const { auth } = res.locals

  if (!auth) {
    res.send({
      success: false
    })
    if (next) {
      next()
    }
    return
  }

  await removeUser(auth.key, auth.user)
  await emitLeave(auth.key, auth.user)

  res.clearCookie('jwt')
  res.send({
    success: true
  })

  if (next) {
    next()
  }
}
