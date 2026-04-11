const express = require('express');
const cors = require('cors');
const path = require('path');
<<<<<<< HEAD
require('dotenv').config({ path: path.join(__dirname, '.env') });
=======
const mongoose = require('mongoose');
require('dotenv').config();
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

<<<<<<< HEAD
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

=======
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

// Basic route
app.get('/', (req, res) => {
  res.send('FoundIt Backend API');
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

<<<<<<< HEAD
const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
=======
async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is missing in .env');
    }

    await mongoose.connect(MONGO_URI);
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
<<<<<<< HEAD
    console.error('Failed to start backend:', err.message);
    process.exit(1);
  }
};

startServer();
=======
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
}

startServer();
>>>>>>> 11219a0ff4c04c88869c2cbdeae58d5c3b33ebcd
