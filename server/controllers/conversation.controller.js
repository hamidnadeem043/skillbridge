import Conversation from '../models/Conversation.js'

// CREATE CONVERSATION
export const createConversation = async (req, res) => {
  const newConversation = new Conversation({
    id: req.isSeller ? req.userId + req.body.to : req.body.to + req.userId,
    sellerId: req.isSeller ? req.userId : req.body.to,
    buyerId: req.isSeller ? req.body.to : req.userId,
    readBySeller: req.isSeller,
    readByBuyer: !req.isSeller
  })

  try {
    const savedConversation = await newConversation.save()
    res.status(201).json(savedConversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET SINGLE CONVERSATION
export const getSingleConversation = async (req, res) => {
  try {
    const conversation = await Conversation.findOne({ id: req.params.id })
    if (!conversation) return res.status(404).json({ message: 'Not found!' })
    res.status(200).json(conversation)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET ALL CONVERSATIONS for logged in user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find(
      req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }
    ).sort({ updatedAt: -1 })
    res.status(200).json(conversations)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}