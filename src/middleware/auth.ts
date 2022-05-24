import jwt, { JwtPayload } from 'jsonwebtoken'
import { parse } from 'cookie'
import { NextFunction, Request, Response } from 'express'
import { SIOSocket } from '../types/socket.types'
import { jwtSecret } from '../utils/env'
import { Chat } from '../models/chat'

/**
 * Socket.IO auth middleware.
 * Passes data among socket on success, but does not block further execution on authentication failure.
 * Leaks the check if the token is valid for the listened event due to inability to check event data inside,
 * additional check event in listener must be performed.
 */
export const socketAuth = async (socket: SIOSocket, next: (err?: Error) => void): Promise<void> => {
  const cookiesRaw = socket.handshake.headers.cookie
  if (!cookiesRaw) {
    next()
    return
  }
  const cookies = parse(cookiesRaw)
  const token = cookies.jwt
  if (!token) {
    next()
    return
  }

  try {
    const result = await auth(token)

    socket.data.auth = {
      key: result.key,
      user: result.user
    }

    next()
  } catch {
    next()
  }
}

/**
 * Express auth middleware.
 * Blocks further execution and responses with 401 code on authentication failure.
 */
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
