import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { loginStart, loginSuccess, loginFailure } from '../redux/userSlice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(loginStart())
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login',
        { email, password },
        { withCredentials: true }
      )
      dispatch(loginSuccess(res.data))
      navigate('/')
    } catch (error) {
      dispatch(loginFailure())
      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome Back!</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="hamid@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
            />
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium mt-2"
          >
            Login
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don't have an account?{' '}
          <Link to='/register' className="text-green-600 hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login