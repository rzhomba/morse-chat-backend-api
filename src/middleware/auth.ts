import jwt, { JwtPayload } from 'jsonwebtoken'
import { parse } from 'cookie'
import { NextFunction, Request, Response } from 'express'
import { SIOSocket } from '../types/socket.types'
import { jwtSecret } from '../utils/env'
import { Chat } from '../models/chat'

export const socketAuth = async (socket: SIOSocket, next: (err?: Error) => void): Promise<void> => {
  const errorHandler = () => {
    const err = new Error('User authentication failed')
    next(err)
  }

  const cookiesRaw = socket.handshake.headers.cookie
  if (!cookiesRaw) {
    errorHandler()
    return
  }
  const cookies = parse(cookiesRaw)
  const token = cookies.jwt
  if (!token) {
    errorHandler()
    return
  }

  try {
    const result = await auth(token)

    socket.data = {
      key: result.key,
      user: result.user
    }

    next()
  } catch {
    errorHandler()
  }
}

export const routeAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies.jwt as string | undefined
  if (!token) {
    res.status(401).send()
    return
  }

  try {
    const result = await auth(token)
    const queryKey = req.query.key as string
    if (!queryKey || result.key !== queryKey) {
      res.status(401).send()
      return
    }

    req.params.key = result.key
    req.body.user = result.user

    next()
  } catch {
    res.status(401).send()
  }
}

const auth = async (token: string): Promise<{ key: string, user: string }> => {
  const decoded = jwt.verify(token, jwtSecret) as JwtPayload
  const payloadKey = decoded.key as string | undefined
  const payloadUser = decoded.user as string | undefined

  if (!payloadKey || !payloadUser) {
    throw new Error('User authentication failed')
  }

  const check = await Chat.exists({ $and: [{ key: payloadKey }, { 'users.name': payloadUser }] })
  if (!check) {
    throw new Error('User authentication failed')
  }

  return {
    key: payloadKey,
    user: payloadUser
  }
}
