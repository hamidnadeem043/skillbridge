import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/userSlice'
import { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { SocketContext } from '../context/SocketContext'

const Navbar = () => {
  const { currentUser } = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = useContext(SocketContext)
  const [unreadCount, setUnreadCount] = useState(0)

  // Fetch unread count
  useEffect(() => {
    if (!currentUser) return

    const fetchUnread = async () => {
      try {
        const res = await axios.get('https://skillbridge-production-cfdd.up.railway.app/api/conversations', {
          withCredentials: true
        })
        const unread = res.data.filter(c =>
  c.lastMessage && (currentUser.isSeller ? !c.readBySeller : !c.readByBuyer)
).length
        setUnreadCount(unread)
      } catch (error) {
        console.log(error)
      }
    }
    fetchUnread()
  }, [currentUser])

  // Listen for new messages in real-time
  useEffect(() => {
    if (!socket) return

    socket.on('receiveMessage', () => {
      setUnreadCount(prev => prev + 1)
    })

    return () => socket.off('receiveMessage')
  }, [socket])

  const handleLogout = async () => {
    try {
      await axios.post('https://skillbridge-production-cfdd.up.railway.app/api/auth/logout', {}, { withCredentials: true })
      dispatch(logout())
      navigate('/')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <nav className="flex items-center justify-between px-10 py-4 bg-white shadow-md">

      <Link to='/' className="text-2xl font-bold text-green-600">
  SkillBridge
</Link>

      <div className="flex items-center gap-6">
        <Link to='/gigs' className="text-gray-600 hover:text-green-600">
          Browse Gigs
        </Link>

        {!currentUser ? (
          <>
            <Link to='/login' className="text-gray-600 hover:text-green-600">
              Login
            </Link>
            <Link to='/register' className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Join
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-4">
            {currentUser.isSeller && (
              <Link to='/my-gigs' className="text-gray-600 hover:text-green-600">
                My Gigs
              </Link>
            )}
            <Link to='/orders' className="text-gray-600 hover:text-green-600">
              Orders
            </Link>

            {/* Messages with notification badge */}
            <Link
              to='/messages'
              onClick={() => setUnreadCount(0)}
              className="text-gray-600 hover:text-green-600 relative"
            >
              Messages
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="flex items-center gap-2">
              {currentUser.profilePic && (
                <img src={currentUser.profilePic} alt="" className="w-8 h-8 rounded-full object-cover" />
              )}
              <span className="text-gray-700 font-medium">{currentUser.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-red-500 hover:text-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar