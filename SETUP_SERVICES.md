# Setting Up PostgreSQL and Redis for Local Development

The backend requires **PostgreSQL** and **Redis** to be running. Here are your options:

## Option 1: Using Docker (Recommended - Easiest)

### Prerequisites
- Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Windows

### Steps

1. **Start Docker Desktop** (make sure it's running)

2. **Navigate to backend directory:**
   ```powershell
   cd gif-j-backend
   ```

3. **Start PostgreSQL and Redis:**
   ```powershell
   docker-compose up -d postgres redis
   ```

4. **Verify services are running:**
   ```powershell
   docker ps
   ```
   You should see `postgres` and `redis` containers running.

5. **Start the backend:**
   ```powershell
   npm run start:dev
   ```

### Stop Services (when done)
```powershell
docker-compose down
```

---

## Option 2: Local Installation

### Install PostgreSQL

1. **Download PostgreSQL:**
   - Visit: https://www.postgresql.org/download/windows/
   - Download and run the installer

2. **During installation:**
   - Set password: `postgres` (or update `.env` with your password)
   - Port: `5432` (default)
   - Remember the password you set!

3. **Create the database:**
   ```powershell
   # Open pgAdmin or use psql
   psql -U postgres
   ```
   Then run:
   ```sql
   CREATE DATABASE gifalot;
   \q
   ```

4. **Start PostgreSQL service:**
   ```powershell
   # Check if running
   Get-Service postgresql*
   
   # Start if not running
   Start-Service postgresql*
   ```

### Install Redis

1. **Download Redis for Windows:**
   - Visit: https://github.com/microsoftarchive/redis/releases
   - Or use WSL (Windows Subsystem for Linux)
   - Or use Memurai (Redis-compatible for Windows): https://www.memurai.com/

2. **Start Redis:**
   ```powershell
   # If using Memurai or installed Redis
   redis-server
   ```

   Or install via Chocolatey:
   ```powershell
   choco install redis-64
   ```

---

## Option 3: Quick Test Setup (Simplified)

If you just want to test the frontend without full backend functionality:

1. **Start only the frontend:**
   ```powershell
   cd gif-j-react
   npm start
   ```

2. **Note:** Some features won't work without the backend, but you can at least see the UI.

---

## Verify Services Are Running

### Check PostgreSQL:
```powershell
netstat -ano | findstr ":5432"
```
Should show a listening port.

### Check Redis:
```powershell
netstat -ano | findstr ":6379"
```
Should show a listening port.

Or test Redis connection:
```powershell
redis-cli ping
```
Should return: `PONG`

---

## Troubleshooting

### "Connection refused" errors

1. **Check services are running:**
   ```powershell
   # PostgreSQL
   Get-Service | Where-Object {$_.Name -like "*postgres*"}
   
   # Check ports
   netstat -ano | findstr ":5432"
   netstat -ano | findstr ":6379"
   ```

2. **Check .env file:**
   Make sure your `gif-j-backend/.env` has correct credentials:
   ```env
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres  # Your actual password
   POSTGRES_DB=gifalot
   
   REDIS_HOST=localhost
   REDIS_PORT=6379
   REDIS_PASSWORD=redis  # Or your Redis password
   ```

3. **Firewall issues:**
   Make sure Windows Firewall isn't blocking PostgreSQL or Redis

### Docker not starting

1. **Make sure Docker Desktop is running**
2. **Check Docker service:**
   ```powershell
   Get-Service | Where-Object {$_.Name -like "*docker*"}
   ```

3. **Restart Docker Desktop** if needed

---

## Recommended Setup for Development

**Use Docker** - it's the easiest way:
1. Install Docker Desktop
2. Run: `docker-compose up -d postgres redis`
3. Start backend: `npm run start:dev`
4. Start frontend: `npm start` (in another terminal)

This gives you a clean, isolated development environment.











