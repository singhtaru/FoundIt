const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Found', 'Claimed', 'Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  image: {
    type: String, // path to uploaded image
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reporterEmail: {
    type: String,
    required: true,
  },
  claimRequests: [
    {
      userId: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      userEmail: {
        type: String,
      },
      message: {
        type: String,
        default: '',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Item', itemSchema);