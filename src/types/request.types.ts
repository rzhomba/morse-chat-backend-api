import { Request, Response } from 'express'
import { IChat } from './chat.interface'
import { IUser } from './user.interface'

interface ResponseLocals {
  auth?: {
    key: string
    user: string
  }
}

interface ChatData extends IChat {
  user: IUser
}

interface SuccessData {
  success: boolean
}

export interface ChatRequest extends Request {
  params: { key: string }
}

export interface ChatResponse extends Response<ChatData> {
  locals: ResponseLocals
}

export interface SuccessResponse extends Response<SuccessData> {
  locals: ResponseLocals
}
