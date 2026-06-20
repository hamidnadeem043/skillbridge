import express from 'express'
import {
  createPaymentIntent,
  confirmOrder,
  getOrders
} from '../controllers/order.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/create-payment-intent', verifyToken, createPaymentIntent)
router.put('/confirm/:payment_intent', verifyToken, confirmOrder)
router.get('/', verifyToken, getOrders)

export default router