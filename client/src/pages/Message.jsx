import { useEffect, useState, useRef, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'

const Message = () => {
  const { id } = useParams()
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [conversation, setConversation] = useState(null)
  const { currentUser } = useSelector(state => state.user)
  const messagesEndRef = useRef(null)
  const socket = useContext(SocketContext)

  // Fetch conversation to know who we're talking to
  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const res = await axios.get(`https://skillbridge-production-cfdd.up.railway.app/api/conversations/single/${id}`, {
          withCredentials: true
        })
        setConversation(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchConversation()
  }, [id])

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`https://skillbridge-production-cfdd.up.railway.app/api/messages/${id}`, {
          withCredentials: true
        })
        setMessages(res.data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchMessages()
  }, [id])

  // Listen for incoming real-time messages
  useEffect(() => {
    if (!socket) return

    socket.on('receiveMessage', (data) => {
      if (data.conversationId === id) {
        setMessages(prev => [...prev, data])
      }
    })

    return () => socket.off('receiveMessage')
  }, [socket, id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !conversation) return

    try {
      const res = await axios.post(
        'https://skillbridge-production-cfdd.up.railway.app/api/messages',
        { conversationId: id, desc: text },
        { withCredentials: true }
      )

      setMessages(prev => [...prev, res.data])
      setText('')

      // Send via socket to the other user instantly
      const receiverId = currentUser._id === conversation.sellerId
        ? conversation.buyerId
        : conversation.sellerId

      socket.emit('sendMessage', {
        receiverId,
        data: res.data
      })

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

      <div className="bg-white border border-gray-200 rounded-xl h-[60vh] flex flex-col">

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-md px-4 py-2 rounded-2xl text-sm ${
                m.userId === currentUser._id
                  ? 'bg-green-600 text-white self-end rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 self-start rounded-bl-sm'
              }`}
            >
              {m.desc}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="border-t border-gray-200 p-4 flex gap-2">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none focus:border-green-500"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-full hover:bg-green-700"
          >
            Send
          </button>
        </form>

      </div>
    </div>
  )
}

export default Message