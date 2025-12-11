# Fix: Login Connection Refused Error

## Problem
The frontend is trying to connect to `http://localhost:3001/gif-j/auth/login` but getting `ERR_CONNECTION_REFUSED` because:
1. **Backend server is not running**
2. **Frontend API URL might be misconfigured**

## Solution Steps

### Step 1: Create Frontend .env File

Create a file named `.env` in the `gif-j-react/` folder with this content:

```env
REACT_APP_API_URL=http://localhost:3000/gif-j/
```

**Note:** If your backend runs on a different port (like 3001), change the port number accordingly.

### Step 2: Start the Backend Server

Open a **new terminal/command prompt** and run:

```cmd
cd C:\Projects\Gifalot\gif-j-backend
npm run start:dev
```

Or if you have a PowerShell script:

```powershell
cd C:\Projects\Gifalot\gif-j-backend
.\start-dev.ps1
```

**Wait for the server to start.** You should see:
```
[Nest] INFO [NestApplication] Nest application successfully started
```

### Step 3: Verify Backend is Running

Check if port 3000 (or your configured port) is listening:

```cmd
netstat -ano | findstr :3000
```

You should see a `LISTENING` status.

### Step 4: Restart Frontend (if needed)

If you created/edited the `.env` file, restart the React dev server:

1. **Stop the frontend:** Press `Ctrl+C` in the terminal running `npm start`
2. **Start again:**
   ```cmd
   cd C:\Projects\Gifalot\gif-j-react
   npm start
   ```

### Step 5: Try Login Again

1. Go to http://localhost:3000 (or the port React is using)
2. Try logging in
3. Check browser console (F12) for any errors

## Troubleshooting

### Backend Won't Start?

1. **Check if database services are running:**
   ```cmd
   docker ps
   ```
   Should show MySQL and Redis containers

2. **If not, start them:**
   ```cmd
   cd C:\Projects\Gifalot\gif-j-backend
   docker-compose up -d mysql redis
   ```

3. **Check backend .env file exists:**
   ```cmd
   cd C:\Projects\Gifalot\gif-j-backend
   dir .env
   ```
   If missing, copy from template:
   ```cmd
   copy env.template .env
   ```

### Port Conflicts?

If React is using port 3000, you need to run backend on a different port:

1. **Edit `gif-j-backend/.env`:**
   ```env
   PORT=3001
   ```

2. **Edit `gif-j-react/.env`:**
   ```env
   REACT_APP_API_URL=http://localhost:3001/gif-j/
   ```

3. **Restart both servers**

### Still Getting Connection Refused?

1. **Check firewall:** Windows Firewall might be blocking Node.js
2. **Check backend logs:** Look for error messages in the backend terminal
3. **Verify API URL:** Check browser Network tab to see what URL is being called
4. **Clear browser cache:** Try Incognito/Private mode

## Quick Checklist

- [ ] Backend server is running (check terminal for "successfully started")
- [ ] Backend is listening on correct port (check with netstat)
- [ ] Frontend `.env` file exists with correct API URL
- [ ] Frontend has been restarted after creating .env file
- [ ] Database services (MySQL, Redis) are running
- [ ] No port conflicts between frontend and backend







