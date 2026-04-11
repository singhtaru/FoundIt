const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const STORE_PATH = path.join(__dirname, '..', 'data', 'store.json');
const EMPTY_STORE = { users: [], items: [] };

async function readStore() {
  try {
    const raw = await fs.readFile(STORE_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      items: Array.isArray(parsed.items) ? parsed.items : [],
    };
  } catch {
    return { ...EMPTY_STORE };
  }
}

async function writeStore(data) {
  const safe = {
    users: Array.isArray(data.users) ? data.users : [],
    items: Array.isArray(data.items) ? data.items : [],
  };
  await fs.writeFile(STORE_PATH, JSON.stringify(safe, null, 2), 'utf8');
}

function createId() {
  return crypto.randomUUID();
}

module.exports = {
  readStore,
  writeStore,
  createId,
};
