import Order from '../models/Order.js'
import Gig from '../models/Gig.js'
import Stripe from 'stripe'

export const createPaymentIntent = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

  try {
    const gig = await Gig.findById(req.body.gigId)
    if (!gig) return res.status(404).json({ message: 'Gig not found!' })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: gig.price * 100,
      currency: 'usd',
      automatic_payment_methods: { enabled: true }
    })

    // Create order
    const newOrder = new Order({
      gigId: gig._id,
      img: gig.coverImage,
      title: gig.title,
      buyerId: req.userId,
      sellerId: gig.userId,
      price: gig.price,
      payment_intent: paymentIntent.id
    })

    await newOrder.save()
    res.status(200).json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.log('PAYMENT ERROR:', error.message)
    res.status(500).json({ message: error.message })
  }
}

export const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { payment_intent: req.params.payment_intent },
      { isCompleted: true },
      { new: true }
    )
    res.status(200).json({ message: 'Order confirmed!', order })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getOrders = async (req, res) => {
  try {
    const sellingOrders = await Order.find({
      sellerId: req.userId,
      isCompleted: true
    })

    const buyingOrders = await Order.find({
      buyerId: req.userId,
      isCompleted: true
    })

    res.status(200).json({ sellingOrders, buyingOrders })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}