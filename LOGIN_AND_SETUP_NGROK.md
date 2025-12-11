# Login and Set Up ngrok Service

## Your VPS Credentials

- **Username:** `root`
- **Password:** `wc3EaD1cRmmXyLtt8o2C`
- **VPS IP:** `38.242.204.63`
- **VNC:** `207.180.255.187:63341`

## Step 1: Login via VNC
    
You should already be at the login screen in VNC. If not, reconnect:
- VNC Address: `207.180.255.187:63341`
- Password: `Guerill5`

At the login prompt:

1. **Type:** `root`
2. **Press Enter**
3. **Enter password:** `wc3EaD1cRmmXyLtt8o2C`
   - **Important:** You won't see any characters while typing - this is normal!
   - Just type the password carefully
4. **Press Enter**

You should see:
```
root@vmi1301963:~#
```

## Step 2: Verify System is Working

Once logged in, check if system responds:

```bash
date
```

Should show current date/time. If it works, system is fine! ✅

## Step 3: Create ngrok Service File

```bash
nano /etc/systemd/system/ngrok.service
```

When nano opens, paste this (in VNC, right-click or use Shift+Insert to paste):

```ini
[Unit]
Description=ngrok tunnel for gifalot backend
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/ngrok http 3001 --log=stdout
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

**Save the file:**
- Press `Ctrl + X`
- Press `Y` (yes)
- Press `Enter`

## Step 4: Enable and Start Service

```bash
# Reload systemd
systemctl daemon-reload

# Enable service to start on boot
systemctl enable ngrok

# Start the service
systemctl start ngrok

# Check status
systemctl status ngrok
```

You should see the service is "active (running)" ✅

## Step 5: Get Your ngrok URL

```bash
# View logs to see your URL
journalctl -u ngrok -f
```

You should see your URL: `https://unsweltering-barton-scribal.ngrok-free.dev`

Press `Ctrl+C` to stop viewing logs.

## Step 6: Verify Backend is Running

Check if your backend is running:

```bash
# Check PM2 status (if you're using PM2)
pm2 status

# Or check if port 3001 is listening
netstat -tulpn | grep 3001
```

If backend isn't running, start it:
```bash
# Navigate to backend directory
cd /opt/gifalot/gif-j-backend
# (or wherever your backend is located)

# If using PM2:
pm2 start npm --name "gifalot-backend" -- run start:prod

# Or start directly:
npm run start:prod
```

## Step 7: Test ngrok is Working

```bash
# Test backend through ngrok
curl https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

Should return a response from your backend!

## Step 8: Update Netlify Environment Variable

1. **Go to Netlify Dashboard:** https://app.netlify.com
2. **Select your site:** gifalot
3. **Go to:** Site settings → Environment variables
4. **Update `REACT_APP_API_URL`:**
   - **Old:** `http://38.242.204.63/gif-j/`
   - **New:** `https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/`
   - **Scope:** All scopes (Production, Branch deploys, Deploy previews)
5. **Click Save**
6. **Go to Deploys tab**
7. **Click:** Trigger deploy → Clear cache and deploy site

## Step 9: Update Backend CORS

Make sure your backend allows requests from Netlify:

```bash
# Edit backend .env file
nano /opt/gifalot/gif-j-backend/.env
# (adjust path if different)

# Add or update CORS_ORIGINS:
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Save (Ctrl+X, Y, Enter), then restart backend:

```bash
pm2 restart gifalot-backend
# Or restart however you're running it
```

## Verify Everything Works

1. **Check ngrok is running:**
   ```bash
   systemctl status ngrok
   ```

2. **Check backend is running:**
   ```bash
   pm2 status
   # Or check port
   netstat -tulpn | grep 3001
   ```

3. **Test HTTPS endpoint:**
   ```bash
   curl https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
   ```

4. **Visit Netlify site:** `https://gifalot.netlify.app`
   - Should work without Mixed Content errors!

## Quick Reference

**Login Credentials:**
- Username: `root`
- Password: `wc3EaD1cRmmXyLtt8o2C`

**ngrok URL:**
- `https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/`

**Useful Commands:**
```bash
# Check ngrok status
systemctl status ngrok

# View ngrok logs
journalctl -u ngrok -n 50

# Restart ngrok
systemctl restart ngrok

# Check backend status
pm2 status

# Restart backend
pm2 restart gifalot-backend
```

## Troubleshooting

**ngrok service won't start:**
```bash
# Check if ngrok is installed
which ngrok
# Should show: /usr/local/bin/ngrok

# If not found, check logs
journalctl -u ngrok -n 50
```

**Backend not accessible:**
- Make sure backend is running on port 3001
- Check: `netstat -tulpn | grep 3001`
- Start backend if needed

**CORS errors:**
- Make sure CORS_ORIGINS includes Netlify domains
- Restart backend after changing .env

You're ready to go! Try logging in now! 🚀







