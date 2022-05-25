import express from 'express'
import http from 'http'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './routes/index'
import { SocketIO } from './utils/socket-io'
import { SIOSocket } from './types/socket.types'
import { socketAuth } from './middleware/auth'
import registerListeners from './listeners'
import { applicationPort, dbConnection, corsOrigin } from './utils/env'

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
app.use(cors({
  origin: corsOrigin,
  credentials: true,
  optionsSuccessStatus: 200
}))
app.use(cookieParser())
app.use(router)

const io = SocketIO.instance().initialize(server, {
  cors: {
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST']
  }
})

io.use(socketAuth)

io.on('connection', async (socket: SIOSocket) => {
  await registerListeners(io, socket)
})

server.listen(applicationPort, () => {
  console.log(`listening on *:${applicationPort}`)
})
