import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  sellerId: {
    type: String,
    required: true
  },
  buyerId: {
    type: String,
    required: true
  },
  readBySeller: {
    type: Boolean,
    default: false
  },
  readByBuyer: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    type: String
  }
}, { timestamps: true })

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation