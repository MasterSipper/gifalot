# Fix SCP Connection Issue

## Problem
`scp` connection refused - port 22 might be blocked or SSH uses a different port.

## Solution Options

### Option 1: Check How You Normally Connect

**Question:** How do you normally connect to the server?
- Do you use PuTTY, WinSCP, or another tool?
- What port do you use? (Check your SSH client settings)
- Do you use a password or SSH key?

### Option 2: Try Different Port

If your SSH client uses a different port (like 2049 or 2222), try:

```powershell
# Try with port 2049 (common alternative)
scp -P 2049 -r build/* root@38.242.204.63:/var/www/gifalot-frontend/

# Or try port 2222
scp -P 2222 -r build/* root@38.242.204.63:/var/www/gifalot-frontend/
```

**Note:** Use `-P` (capital P) for port, not `-p`

### Option 3: Use WinSCP (Easier for File Transfer)

**Download and use WinSCP:**
1. Download: https://winscp.net/eng/download.php
2. Install WinSCP
3. Open WinSCP
4. **New Site:**
   - **Host name:** `38.242.204.63`
   - **Port:** `22` (or whatever port you normally use)
   - **User name:** `root`
   - **Password:** (your server password)
   - Click **Login**
5. **Left side:** Navigate to `C:\Projects\Gifalot\gif-j-react\build\`
6. **Right side:** Navigate to `/var/www/gifalot-frontend/`
7. **Select all files on left** (Ctrl+A)
8. **Drag to right side** to upload

**Expected Result:**
- Files upload to server
- Progress bar shows upload status

### Option 4: Manual Upload via Server

If file transfer doesn't work, we can create the files directly on the server, but this is more complex.

## Recommended: Use WinSCP

WinSCP is easier for file transfers and handles connections better than command-line scp. It's also visual, so you can see what you're doing.




