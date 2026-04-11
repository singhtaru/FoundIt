const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { createId, readStore, writeStore } = require('../lib/store');

const router = express.Router();

const DEFAULT_ADMIN_EMAIL = (process.env.DEFAULT_ADMIN_EMAIL || 'admin@foundit.vit').toLowerCase();
const DEFAULT_ADMIN_PASSWORD = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@12345';

function canUseMongo() {
  return mongoose.connection.readyState === 1;
}

async function ensureFallbackAdmin(store) {
  const hasAdmin = store.users.some((entry) => entry.role === 'admin');
  if (hasAdmin) {
    return false;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, salt);

  store.users.push({
    _id: createId(),
    name: 'FoundIt Admin',
    email: DEFAULT_ADMIN_EMAIL,
    password: hashedPassword,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return true;
}

function sendAuthResponse(res, user) {
  const userId = String(user._id || user.id);
  const payload = {
    user: {
      id: userId,
      role: user.role,
    },
  };

  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      throw err;
    }

    res.json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
}

// @route   POST /api/auth/signup
// @desc    Register user
// @access  Public
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const normalizedEmail = email.toLowerCase();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (canUseMongo()) {
      try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role: 'student',
        });

        await user.save();
        return sendAuthResponse(res, user);
      } catch (err) {
        console.error(`Mongo signup failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const existingUser = store.users.find((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = {
      _id: createId(),
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: 'student',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.users.push(user);
    await writeStore(store);
    return sendAuthResponse(res, user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/signin
// @desc    Authenticate user & get token
// @access  Public
router.post('/signin', async (req, res) => {
  const { email, password, loginType } = req.body;
  const requestedRole = loginType === 'admin' ? 'admin' : 'user';

  const rejectRoleMismatch = (role) => {
    if (requestedRole === 'admin' && role !== 'admin') {
      return res.status(403).json({ message: 'Admin login requires an admin account.' });
    }

    if (requestedRole === 'user' && role === 'admin') {
      return res.status(403).json({ message: 'Use Admin Login for admin accounts.' });
    }

    return null;
  };

  try {
    const normalizedEmail = String(email || '').toLowerCase();

    if (canUseMongo()) {
      try {
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
          }

          const mismatch = rejectRoleMismatch(user.role);
          if (mismatch) {
            return mismatch;
          }

          return sendAuthResponse(res, user);
        }
      } catch (err) {
        console.error(`Mongo signin failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const adminAdded = await ensureFallbackAdmin(store);
    if (adminAdded) {
      await writeStore(store);
    }

    const user = store.users.find((entry) => entry.email.toLowerCase() === normalizedEmail);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const mismatch = rejectRoleMismatch(user.role);
    if (mismatch) {
      return mismatch;
    }

    return sendAuthResponse(res, user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;