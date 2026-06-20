import express from 'express'
import {
  createConversation,
  getSingleConversation,
  getConversations
} from '../controllers/conversation.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createConversation)
router.get('/single/:id', verifyToken, getSingleConversation)
router.get('/', verifyToken, getConversations)

export default router