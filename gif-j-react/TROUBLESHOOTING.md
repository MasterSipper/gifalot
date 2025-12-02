# Troubleshooting Frontend Connection Issues

## Error -102 (ERR_CONNECTION_REFUSED)

This error means your browser can't connect to the server. Here's how to fix it:

### ✅ Server is Running
I can see port 3000 is listening, so the server should be working.

### Step 1: Wait for Compilation
The React dev server needs time to compile. Wait 30-60 seconds after starting, then refresh your browser.

### Step 2: Check the Terminal
Look at the terminal where you ran `npm start`. You should see:
- ✅ `Compiled successfully!` - Server is ready
- ❌ Red error messages - There's a compilation error

### Step 3: Try These URLs
1. **http://localhost:3000** (standard)
2. **http://127.0.0.1:3000** (alternative)
3. Check if React suggested a different port (like 3001)

### Step 4: Clear Browser Cache
1. Press `Ctrl + Shift + Delete`
2. Clear cached images and files
3. Or try **Incognito/Private mode**

### Step 5: Check Firewall
Windows Firewall might be blocking the connection:
1. Open Windows Defender Firewall
2. Check if Node.js is allowed
3. Or temporarily disable firewall to test

### Step 6: Restart the Server
If nothing works:
1. Stop the server: Press `Ctrl + C` in the terminal
2. Wait 5 seconds
3. Start again: `npm start`
4. Wait for "Compiled successfully!" message
5. Then try the browser

### Step 7: Check for Compilation Errors
Look in the terminal for:
- ❌ Syntax errors
- ❌ Missing dependencies
- ❌ Import errors

If you see errors, they need to be fixed before the page will load.

### Step 8: Verify Server is Actually Running
Run this in PowerShell:
```powershell
netstat -ano | findstr :3000
```
You should see `LISTENING` status. If not, the server isn't running.

### Step 9: Try Different Browser
Sometimes browser extensions cause issues:
- Try Chrome, Firefox, or Edge
- Or use Incognito/Private mode

### Step 10: Check Port Conflicts
If port 3000 is busy, React will ask to use another port. Make sure you're using the correct URL that React shows in the terminal.

## Common Issues

### "Cannot GET /"
- Server is running but React hasn't compiled yet
- Wait for "Compiled successfully!" message

### Blank White Page
- Open browser DevTools (F12)
- Check Console tab for JavaScript errors
- Check Network tab for failed requests

### Page Loads but Shows Errors
- Check browser console (F12)
- Check terminal for compilation warnings
- Verify backend is running if API calls fail

## Still Not Working?

1. **Check Node.js version:**
   ```cmd
   node --version
   ```
   Should be v14 or higher

2. **Reinstall dependencies:**
   ```cmd
   cd C:\Projects\Gifalot\gif-j-react
   rm -rf node_modules
   npm install
   npm start
   ```

3. **Check for port conflicts:**
   ```cmd
   netstat -ano | findstr :3000
   ```
   Only one process should be listening

4. **Try a different port:**
   Create `.env` file:
   ```env
   PORT=3001
   REACT_APP_API_URL=http://localhost:3000/gif-j/
   ```
   Then restart the server

