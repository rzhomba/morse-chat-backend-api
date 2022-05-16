import mongoose from 'mongoose'
import { IUser } from '../types/user.interface'
import { IMessage } from '../types/message.interface'
import { IChat } from '../types/chat.interface'
const { Schema, model } = mongoose

const userSchema = new Schema<IUser>({
  name: { type: String, required: true }
})

const messageSchema = new Schema<IMessage>({
  user: { type: String, required: true },
  type: { type: String, required: true },
  content: String
})

const chatSchema = new Schema<IChat>({
  key: { type: String, required: true },
  users: [userSchema],
  messages: [messageSchema]
})

export const Chat = model<IChat>('Chat', chatSchema)
