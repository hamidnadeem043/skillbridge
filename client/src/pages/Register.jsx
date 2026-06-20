import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    country: '',
    isSeller: false,
    description: ''
  })
  const navigate = useNavigate()

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setFormData({ ...formData, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData)
      navigate('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-10">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">

        <h1 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="username"
            type="text"
            placeholder="Username"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
          />
          <input
            name="country"
            type="text"
            placeholder="Country"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500"
          />
          <textarea
            name="description"
            placeholder="Tell us about yourself (optional)"
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-green-500 resize-none h-24"
          />
          <label className="flex items-center gap-2 text-gray-600">
            <input
              name="isSeller"
              type="checkbox"
              onChange={handleChange}
              className="w-4 h-4 accent-green-600"
            />
            I want to work as a Freelancer
          </label>

          <button
            type="submit"
            className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium mt-2"
          >
            Create Account
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{' '}
          <Link to='/login' className="text-green-600 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register