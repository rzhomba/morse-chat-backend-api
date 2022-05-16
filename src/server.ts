import express from 'express'
import http from 'http'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { applicationPort, dbConnection } from './utils/env'
import { SIOServer, SIOSocket } from './types/socket.types'
import registerListeners from './listeners'
import router from './routes/index'

const app = express()
const server = http.createServer(app)

mongoose.connect(dbConnection, {
  autoIndex: false
})
mongoose.connection
  .on('error', (error) => {
    console.warn(error)
  })
  .once('open', () => {
    console.log('Connected to database')
  })

app.use(express.json())
app.use(cookieParser())
app.use(router)

const io = new SIOServer(server)

io.on('connection', async (socket: SIOSocket) => {
  console.log('user connected')
  await registerListeners(io, socket)
})

server.listen(applicationPort, () => {
  console.log(`listening on *:${applicationPort}`)
})
