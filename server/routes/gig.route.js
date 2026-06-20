import express from 'express'
import {
  createGig,
  deleteGig,
  getGig,
  getGigs
} from '../controllers/gig.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router()

router.post('/', verifyToken, createGig)        // protected
router.delete('/:id', verifyToken, deleteGig)   // protected
router.get('/single/:id', getGig)               // public
router.get('/', getGigs)                        // public

export default router