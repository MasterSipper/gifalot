# Gifalot - Local Development Setup Guide

This project consists of two main components:
- **Backend**: NestJS application (gif-j-backend)
- **Frontend**: React application (gif-j-react)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v7 or higher) - [Download](https://redis.io/download/)
- **Docker** (optional, for running PostgreSQL and Redis) - [Download](https://www.docker.com/get-started)

## Backend Setup (gif-j-backend)

### 1. Install Dependencies

```bash
cd gif-j-backend
npm install
```

### 2. Database Setup

You can either use Docker or install PostgreSQL locally:

#### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL and Redis using Docker Compose
docker-compose up -d postgres redis
```

#### Option B: Local Installation

1. Install and start PostgreSQL locally
2. Create a database:
   ```sql
   CREATE DATABASE gifalot;
   ```

3. Install and start Redis locally

### 3. Environment Variables

Create a `.env` file in the `gif-j-backend` directory. You can copy from the template:

```bash
cp env.template .env
```

Then edit the `.env` file with the following variables:

```env
# Application Configuration
STAGE=local
PORT=3000
SERVICE_NAME_STAGE=gif-j-backend-local

# Database Configuration (PostgreSQL)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=gifalot

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production

# AWS S3 Configuration (for file storage)
# Note: These are required but can use placeholder values for local development
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=eu-central-1
S3_BUCKET_NAME=gifalot-local

# Google reCAPTCHA (optional for local development)
GOOGLE_RECAPTCHA_SECRET_KEY=your-google-recaptcha-secret-key

# GIPHY API (optional)
GIPHY_API_KEY=your-giphy-api-key

# Email Configuration (for password reset, etc.)
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-email-password
```

**Important Notes:**
- Replace the JWT secrets with strong random strings for security
- AWS credentials can be placeholder values for local development if you're not using S3
- Google reCAPTCHA is skipped when `STAGE=local` (see app.module.ts)
- Email configuration is needed for password reset functionality

### 4. Run Database Migrations

The migrations will run automatically when the application starts (migrationsRun: true in typeorm config).

Alternatively, you can run them manually:

```bash
npm run migration:run
```

### 5. Start the Backend

```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run start:prod
```

The backend will be available at: `http://localhost:3000/gif-j/`

## Frontend Setup (gif-j-react)

### 1. Install Dependencies

```bash
cd gif-j-react
npm install
```

### 2. Environment Variables (Optional)

Create a `.env` file in the `gif-j-react` directory if you want to customize the API URL. You can copy from the template:

```bash
cp env.template .env
```

Then edit the `.env` file:

```env
REACT_APP_API_URL=http://localhost:3000/gif-j/
```

If not provided, it will default to `http://localhost:3000/gif-j/`

### 3. Start the Frontend

```bash
npm start
```

The frontend will be available at: `http://localhost:3000` (React's default port)

**Note:** If port 3000 is already in use by the backend, React will ask to use a different port (typically 3001).

## Running Both Services

### Option 1: Separate Terminals

1. **Terminal 1 - Backend:**
   ```bash
   cd gif-j-backend
   npm run start:dev
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd gif-j-react
   npm start
   ```

### Option 2: Using Docker Compose (Full Stack)

You can use the provided `docker-compose.yml` in the backend directory to run everything:

```bash
cd gif-j-backend

# Set environment variables in a .env file or export them
export STAGE=local
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
export POSTGRES_DB=gifalot
# ... (all other required env vars)

# Start all services
docker-compose up
```

## Troubleshooting

### Backend Issues

1. **Database Connection Error:**
   - Ensure PostgreSQL is running
   - Check that the database credentials in `.env` are correct
   - Verify the database exists: `CREATE DATABASE gifalot;`

2. **Redis Connection Error:**
   - Ensure Redis is running
   - Check Redis host and port in `.env`
   - If using Docker, ensure the Redis container is running

3. **Migration Errors:**
   - Make sure the database is accessible
   - Check that all migrations are in the correct format
   - Try running migrations manually: `npm run migration:run`

### Frontend Issues

1. **API Connection Error:**
   - Verify the backend is running on the correct port
   - Check that `REACT_APP_API_URL` points to the correct backend URL
   - Check browser console for CORS errors (backend should have CORS enabled)

2. **Port Already in Use:**
   - Change the backend port in `.env` (e.g., `PORT=3001`)
   - Or let React use a different port (it will prompt you)

## Project Structure

```
gifalot/
├── gif-j-backend/          # NestJS backend application
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, collection, file, etc.)
│   │   ├── migrations/     # Database migrations
│   │   └── main.ts         # Application entry point
│   ├── docker-compose.yml  # Docker services configuration
│   └── package.json
├── gif-j-react/            # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── helpers/        # Utility functions
│   │   └── static/         # API configuration
│   └── package.json
└── SETUP.md                # This file
```

## Available Scripts

### Backend (gif-j-backend)

- `npm run start:dev` - Start in development mode with hot reload
- `npm run start` - Start in production mode
- `npm run build` - Build the application
- `npm run migration:run` - Run database migrations
- `npm run migration:revert` - Revert last migration
- `npm run lint` - Run ESLint

### Frontend (gif-j-react)

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Next Steps

1. Set up your environment variables
2. Install dependencies for both frontend and backend
3. Start PostgreSQL and Redis
4. Run the backend
5. Run the frontend
6. Open http://localhost:3000 (or the port React assigns) in your browser

## Additional Notes

- The backend uses the `/gif-j` prefix for all routes
- Google reCAPTCHA is disabled when `STAGE=local`
- The application uses JWT for authentication
- File uploads require AWS S3 configuration (or can be mocked for local development)


