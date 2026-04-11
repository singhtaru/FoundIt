const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

const sendAuthResponse = (res, authUser) => {
  const payload = {
    user: {
      id: authUser._id,
      role: authUser.role,
    },
  };

  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      console.error('JWT sign error:', err.message);
      return res.status(500).json({ message: 'Failed to create authentication token' });
    }

    return res.json({
      token,
      user: {
        id: authUser.id,
        name: authUser.name,
        email: authUser.email,
        role: authUser.role,
      },
    });
  });
};

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'student',
    });

    await newUser.save();

    return sendAuthResponse(res, newUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', async (req, res) => {
  const { email, password, loginType = 'user' } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!['user', 'admin'].includes(loginType)) {
      return res.status(400).json({ message: 'Invalid login type' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const foundUser = await User.findOne({ email: normalizedEmail });
    if (!foundUser) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (loginType === 'admin' && foundUser.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access denied for this account' });
    }

    if (loginType === 'user' && foundUser.role === 'admin') {
      return res.status(403).json({ message: 'Use Admin Login for admin accounts' });
    }

    return sendAuthResponse(res, foundUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
