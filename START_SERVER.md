# Starting the Backend Server

## Quick Start

### 1. Check Prerequisites

Make sure you have:
- Node.js installed (v16+)
- PostgreSQL running (or use Docker)
- Redis running (or use Docker)
- `.env` file configured in `gif-j-backend/`

### 2. Install Dependencies (if not already done)

```bash
cd gif-j-backend
npm install
```

### 3. Configure Environment Variables

Make sure `gif-j-backend/.env` exists. If not, copy from template:

```bash
cd gif-j-backend
cp env.template .env
```

Edit `.env` with your database credentials:
- `POSTGRES_HOST=localhost`
- `POSTGRES_PORT=5432`
- `POSTGRES_USER=postgres`
- `POSTGRES_PASSWORD=postgres`
- `POSTGRES_DB=gifalot`
- `REDIS_HOST=localhost`
- `REDIS_PORT=6379`
- `REDIS_PASSWORD=redis`
- `STAGE=local` (this automatically disables authentication)

### 4. Start PostgreSQL and Redis

#### Option A: Using Docker (Recommended)

```bash
cd gif-j-backend
docker-compose up -d postgres redis
```

#### Option B: Local Installation

- Start PostgreSQL service
- Start Redis service
- Create database: `CREATE DATABASE gifalot;`

### 5. Start the Backend Server

```bash
cd gif-j-backend
npm run start:dev
```

The server should start on `http://localhost:3000`

### Troubleshooting

#### "Connection refused" or "Cannot connect to database"

1. **Check PostgreSQL is running:**
   ```bash
   # Windows
   Get-Service postgresql*
   
   # Or check if Docker container is running
   docker ps
   ```

2. **Check database exists:**
   ```sql
   psql -U postgres
   \l
   -- Look for 'gifalot' database
   ```

3. **Verify .env file:**
   - Check all database credentials match your setup
   - Ensure `STAGE=local` is set

#### "Port 3000 already in use"

1. Find what's using port 3000:
   ```bash
   netstat -ano | findstr :3000
   ```

2. Kill the process or change PORT in .env to a different port (e.g., 3001)

#### "Redis connection error"

1. Check Redis is running:
   ```bash
   # Windows
   redis-cli ping
   # Should return: PONG
   ```

2. Or start Redis Docker container:
   ```bash
   docker-compose up -d redis
   ```

#### "Module not found" errors

Run:
```bash
cd gif-j-backend
npm install
```

### Expected Output

When the server starts successfully, you should see:

```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
[Nest] INFO [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] INFO [InstanceLoader] RedisModule dependencies initialized
...
[Nest] INFO [NestApplication] Nest application successfully started
```

The backend will be available at: `http://localhost:3000/gif-j/`

### Testing the Server

Once running, you can test:

```bash
# In another terminal
curl http://localhost:3000/gif-j/
```

Or open in browser: `http://localhost:3000/gif-j/`











