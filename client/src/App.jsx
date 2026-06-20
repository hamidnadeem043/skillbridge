import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Gigs from './pages/Gigs'
import Gig from './pages/Gig'
import Orders from './pages/Orders'
import Messages from './pages/Messages'
import Message from './pages/Message'
import Add from './pages/Add'
import Pay from './pages/Pay'
import MyGigs from './pages/MyGigs'


function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/gigs' element={<Gigs />} />
        <Route path='/gig/:id' element={<Gig />} />
        <Route path='/orders' element={<Orders />} />
        <Route path='/messages' element={<Messages />} />
        <Route path='/message/:id' element={<Message />} />
        <Route path='/add' element={<Add />} />
        <Route path='/pay/:id' element={<Pay />} />
        <Route path='/my-gigs' element={<MyGigs />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App