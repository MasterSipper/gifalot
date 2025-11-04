# Gifalot

A full-stack web application for managing and organizing GIF collections. Built with NestJS (backend) and React (frontend).

## Project Structure

```
Gifalot/
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
├── SETUP.md                # Detailed setup guide
└── README.md               # This file
```

## Features

- **User Authentication**: JWT-based authentication with refresh tokens
- **GIF Collections**: Create and manage collections of GIFs
- **File Management**: Upload and organize GIF files with AWS S3 integration
- **Favorites System**: Mark and manage favorite GIFs
- **Responsive Design**: Modern UI built with React and Ant Design

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v15 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v7 or higher) - [Download](https://redis.io/download/)
- **Docker** (optional, for running PostgreSQL and Redis) - [Download](https://www.docker.com/get-started)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
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

# Start PostgreSQL and Redis (using Docker)
docker-compose up -d postgres redis

# Run database migrations (runs automatically on start)
npm run migration:run

# Start the backend server
npm run start:dev
```

The backend will be available at: `http://localhost:3000/gif-j/`

### 3. Frontend Setup

```bash
cd gif-j-react

# Install dependencies
npm install

# Copy environment variables template (optional)
cp env.template .env

# Start the development server
npm start
```

The frontend will be available at: `http://localhost:3000` (or the next available port if 3000 is in use)

## Environment Variables

### Backend (.env in gif-j-backend/)

See `gif-j-backend/env.template` for all required environment variables. Copy it to `.env` and configure. Key variables include:

- Database configuration (PostgreSQL)
- Redis configuration
- JWT secrets
- AWS S3 credentials (for file storage)
- Email configuration
- API keys (reCAPTCHA, GIPHY)

### Frontend (.env in gif-j-react/)

- `REACT_APP_API_URL`: Backend API URL (defaults to `http://localhost:3000/gif-j/`)

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

## Technology Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeORM** - Object-relational mapping
- **PostgreSQL** - Database
- **Redis** - Caching and session management
- **AWS S3** - File storage
- **JWT** - Authentication
- **Bull** - Job queue management

### Frontend

- **React** - UI library
- **Redux Toolkit** - State management
- **Ant Design** - UI component library
- **React Router** - Routing
- **Axios** - HTTP client

## Development

### Running Both Services

**Option 1: Separate Terminals**

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

**Option 2: Using Docker Compose**

```bash
cd gif-j-backend
docker-compose up
```

## Documentation

For detailed setup instructions, troubleshooting, and additional information, see [SETUP.md](./SETUP.md).

## License

[Add your license here]

## Contributing

[Add contributing guidelines here]

