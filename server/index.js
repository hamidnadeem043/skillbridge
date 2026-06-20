import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { createServer } from 'http'
import { Server } from 'socket.io'

import authRoute from './routes/auth.route.js'
import gigRoute from './routes/gig.route.js'
import orderRoute from './routes/order.route.js'
import messageRoute from './routes/message.route.js'
import conversationRoute from './routes/conversation.route.js'
import uploadRoute from './routes/upload.route.js'
import reviewRoute from './routes/review.route.js'




dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRoute)
app.use('/api/gigs', gigRoute)
app.use('/api/orders', orderRoute)
app.use('/api/messages', messageRoute)
app.use('/api/conversations', conversationRoute)
app.use('/api/upload', uploadRoute)
app.use('/api/reviews', reviewRoute)

app.get('/', (req, res) => {
  res.send('FreelanceHub API is running!')
})

// Create HTTP server (needed for Socket.io)
const httpServer = createServer(app)

// Attach Socket.io to the server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true
  }
})

// Keep track of online users
let onlineUsers = []

const addUser = (userId, socketId) => {
  if (!onlineUsers.some(user => user.userId === userId)) {
    onlineUsers.push({ userId, socketId })
  }
}

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
  return onlineUsers.find(user => user.userId === userId)
}

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  // When user comes online
  socket.on('newUser', (userId) => {
    addUser(userId, socket.id)
  })

  // When user sends a message
  socket.on('sendMessage', ({ receiverId, data }) => {
    const receiver = getUser(receiverId)
    if (receiver) {
      io.to(receiver.socketId).emit('receiveMessage', data)
    }
  })

  // When user disconnects
  socket.on('disconnect', () => {
    removeUser(socket.id)
    console.log('A user disconnected:', socket.id)
  })
})

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✅ MongoDB connected!')
    httpServer.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`)
    })
  } catch (error) {
    console.log('❌ Connection error:', error.message)
  }
}

connectDB()