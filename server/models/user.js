import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profilePic: {
    type: String,
    default: ''
  },
  country: {
    type: String,
    required: true
  },
  isSeller: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    default: ''
  }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

export default User