import express from 'express'
import * as chatController from '../controllers/chat.controller'
import { routeAuth } from '../middleware/auth'

const router = express.Router()

router.route('/').post(chatController.createChat)
router.route('/:key').get(routeAuth, chatController.getChat)
router.route('/join/:key').post(chatController.joinChat)
router.route('/leave/:key').delete(routeAuth, chatController.leaveChat)

export default router
