# Architecture Recap - Gifalot Project

## Current Setup Overview

### **Frontend (React)**
- **Location**: Running locally on your machine
- **Port**: Typically `http://localhost:3000` (or next available port)
- **Directory**: `C:\Projects\Gifalot\gif-j-react`
- **How to Run**: `npm start` from `gif-j-react` directory
- **API URL**: Points to `http://localhost:3000/gif-j/` (backend)

### **Backend (NestJS)**
- **Location**: Running locally on your machine
- **Port**: `http://localhost:3000/gif-j/`
- **Directory**: `C:\Projects\Gifalot\gif-j-backend`
- **How to Run**: `npm run start:dev` from `gif-j-backend` directory
- **Note**: Backend runs on port 3000, but with path prefix `/gif-j/`

### **Database (MySQL)**
- **Location**: Docker container on your local machine
- **Host**: `localhost` (from host machine perspective)
- **Port**: `3306` (mapped from container)
- **Container Name**: `gif-j-backend-mysql-1`
- **Database Name**: `gifalot` (from `.env`)
- **Credentials**:
  - User: `root` (from `.env`)
  - Password: `root` (from `.env`)
- **Data Persistence**: 
  - Docker volume: `mysqldata`
  - Physical location: Docker-managed volume (typically `C:\ProgramData\Docker\volumes\` on Windows)
- **How to Access**:
  - From host: `mysql -h localhost -P 3306 -u root -p` (password: `root`)
  - From Docker: `docker exec -it gif-j-backend-mysql-1 mysql -u root -p`

### **Redis (Cache/Sessions)**
- **Location**: Docker container on your local machine
- **Host**: `localhost` (from host machine perspective)
- **Port**: `6379` (mapped from container)
- **Container Name**: `gif-j-backend-redis-1`
- **Password**: `redis` (from `.env`)
- **Data Persistence**: 
  - Docker volume: `redisdata`
  - Physical location: Docker-managed volume
- **How to Access**:
  - From host: `redis-cli -h localhost -p 6379 -a redis`
  - From Docker: `docker exec -it gif-j-backend-redis-1 redis-cli -a redis`

### **File Storage (AWS S3)**
- **Location**: AWS S3 (cloud storage)
- **Bucket**: `gif-j-dev` (from `.env`)
- **Region**: `eu-central-1` (from `.env`)
- **Current Status**: 
  - **Configured** but may not have valid credentials
  - **Fallback**: In local development mode, if S3 fails, the system uses original Giphy URLs (stored in `originalUrl` column)
- **Data Location**: 
  - Files are stored in S3 bucket: `files/{userId}/{collectionId}/{fileId}.{ext}`
  - When S3 isn't available, original URLs are stored in database

## Docker Containers

Currently running containers:
```
gif-j-backend-redis-1   - Redis cache/session store
gif-j-backend-mysql-1   - MySQL database
```

The backend application (`app` service in docker-compose.yml) is **NOT** running in Docker - it's running directly on your machine via `npm run start:dev`.

## Data Flow

1. **Frontend** → Makes API calls to → **Backend** (`http://localhost:3000/gif-j/`)
2. **Backend** → Reads/Writes data to → **MySQL** (`localhost:3306`)
3. **Backend** → Uses → **Redis** (`localhost:6379`) for caching/sessions
4. **Backend** → Uploads files to → **AWS S3** (or falls back to original URLs)

## Environment Variables

### Backend (`.env` in `gif-j-backend/`)
- **Database**: `MYSQL_HOST=localhost`, `MYSQL_PORT=3306`, `MYSQL_DB=gifalot`
- **Redis**: `REDIS_HOST=localhost`, `REDIS_PORT=6379`
- **Backend**: `PORT=3000`, `STAGE=local`
- **Storage**: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME`
- **API Keys**: `GIPHY_API_KEY` (configured)

### Frontend (`.env` in `gif-j-react/`)
- **API URL**: `REACT_APP_API_URL=http://localhost:3000/gif-j/`

## Important Notes

1. **Port Conflict**: Both frontend and backend try to use port 3000. The backend uses `/gif-j/` path prefix, while frontend typically runs on port 3000 or next available.

2. **Database Migrations**: Run automatically when backend starts (see `migrationsRun: true` in `app.module.ts`)

3. **Local Development**: 
   - Authentication is **disabled** (`DISABLE_AUTH=true` or `STAGE=local`)
   - S3 uploads fall back to storing original URLs in database
   - Mock user is used: `{ id: 1, email: 'dev@example.com' }`

4. **Docker Volumes**: Data persists in Docker volumes even if containers are stopped/removed. To completely reset:
   ```bash
   docker-compose down -v  # Removes volumes too
   ```

## Quick Commands

**Start Services:**
```bash
# Start MySQL and Redis (from gif-j-backend directory)
docker-compose up -d mysql redis

# Start Backend (from gif-j-backend directory)
npm run start:dev

# Start Frontend (from gif-j-react directory)
npm start
```

**Check Running Services:**
```bash
# Check Docker containers
docker ps

# Check listening ports
netstat -ano | findstr ":3000 :3306 :6379"
```

**Access Database:**
```bash
# MySQL command line
mysql -h localhost -P 3306 -u root -p
# Password: root

# Or via Docker
docker exec -it gif-j-backend-mysql-1 mysql -u root -p
```

**Access Redis:**
```bash
# Redis command line
redis-cli -h localhost -p 6379 -a redis

# Or via Docker
docker exec -it gif-j-backend-redis-1 redis-cli -a redis
```










