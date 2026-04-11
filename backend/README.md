# FoundIt Backend

Backend API for the FoundIt VIT lost and found system.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Set up MongoDB locally or update MONGO_URI in .env

3. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register a new user
- POST /api/auth/signin - Login user

### Items
- GET /api/items - Get all items (with optional filters: location, category, status, search)
- GET /api/items/:id - Get item by ID
- POST /api/items - Report a new item (requires auth, supports image upload)
- PUT /api/items/:id - Update item status (admin only)
- DELETE /api/items/:id - Delete item (admin only)

## Environment Variables
- MONGO_URI: MongoDB connection string
- JWT_SECRET: Secret for JWT tokens
- PORT: Server port (default 5000)