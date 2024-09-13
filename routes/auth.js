const express = require('express')
const { registerUser, loginUser, resetPassword } = require('../controllers/auth')
const router = express.Router()

// Register User
router.post('/register', registerUser)

// Login User
router.post('/login', loginUser)

// Reset Password
router.post('/reset-password', resetPassword)

module.exports = router