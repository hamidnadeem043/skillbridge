import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// REGISTER
export const register = async (req, res) => {
  try {
    // 1. Get data from request
    const { username, email, password, country, isSeller } = req.body

    // 2. Hash the password (never store plain text!)
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // 3. Create new user in MongoDB
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      country,
      isSeller
    })

    // 4. Save to database
    await newUser.save()

    res.status(201).json({ message: 'User registered successfully!' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// LOGIN
export const login = async (req, res) => {
  try {
    // 1. Find user by email
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(404).json({ message: 'User not found!' })

    // 2. Check password
    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password)
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Wrong password!' })

    // 3. Create JWT token
    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 4. Send token in cookie + user data
    const { password, ...userInfo } = user._doc

    res.cookie('token', token, {
      httpOnly: true,
      secure: false
    }).status(200).json(userInfo)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// LOGOUT
export const logout = async (req, res) => {
  res.clearCookie('token').status(200).json({ message: 'Logged out successfully!' })
}