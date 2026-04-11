const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const Item = require('../models/Item');
const { readStore } = require('../lib/store');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function normalizeDate(value, fallback = new Date()) {
  const parsed = new Date(value || fallback);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

async function migrateUsers(storeUsers) {
  const userIdMap = new Map();
  let created = 0;
  let reused = 0;

  for (const sourceUser of storeUsers) {
    const email = normalizeEmail(sourceUser.email);
    if (!email) {
      continue;
    }

    const existing = await User.findOne({ email });
    if (existing) {
      userIdMap.set(String(sourceUser._id), String(existing._id));
      reused += 1;
      continue;
    }

    const createdUser = await User.create({
      name: String(sourceUser.name || 'Unknown User').trim() || 'Unknown User',
      email,
      password: String(sourceUser.password || ''),
      role: sourceUser.role === 'admin' ? 'admin' : 'student',
      createdAt: normalizeDate(sourceUser.createdAt),
      updatedAt: normalizeDate(sourceUser.updatedAt),
    });

    userIdMap.set(String(sourceUser._id), String(createdUser._id));
    created += 1;
  }

  return { userIdMap, created, reused };
}

async function migrateItems(storeItems, userIdMap) {
  let created = 0;
  let reused = 0;

  for (const sourceItem of storeItems) {
    const reporterSourceId = String(sourceItem.reporter || '');
    const reporterId = userIdMap.get(reporterSourceId);

    if (!reporterId) {
      continue;
    }

    const itemDate = normalizeDate(sourceItem.date || sourceItem.createdAt);
    const existing = await Item.findOne({
      name: String(sourceItem.name || '').trim(),
      description: String(sourceItem.description || '').trim(),
      reporterEmail: String(sourceItem.reporterEmail || '').trim(),
      date: itemDate,
    });

    if (existing) {
      reused += 1;
      continue;
    }

    const claimRequests = Array.isArray(sourceItem.claimRequests)
      ? sourceItem.claimRequests
          .filter((entry) => String(entry?.userId || '').trim())
          .map((entry) => ({
            userId: userIdMap.get(String(entry.userId)) || String(entry.userId),
            userName: String(entry.userName || 'Unknown User').trim() || 'Unknown User',
            userEmail: String(entry.userEmail || '').trim(),
            message: String(entry.message || '').trim(),
            createdAt: normalizeDate(entry.createdAt),
          }))
      : [];

    await Item.create({
      name: String(sourceItem.name || '').trim(),
      description: String(sourceItem.description || '').trim(),
      location: String(sourceItem.location || '').trim(),
      category: String(sourceItem.category || '').trim(),
      date: itemDate,
      status: String(sourceItem.status || 'Pending').trim() || 'Pending',
      image: sourceItem.image ? String(sourceItem.image) : null,
      reporter: reporterId,
      reporterEmail: String(sourceItem.reporterEmail || '').trim(),
      claimRequests,
      createdAt: normalizeDate(sourceItem.createdAt, itemDate),
      updatedAt: normalizeDate(sourceItem.updatedAt, itemDate),
    });

    created += 1;
  }

  return { created, reused };
}

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Set it in backend/.env first.');
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });

  const store = await readStore();
  const { userIdMap, created: usersCreated, reused: usersReused } = await migrateUsers(store.users || []);
  const { created: itemsCreated, reused: itemsReused } = await migrateItems(store.items || [], userIdMap);

  console.log('Migration completed');
  console.log(`Users created: ${usersCreated}, existing reused: ${usersReused}`);
  console.log(`Items created: ${itemsCreated}, existing reused: ${itemsReused}`);
}

run()
  .catch((err) => {
    console.error(`Migration failed: ${err.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
