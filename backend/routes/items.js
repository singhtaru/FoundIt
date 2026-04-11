const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { auth, adminAuth } = require('../middleware/auth');
const Item = require('../models/Item');
const User = require('../models/User');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

const toPlainItem = (itemDoc) => {
  const item = itemDoc.toObject ? itemDoc.toObject() : itemDoc;
  return {
    ...item,
    _id: String(item._id),
    reporter: item.reporter
      ? {
          _id: String(item.reporter._id),
          name: item.reporter.name,
          email: item.reporter.email,
        }
      : null,
  };
};

// @route   GET /api/items
// @desc    Get all items with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, category, status, search } = req.query;

    const query = {};
    if (location) query.location = location;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(query)
      .sort({ createdAt: -1 })
      .populate('reporter', 'name email');

    res.json(items.map(toPlainItem));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/items/:id
// @desc    Get item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('reporter', 'name email');
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(toPlainItem(item));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Item not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/items
// @desc    Report a new item
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, description, location, category } = req.body;
  const image = req.file ? path.join('uploads', req.file.filename).replace(/\\/g, '/') : null;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found for token' });
    }

    const item = new Item({
      name,
      description,
      location,
      category,
      status: 'Pending',
      image,
      reporter: req.user.id,
      reporterEmail: user.email,
    });

    await item.save();

    const populatedItem = await Item.findById(item._id).populate('reporter', 'name email');
    res.json(toPlainItem(populatedItem));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT /api/items/:id
// @desc    Update item status (admin only)
// @access  Private/Admin
router.put('/:id', auth, adminAuth, async (req, res) => {
  const { status } = req.body;

  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = status;
    await item.save();

    const populatedItem = await Item.findById(item._id).populate('reporter', 'name email');
    res.json(toPlainItem(populatedItem));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Item not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/items/:id
// @desc    Delete item (admin only)
// @access  Private/Admin
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item removed' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Item not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;