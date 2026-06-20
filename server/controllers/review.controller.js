import Review from '../models/Review.js'
import Gig from '../models/Gig.js'
import Order from '../models/Order.js'

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const existingReview = await Review.findOne({
      gigId: req.body.gigId,
      userId: req.userId
    })
    if (existingReview) {
      return res.status(403).json({ message: 'You already reviewed this gig!' })
    }

    const hasOrdered = await Order.findOne({
      gigId: req.body.gigId,
      buyerId: req.userId,
      isCompleted: true
    })
    if (!hasOrdered) {
      return res.status(403).json({ message: 'You must purchase this gig before reviewing!' })
    }

    const newReview = new Review({
      userId: req.userId,
      username: req.body.username,
      gigId: req.body.gigId,
      desc: req.body.desc,
      star: req.body.star
    })

    const savedReview = await newReview.save()

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 }
    })

    const gig = await Gig.findById(req.body.gigId)
    const newRating = (gig.totalStars / gig.starNumber).toFixed(1)
    await Gig.findByIdAndUpdate(req.body.gigId, { rating: newRating })

    res.status(201).json(savedReview)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET REVIEWS for a gig
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId }).sort({ createdAt: -1 })
    res.status(200).json(reviews)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}