import Message from '../models/Message.js'
import Conversation from '../models/Conversation.js'

// CREATE MESSAGE
export const createMessage = async (req, res) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc
  })

  try {
    const savedMessage = await newMessage.save()

    // Update conversation last message
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc
        }
      },
      { new: true }
    )

    res.status(201).json(savedMessage)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.id
    })
    res.status(200).json(messages)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}