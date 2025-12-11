# Backend Server Not Running

## Issue
The frontend is trying to connect to the backend at `http://localhost:3001/gif-j/auth/login` but getting `ERR_CONNECTION_REFUSED` because the backend server is not running.

## Quick Fix

### Option 1: Start the Backend Server (Recommended)

1. **Open a new terminal/command prompt**

2. **Navigate to backend directory:**
   ```cmd
   cd C:\Projects\Gifalot\gif-j-backend
   ```

3. **Check if services are running:**
   ```cmd
   docker ps
   ```
   You should see MySQL and Redis containers running.

4. **Start the backend:**
   ```cmd
   npm run start:dev
   ```
   
   Or use the PowerShell script:
   ```powershell
   .\start-dev.ps1
   ```

5. **Wait for server to start:**
   You should see:
   ```
   [Nest] INFO [NestApplication] Nest application successfully started
   ```

6. **Verify it's running:**
   - Check port 3000: `netstat -ano | findstr :3000`
   - Or visit: http://localhost:3000/gif-j/

### Option 2: Use Docker Compose (If Backend is Containerized)

```cmd
cd C:\Projects\Gifalot\gif-j-backend
docker-compose up -d app
```

### Option 3: Check Backend Port Configuration

If your backend runs on a different port (like 3001), update the frontend `.env` file:

1. **Create/Edit `.env` file in `gif-j-react/` folder:**
   ```env
   REACT_APP_API_URL=http://localhost:3001/gif-j/
   ```

2. **Restart the React dev server:**
   - Stop it (Ctrl+C)
   - Start again: `npm start`

## Current Status

- ✅ Frontend is running on port 3000
- ❌ Backend is NOT running
- ❌ Frontend trying to connect to port 3001 (but no .env file exists, so this is strange)

## Next Steps

1. **Start the backend server** (see Option 1 above)
2. **Verify the API URL** matches the backend port
3. **Try logging in again**

## Troubleshooting

### Backend won't start?

1. **Check database is running:**
   ```cmd
   docker ps
   ```
   Should show MySQL and Redis containers

2. **Check backend .env file:**
   ```cmd
   cd gif-j-backend
   type .env
   ```
   Make sure it has all required variables

3. **Check for errors in backend terminal:**
   - Database connection errors?
   - Missing environment variables?
   - Port conflicts?

### Port 3000 conflict?

If React is using port 3000, backend will need a different port:

1. **Edit `gif-j-backend/.env`:**
   ```env
   PORT=3001
   ```

2. **Edit `gif-j-react/.env`:**
   ```env
   REACT_APP_API_URL=http://localhost:3001/gif-j/
   ```

3. **Restart both servers**







