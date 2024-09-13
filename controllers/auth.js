const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Register a new user

const registerUser = async (req, res) => {
    const { name, email, password } = req.body
    try {
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' })
      }
  
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' })
      }
  
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      const user = new User({ name, email, password: hashedPassword })
      await user.save()
  
      const token = user.createJWT()
      res.status(201).json({ user: user.toJSON(), token })
      
    } catch (error) {
      res.status(500).json({ message: 'Error registering user', error })
    }
  };

// Login a user

const loginUser = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }
  
        const user = await User.findOne({ email })
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }
  
        const token = user.createJWT()
        res.status(200).json({ user: user.toJSON(), token })
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error })
    }
}
  
// Reset Password

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body
    try {
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' })
        }
  
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }
  
        const salt = await bcrypt.genSalt(10)
        user.password = await bcrypt.hash(newPassword, salt)
        await user.save()
  
        res.status(200).json({ message: 'Password updated successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error updating password', error })
    }
}

module.exports = {
  registerUser,
  loginUser,
  resetPassword,
}