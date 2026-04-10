const express = require('express');
const multer = require('multer');
const path = require('path');
const Item = require('../models/Item');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// @route   GET /api/items
// @desc    Get all items with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, category, status, search } = req.query;
    let query = {};

    if (location) query.location = location;
    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Item.find(query).populate('reporter', 'name email').sort({ createdAt: -1 });
    res.json(items);
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
    res.json(item);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/items
// @desc    Report a new item
// @access  Private
router.post('/', auth, upload.single('image'), async (req, res) => {
  const { name, description, location, category } = req.body;
  const image = req.file ? req.file.path : null;

  try {
    const user = await require('../models/User').findById(req.user.id);
    const newItem = new Item({
      name,
      description,
      location,
      category,
      image,
      reporter: req.user.id,
      reporterEmail: user.email,
    });

    const item = await newItem.save();
    res.json(item);
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
    let item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.status = status;
    await item.save();

    res.json(item);
  } catch (err) {
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

    await item.remove();
    res.json({ message: 'Item removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;