# Gifalot

A full-stack web application for managing and organizing GIF and video collections. Built with NestJS (backend) and React (frontend).

<!-- Trigger test deployment -->

## Project Structure

```
Gifalot/
├── gif-j-backend/          # NestJS backend application
│   ├── src/
│   │   ├── modules/        # Feature modules (auth, collection, file, etc.)
│   │   ├── migrations/     # Database migrations
│   │   └── main.ts         # Application entry point
│   ├── docker-compose.yml  # Docker services configuration (MySQL, Redis)
│   ├── env.template        # Environment variables template
│   └── package.json
├── gif-j-react/            # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── helpers/        # Utility functions
│   │   ├── store/          # Redux store and slices
│   │   └── static/         # API configuration
│   └── package.json
├── SETUP.md                # Detailed setup guide
├── PRODUCTION_DEPLOYMENT.md # Production deployment guide
└── README.md               # This file
```

## Features

- **User Authentication**: JWT-based authentication with refresh tokens and "Remember Me" functionality
- **Media Collections**: Create and manage collections of GIFs and videos
- **File Management**: Upload and organize image and video files with cloud storage integration
- **File Upload**: Backend proxy upload supporting both drag-and-drop and manual file selection
- **Video Support**: Full support for video files (MP4, etc.) with video player controls
- **Favorites System**: Mark and manage favorite media files
- **Carousel Player**: Full-screen carousel player with customizable transitions and timing
- **Responsive Design**: Modern UI built with React, Redux Toolkit, and Ant Design
- **Cloud Storage**: Supports AWS S3 and S3-compatible storage (e.g., Contabo Object Storage)

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MySQL** (v8.0 or higher) - [Download](https://dev.mysql.com/downloads/) or use Docker
- **Redis** (v7 or higher) - [Download](https://redis.io/download/) or use Docker
- **Docker** (optional, for running MySQL and Redis) - [Download](https://www.docker.com/get-started)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/MasterSipper/gifalot.git
cd Gifalot
```

### 2. Backend Setup

```bash
cd gif-j-backend

# Install dependencies
npm install

# Copy environment variables template
cp env.template .env

# Edit .env file with your configuration
# See SETUP.md for detailed environment variable documentation

# Start MySQL and Redis (using Docker)
docker-compose up -d mysql redis

# Wait a few seconds for services to start, then start the backend server
npm run start:dev
```

The backend will be available at: `http://localhost:3001/gif-j/` (or the port specified in your `.env`)

### 3. Frontend Setup

```bash
cd gif-j-react

# Install dependencies
npm install

# Copy environment variables template (optional)
# Frontend defaults to http://localhost:3000/gif-j/ if not specified
cp env.template .env

# Edit .env if your backend is on a different port/URL
# REACT_APP_API_URL=http://localhost:3001/gif-j/

# Start the development server
npm start
```

The frontend will be available at: `http://localhost:3000` (or the next available port)

## Environment Variables

### Backend (.env in gif-j-backend/)

See `gif-j-backend/env.template` for all required environment variables. Key variables include:

**Required:**
- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DB` - Database configuration
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD` - Redis configuration
- `JWT_ACCESS_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_SECRET` - Authentication secrets
- `STAGE` - Set to `local` for development (disables some auth checks)

**For File Uploads (choose one):**
- **AWS S3**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `S3_BUCKET_NAME`
- **Contabo Object Storage** (S3-compatible): Same as above, plus `S3_ENDPOINT` (e.g., `https://eu2.contabostorage.com`)

**Optional:**
- `GOOGLE_RECAPTCHA_SECRET_KEY` - For reCAPTCHA (skipped when `STAGE=local`)
- `GIPHY_API_KEY` - For GIPHY integration
- `MAIL_USER`, `MAIL_PASSWORD` - For email notifications

### Frontend (.env in gif-j-react/)

- `REACT_APP_API_URL`: Backend API URL (defaults to `http://localhost:3000/gif-j/`)

## Available Scripts

### Backend (gif-j-backend)

- `npm run start:dev` - Start in development mode with hot reload
- `npm run start` - Start in production mode
- `npm run build` - Build the application
- `npm run migration:run` - Run database migrations manually (runs automatically on start)
- `npm run migration:revert` - Revert last migration
- `npm run lint` - Run ESLint

### Frontend (gif-j-react)

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests

## Technology Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-relational mapping
- **MySQL** - Database (previously PostgreSQL, migrated)
- **Redis** - Caching and session management
- **AWS S3 / Contabo Object Storage** - File storage (S3-compatible)
- **JWT** - Authentication with refresh tokens
- **Bull** - Job queue management
- **Multer** - File upload handling

### Frontend

- **React** - UI library
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **React Router** - Routing
- **Axios** - HTTP client

## Development

### Running Both Services

**Option 1: Separate Terminals (Recommended)**

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

**Option 2: Using Docker for Services Only**

```bash
cd gif-j-backend
# Start MySQL and Redis containers
docker-compose up -d mysql redis

# Then run backend and frontend separately (see Option 1)
```

## File Upload

Files are uploaded through the backend server (proxy upload) which then stores them in your configured cloud storage:

- **Supports**: Images (GIF, JPEG, PNG, WebP) and Videos (MP4, etc.)
- **Max Size**: 20MB per file
- **Upload Methods**: Drag-and-drop or manual file selection
- **Storage**: AWS S3 or S3-compatible storage (e.g., Contabo Object Storage)

### Setting Up Contabo Object Storage

See [CONTABO_SETUP_GUIDE.md](./CONTABO_SETUP_GUIDE.md) for detailed instructions on configuring Contabo Object Storage.

## Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[PRODUCTION_DEPLOYMENT.md](./PRODUCTION_DEPLOYMENT.md)** - Production deployment guide
- **[PRE_DEPLOYMENT_CHECKLIST.md](./PRE_DEPLOYMENT_CHECKLIST.md)** - Pre-deployment checklist
- **[CONTABO_SETUP_GUIDE.md](./CONTABO_SETUP_GUIDE.md)** - Contabo Object Storage setup
- **[BACKEND_UPLOAD_IMPLEMENTATION.md](./BACKEND_UPLOAD_IMPLEMENTATION.md)** - Upload implementation details

## Troubleshooting

- **Frontend not loading**: Check [START_FRONTEND.md](./START_FRONTEND.md)
- **Backend connection errors**: Check [START_BACKEND_NOW.md](./START_BACKEND_NOW.md)
- **Database issues**: Check [SETUP_MYSQL_LOCAL.md](./SETUP_MYSQL_LOCAL.md)
- **Upload problems**: Check [BACKEND_UPLOAD_IMPLEMENTATION.md](./BACKEND_UPLOAD_IMPLEMENTATION.md)

## Recent Updates

- ✅ Backend proxy upload implementation (no CORS issues)
- ✅ Video file support (MP4 and other video formats)
- ✅ Contabo Object Storage integration (S3-compatible)
- ✅ Improved error handling and user feedback
- ✅ Fixed duplicate upload issues
- ✅ Enhanced token management (localStorage/sessionStorage support)

## License

[Add your license here]

## Contributing

[Add contributing guidelines here]
#   T e s t   d e p l o y m e n t 
 
 