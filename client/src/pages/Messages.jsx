import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import axios from 'axios'

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    const fetchConversations = async () => {
      setLoading(true)
      try {
        const res = await axios.get('https://skillbridge-production-cfdd.up.railway.app/api/conversations', {
          withCredentials: true
        })
        setConversations(res.data)
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    fetchConversations()
  }, [])

  if (loading) return <div className="text-center py-20">Loading...</div>

  return (
    <div className="max-w-3xl mx-auto px-10 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Messages</h1>

      {conversations.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="text-xl font-semibold text-gray-700">No conversations yet</h3>
          <p className="text-gray-500 mt-2">Start a conversation from your orders</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map(c => (
            <Link
              key={c.id}
              to={`/message/${c.id}`}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser.isSeller ? 'B' : 'S'}
                </div>
                <div>
                  <p className="font-medium text-gray-800">
                    {currentUser.isSeller ? 'Buyer' : 'Seller'}
                  </p>
                  <p className="text-sm text-gray-500 truncate max-w-xs">
                    {c.lastMessage || 'No messages yet'}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(c.updatedAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default Messages