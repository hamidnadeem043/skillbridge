import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  gigId: { type: String, required: true },
  userId: { type: String, required: true },
  username: { type: String, required: true },
  star: { type: Number, required: true, min: 1, max: 5 },
  desc: { type: String, required: true }
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)

export default Review