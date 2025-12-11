# Connect to VPS via VNC - Quick Guide

## Your VNC Credentials

- **IP:** `207.180.255.187`
- **Port:** `63341`
- **Password:** `Guerill5`

## Step 1: Install VNC Viewer

If you don't have it:
- Download: https://www.realvnc.com/en/connect/download/viewer/
- Install it

## Step 2: Connect

1. **Open VNC Viewer**
2. **Enter connection:**
   ```
   207.180.255.187:63341
   ```
3. **Click Connect**
4. **Enter password:** `Guerill5`
5. **You should see the VPS desktop!**

## Step 3: Open Terminal

Once connected:
- Right-click on desktop → **Open Terminal Here**
- Or open from Applications menu

## Step 4: Set Up ngrok Service

In the terminal, run these commands:

```bash
# 1. Create the service file
nano /etc/systemd/system/ngrok.service
```

When nano opens, paste this entire block:

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

Save the file:
- Press `Ctrl + X`
- Press `Y` (yes)
- Press `Enter`

Then run:

```bash
# 2. Reload systemd
systemctl daemon-reload

# 3. Enable service
systemctl enable ngrok

# 4. Start service
systemctl start ngrok

# 5. Check status
systemctl status ngrok
```

## Step 5: Get Your ngrok URL

```bash
# View logs
journalctl -u ngrok -f
```

You should see your URL: `https://unsweltering-barton-scribal.ngrok-free.dev`

Press `Ctrl+C` to stop viewing logs.

## Step 6: Test It

```bash
# Test backend through ngrok
curl https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

Should return a response from your backend!

## Step 7: Update Netlify

1. **Go to Netlify Dashboard** → Site settings → Environment variables
2. **Update `REACT_APP_API_URL`:**
   - Value: `https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/`
   - Scope: All scopes
3. **Save**
4. **Trigger new deploy**

## Done! ✅

Your ngrok service is now running automatically on your VPS!

## Quick Connection Summary

**VNC Connection:**
- Host: `207.180.255.187:63341`
- Password: `Guerill5`

**ngrok URL:**
- `https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/`

## Useful Commands (via VNC Terminal)

```bash
# Check ngrok status
systemctl status ngrok

# View ngrok logs
journalctl -u ngrok -n 50

# Restart ngrok
systemctl restart ngrok

# Check if backend is running
pm2 status

# Restart backend
pm2 restart gifalot-backend
```

You're all set! 🎉







