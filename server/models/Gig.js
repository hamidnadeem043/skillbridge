import mongoose from 'mongoose'

const gigSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    required: false
  },
  deliveryTime: {
    type: Number,
    required: true
  },
  revisions: {
    type: Number,
    default: 0
  },
  features: {
    type: [String],
    required: false
  },
  rating: {
    type: Number,
    default: 0
  },
  totalStars: {
    type: Number,
    default: 0
  },
  starNumber: {
    type: Number,
    default: 0
  },
  sales: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const Gig = mongoose.model('Gig', gigSchema)

export default Gig