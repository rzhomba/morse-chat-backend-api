import express from 'express'
import chatRoutes from './chat.route'

const router = express.Router()

router.use('/chat', chatRoutes)

export default router
