const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
<<<<<<< HEAD
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    let user = await User.findOne({ email });
    if (user) {
=======
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'student',
    });

    await user.save();

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
<<<<<<< HEAD
      if (err) {
        console.error('JWT sign error:', err.message);
        return res.status(500).json({ message: 'Failed to create authentication token' });
      }
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
=======
      if (err) throw err;
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
<<<<<<< HEAD
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user = await User.findOne({ email });
=======
    const user = await User.findOne({ email: String(email || '').toLowerCase() });
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user._id,
        role: user.role,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
<<<<<<< HEAD
      if (err) {
        console.error('JWT sign error:', err.message);
        return res.status(500).json({ message: 'Failed to create authentication token' });
      }
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
=======
      if (err) throw err;
      res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
