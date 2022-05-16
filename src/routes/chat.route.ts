import express from 'express'
import * as chatController from '../controllers/chat.controller'

const router = express.Router()

router.route('/').post(chatController.createChat)
router.route('/:key').get(chatController.getChat)

export default router
