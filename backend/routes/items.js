const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { auth, adminAuth } = require('../middleware/auth');
const Item = require('../models/Item');
const User = require('../models/User');
const { createId, readStore, writeStore } = require('../lib/store');

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

function canUseMongo() {
  return mongoose.connection.readyState === 1;
}

function normalizeItemPayload(body) {
  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    location: String(body.location || '').trim(),
    category: String(body.category || '').trim(),
  };
}

function validateItemPayload(payload) {
  if (!payload.name || !payload.description || !payload.location || !payload.category) {
    return 'Name, description, location, and category are required.';
  }

  return null;
}

function normalizeClaimMessage(message) {
  return String(message || '').trim();
}

function isClaimableStatus(status) {
  return String(status || '').toLowerCase() === 'pending';
}

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

const withReporter = (item, users) => {
  const reporterId = String(item.reporter && item.reporter._id ? item.reporter._id : item.reporter);
  const reporter = users.find((entry) => String(entry._id) === reporterId);

  return {
    ...item,
    _id: String(item._id),
    claimRequests: Array.isArray(item.claimRequests) ? item.claimRequests : [],
    reporter: reporter
      ? { _id: String(reporter._id), name: reporter.name, email: reporter.email }
      : item.reporter && item.reporter.name
        ? { _id: String(item.reporter._id), name: item.reporter.name, email: item.reporter.email }
        : null,
  };
};

// @route   GET /api/items
// @desc    Get all items with optional filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { location, category, status, search, startDate, endDate } = req.query;

    if (canUseMongo()) {
      try {
        const query = {};
        if (location) query.location = location;
        if (category) query.category = category;
        if (status) query.status = status;
        if (startDate || endDate) {
          query.date = {};
          if (startDate) query.date.$gte = new Date(startDate);
          if (endDate) query.date.$lte = new Date(`${endDate}T23:59:59.999Z`);
        }
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
          ];
        }

        const items = await Item.find(query)
          .sort({ createdAt: -1 })
          .populate('reporter', 'name email');

        return res.json(items.map(toPlainItem));
      } catch (err) {
        console.error(`Mongo items listing failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    let items = [...store.items];

    if (location) items = items.filter((item) => item.location === location);
    if (category) items = items.filter((item) => item.category === category);
    if (status) items = items.filter((item) => item.status === status);
    if (startDate) {
      items = items.filter((item) => new Date(item.date || item.createdAt) >= new Date(startDate));
    }
    if (endDate) {
      items = items.filter((item) => new Date(item.date || item.createdAt) <= new Date(`${endDate}T23:59:59.999Z`));
    }
    if (search) {
      const term = String(search).toLowerCase();
      items = items.filter((item) =>
        item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
      );
    }

    items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return res.json(items.map((item) => withReporter(item, store.users)));
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
    if (canUseMongo()) {
      try {
        const item = await Item.findById(req.params.id).populate('reporter', 'name email');
        if (!item) {
          return res.status(404).json({ message: 'Item not found' });
        }

        return res.json(toPlainItem(item));
      } catch (err) {
        if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Item not found' });
        }

        console.error(`Mongo item fetch failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const item = store.items.find((entry) => String(entry._id) === req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    return res.json(withReporter(item, store.users));
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
  const { date } = req.body;
  const { name, description, location, category } = normalizeItemPayload(req.body);
  const image = req.file ? path.join('uploads', req.file.filename).replace(/\\/g, '/') : null;
  const foundDate = date ? new Date(date) : new Date();
  const validationError = validateItemPayload({ name, description, location, category });

  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  if (Number.isNaN(foundDate.getTime())) {
    return res.status(400).json({ message: 'A valid date is required.' });
  }

  try {
    if (canUseMongo()) {
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
          date: foundDate,
          status: 'Pending',
          image,
          reporter: req.user.id,
          reporterEmail: user.email,
          claimRequests: [],
        });

        await item.save();

        const populatedItem = await Item.findById(item._id).populate('reporter', 'name email');
        return res.json(toPlainItem(populatedItem));
      } catch (err) {
        console.error(`Mongo item create failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const user = store.users.find((entry) => String(entry._id) === req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found for token' });
    }

    const item = {
      _id: createId(),
      name,
      description,
      location,
      category,
      date: foundDate.toISOString(),
      status: 'Pending',
      image,
      reporter: req.user.id,
      reporterEmail: user.email,
      claimRequests: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.items.push(item);
    await writeStore(store);
    return res.json(withReporter(item, store.users));
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
    if (canUseMongo()) {
      try {
        const item = await Item.findById(req.params.id);
        if (!item) {
          return res.status(404).json({ message: 'Item not found' });
        }

        item.status = status;
        await item.save();

        const populatedItem = await Item.findById(item._id).populate('reporter', 'name email');
        return res.json(toPlainItem(populatedItem));
      } catch (err) {
        if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Item not found' });
        }

        console.error(`Mongo item update failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const index = store.items.findIndex((entry) => String(entry._id) === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    store.items[index].status = status;
    store.items[index].updatedAt = new Date().toISOString();
    await writeStore(store);

    return res.json(withReporter(store.items[index], store.users));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Item not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/items/:id/claims
// @desc    Raise a claim request for an item
// @access  Private
router.post('/:id/claims', auth, async (req, res) => {
  const claimMessage = normalizeClaimMessage(req.body.message);

  if (!claimMessage) {
    return res.status(400).json({ message: 'Add identifying details before sending a claim request.' });
  }

  try {
    if (canUseMongo()) {
      try {
        const item = await Item.findById(req.params.id);
        if (!item) {
          return res.status(404).json({ message: 'Item not found' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
          return res.status(401).json({ message: 'User not found for token' });
        }

        if (!isClaimableStatus(item.status)) {
          return res.status(400).json({ message: 'Claims are only allowed while an item is pending review.' });
        }

        if (String(item.reporter) === String(req.user.id)) {
          return res.status(400).json({ message: 'You cannot raise a claim on an item you reported.' });
        }

        const existingClaim = (item.claimRequests || []).find((entry) => entry.userId === String(req.user.id));
        if (existingClaim) {
          return res.status(400).json({ message: 'You already raised a claim for this item.' });
        }

        item.claimRequests.push({
          userId: String(req.user.id),
          userName: user.name,
          userEmail: user.email,
          message: claimMessage,
          createdAt: new Date(),
        });

        await item.save();

        const populatedItem = await Item.findById(item._id).populate('reporter', 'name email');
        return res.json(toPlainItem(populatedItem));
      } catch (err) {
        if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Item not found' });
        }

        console.error(`Mongo claim create failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const itemIndex = store.items.findIndex((entry) => String(entry._id) === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const user = store.users.find((entry) => String(entry._id) === req.user.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found for token' });
    }

    if (!isClaimableStatus(store.items[itemIndex].status)) {
      return res.status(400).json({ message: 'Claims are only allowed while an item is pending review.' });
    }

    if (String(store.items[itemIndex].reporter) === String(req.user.id)) {
      return res.status(400).json({ message: 'You cannot raise a claim on an item you reported.' });
    }

    if (!Array.isArray(store.items[itemIndex].claimRequests)) {
      store.items[itemIndex].claimRequests = [];
    }

    const existingClaim = store.items[itemIndex].claimRequests.find((entry) => entry.userId === String(req.user.id));
    if (existingClaim) {
      return res.status(400).json({ message: 'You already raised a claim for this item.' });
    }

    store.items[itemIndex].claimRequests.push({
      userId: String(req.user.id),
      userName: user.name,
      userEmail: user.email,
      message: claimMessage,
      createdAt: new Date().toISOString(),
    });
    store.items[itemIndex].updatedAt = new Date().toISOString();

    await writeStore(store);
    return res.json(withReporter(store.items[itemIndex], store.users));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/items/:id/claims/me
// @desc    Withdraw the current user's claim request for an item
// @access  Private
router.delete('/:id/claims/me', auth, async (req, res) => {
  try {
    if (canUseMongo()) {
      try {
        const item = await Item.findById(req.params.id);
        if (!item) {
          return res.status(404).json({ message: 'Item not found' });
        }

        if (['Approved', 'Claimed'].includes(item.status)) {
          return res.status(400).json({ message: 'This claim request can no longer be removed.' });
        }

        const originalCount = Array.isArray(item.claimRequests) ? item.claimRequests.length : 0;
        item.claimRequests = (item.claimRequests || []).filter((entry) => entry.userId !== String(req.user.id));

        if (item.claimRequests.length === originalCount) {
          return res.status(404).json({ message: 'Your claim request was not found for this item.' });
        }

        await item.save();

        const populatedItem = await Item.findById(item._id).populate('reporter', 'name email');
        return res.json(toPlainItem(populatedItem));
      } catch (err) {
        if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Item not found' });
        }

        console.error(`Mongo claim delete failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const itemIndex = store.items.findIndex((entry) => String(entry._id) === req.params.id);
    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    if (['Approved', 'Claimed'].includes(store.items[itemIndex].status)) {
      return res.status(400).json({ message: 'This claim request can no longer be removed.' });
    }

    const originalCount = Array.isArray(store.items[itemIndex].claimRequests)
      ? store.items[itemIndex].claimRequests.length
      : 0;

    store.items[itemIndex].claimRequests = (store.items[itemIndex].claimRequests || []).filter(
      (entry) => entry.userId !== String(req.user.id)
    );

    if (store.items[itemIndex].claimRequests.length === originalCount) {
      return res.status(404).json({ message: 'Your claim request was not found for this item.' });
    }

    store.items[itemIndex].updatedAt = new Date().toISOString();
    await writeStore(store);
    return res.json(withReporter(store.items[itemIndex], store.users));
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
    if (canUseMongo()) {
      try {
        const item = await Item.findById(req.params.id);
        if (!item) {
          return res.status(404).json({ message: 'Item not found' });
        }

        await Item.findByIdAndDelete(req.params.id);
        return res.json({ message: 'Item removed' });
      } catch (err) {
        if (err.name === 'CastError') {
          return res.status(404).json({ message: 'Item not found' });
        }

        console.error(`Mongo item delete failed, falling back to file store: ${err.message}`);
      }
    }

    const store = await readStore();
    const index = store.items.findIndex((entry) => String(entry._id) === req.params.id);
    if (index === -1) {
      return res.status(404).json({ message: 'Item not found' });
    }

    store.items.splice(index, 1);
    await writeStore(store);
    return res.json({ message: 'Item removed' });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(404).json({ message: 'Item not found' });
    }
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;