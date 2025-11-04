# Quick Start Guide

This guide will help you get the Gifalot project running on localhost quickly.

## Prerequisites

- Node.js (v16+) and npm
- PostgreSQL (v15+) or Docker
- Redis (v7+) or Docker
- Git

## Step 1: Clone and Setup

```bash
# If you haven't cloned yet
git clone <repository-url>
cd Gifalot
```

## Step 2: Backend Setup

```bash
cd gif-j-backend

# Install dependencies
npm install

# Copy environment template
cp env.template .env

# Edit .env with your settings (minimum required):
# - POSTGRES_HOST, POSTGRES_PORT, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
# - REDIS_HOST, REDIS_PORT, REDIS_PASSWORD
# - JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET (generate random strings)
```

## Step 3: Database Setup

### Option A: Using Docker (Easiest)

```bash
cd gif-j-backend

# Start PostgreSQL and Redis
docker-compose up -d postgres redis

# Wait a few seconds for services to start
```

### Option B: Local Installation

1. Start PostgreSQL service
2. Create database: `CREATE DATABASE gifalot;`
3. Start Redis service

## Step 4: Start Backend

```bash
cd gif-j-backend

# Run migrations (automatic on first start)
npm run migration:run

# Start the backend
npm run start:dev
```

Backend should be running at: `http://localhost:3000/gif-j/`

## Step 5: Frontend Setup

```bash
# In a new terminal
cd gif-j-react

# Install dependencies
npm install

# Optional: Copy environment template if you need custom API URL
cp env.template .env
```

## Step 6: Start Frontend

```bash
cd gif-j-react

# Start the frontend
npm start
```

Frontend should open at: `http://localhost:3000` (or next available port)

## Troubleshooting

### Backend won't start

1. **Database connection error**: Check PostgreSQL is running and credentials match `.env`
2. **Redis connection error**: Check Redis is running and credentials match `.env`
3. **Port 3000 already in use**: Change `PORT=3001` in backend `.env` and update frontend `REACT_APP_API_URL`

### Frontend won't connect to backend

1. Verify backend is running: `curl http://localhost:3000/gif-j/`
2. Check `REACT_APP_API_URL` in frontend `.env` matches backend URL
3. Check browser console for CORS errors

### Migrations failing

1. Ensure database exists: `CREATE DATABASE gifalot;`
2. Check database user has proper permissions
3. Try running manually: `npm run migration:run`

## Next Steps

- See [SETUP.md](./SETUP.md) for detailed documentation
- See [README.md](./README.md) for project overview

