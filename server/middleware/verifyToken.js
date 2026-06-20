import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'You are not authenticated!' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: 'Token is invalid!' })
    req.userId = payload.id
    req.isSeller = payload.isSeller
    next()
  })
}