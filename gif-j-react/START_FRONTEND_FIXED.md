# Frontend Not Loading - Fix Instructions

## Issue
The frontend is not loading on localhost, likely due to PowerShell execution policy restrictions preventing npm from running.

## Quick Fix Options

### Option 1: Use Command Prompt (Recommended)
Instead of PowerShell, use Command Prompt (cmd):

1. Open Command Prompt (not PowerShell)
2. Navigate to the frontend directory:
   ```cmd
   cd C:\Projects\Gifalot\gif-j-react
   ```
3. Start the frontend:
   ```cmd
   npm start
   ```

### Option 2: Fix PowerShell Execution Policy
Run PowerShell as Administrator and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try:
```powershell
cd C:\Projects\Gifalot\gif-j-react
npm start
```

### Option 3: Use the Provided Script
Run the `start-frontend.ps1` script which uses cmd to bypass the policy:
```powershell
cd C:\Projects\Gifalot\gif-j-react
.\start-frontend.ps1
```

### Option 4: Use npm.cmd directly
```powershell
cd C:\Projects\Gifalot\gif-j-react
& "C:\Program Files\nodejs\npm.cmd" start
```

## Expected Behavior
After running `npm start`, you should see:
- React development server starting
- Browser opening to http://localhost:3000 (or next available port)
- Compilation messages in the terminal

## If Port 3000 is Already in Use
React will automatically ask to use a different port (like 3001). Accept the prompt.

## Troubleshooting

### Check if Node.js is installed:
```cmd
node --version
npm --version
```

### Check if dependencies are installed:
```cmd
cd C:\Projects\Gifalot\gif-j-react
dir node_modules
```
If `node_modules` is missing or incomplete, run:
```cmd
npm install
```

### Check for compilation errors:
Look at the terminal output when running `npm start`. Any red error messages will indicate what's wrong.

### Check browser console:
Open browser DevTools (F12) and check the Console tab for any JavaScript errors.

## Environment Variables
Make sure you have a `.env` file in `gif-j-react/` with:
```
REACT_APP_API_URL=http://localhost:3000/gif-j/
```
Or adjust the port if your backend runs on a different port (like 3001).




