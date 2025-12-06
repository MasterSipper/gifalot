# Quick Start Guide - React Frontend

## Starting the Frontend Server

### Method 1: Command Prompt (Easiest)
1. Open **Command Prompt** (cmd.exe, not PowerShell)
2. Navigate to the project:
   ```cmd
   cd C:\Projects\Gifalot\gif-j-react
   ```
3. Start the server:
   ```cmd
   npm start
   ```

### Method 2: PowerShell (if execution policy is fixed)
```powershell
cd C:\Projects\Gifalot\gif-j-react
npm start
```

### Method 3: Use the helper script
```powershell
cd C:\Projects\Gifalot\gif-j-react
.\start-frontend.ps1
```

## What to Expect

1. **First time?** It may take 1-2 minutes to compile
2. **Browser should open automatically** to http://localhost:3000
3. **Terminal will show:**
   ```
   Compiled successfully!
   
   You can now view gif-j-react in the browser.
   
     Local:            http://localhost:3000
   ```

## If Port 3000 is Busy

React will ask:
```
? Something is already running on port 3000. Would you like to run on another port instead? (Y/n)
```
Type `Y` and press Enter. It will use port 3001 (or next available).

## Troubleshooting

### Error: "npm is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal after installation

### Error: "Cannot find module"
- Run: `npm install` first
- Then: `npm start`

### Error: "Port 3000 already in use"
- Close other applications using port 3000
- Or accept React's offer to use a different port

### Server starts but page is blank
- Check browser console (F12) for errors
- Verify backend is running on the correct port
- Check `.env` file has correct `REACT_APP_API_URL`

## Stopping the Server

Press `Ctrl + C` in the terminal where it's running.

## Environment Setup

Create `.env` file in `gif-j-react/` folder:
```env
REACT_APP_API_URL=http://localhost:3000/gif-j/
```
(Adjust port if your backend uses a different port, like 3001)



