const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// Basic route
app.get('/', (req, res) => {
  res.send('FoundIt Backend API');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start backend:', err.message);
    process.exit(1);
  }
};

startServer();
