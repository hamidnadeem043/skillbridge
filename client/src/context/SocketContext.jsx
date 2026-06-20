import { createContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useSelector } from 'react-redux'

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { currentUser } = useSelector(state => state.user)

  useEffect(() => {
    const newSocket = io('http://localhost:5000')
    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit('newUser', currentUser._id)
    }
  }, [socket, currentUser])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}