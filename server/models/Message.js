import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

export default Message