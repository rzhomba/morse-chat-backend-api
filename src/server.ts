import express from 'express'
import cors from 'cors'
import http from 'http'
import cookieParser from 'cookie-parser'
import mongoose from 'mongoose'
import { applicationPort, dbConnection, corsOrigin } from './utils/env'
import { SIOServer, SIOSocket } from './types/socket.types'
import registerListeners from './listeners'
import router from './routes/index'
import { socketAuth } from './middleware/auth'

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

const io = new SIOServer(server, {
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
