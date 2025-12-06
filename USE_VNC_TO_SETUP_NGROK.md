# Use VNC to Set Up ngrok Service

Since SSH isn't working, use VNC to access your VPS directly.

## Step 1: Install VNC Viewer

Download and install:
- **RealVNC Viewer:** https://www.realvnc.com/en/connect/download/viewer/
- Or any VNC client you prefer

## Step 2: Get VNC Credentials

1. **Log into Contabo Control Panel:**
   - Go to: https://my.contabo.com/
   - Login to your account

2. **Find VNC Access:**
   - Navigate to your VPS management
   - Look for "VNC" or "Console" section
   - Note the password

**Your VNC Connection:**
- **Host:** `207.180.255.187:63341`
- **Password:** (Check Contabo panel)

## Step 3: Connect via VNC

1. **Open VNC Viewer**
2. **Enter connection:**
   - Address: `207.180.255.187:63341`
3. **Click Connect**
4. **Enter password** when prompted
5. **You should see the VPS desktop!**

## Step 4: Open Terminal on VPS

Once connected via VNC:
1. **Open terminal** (usually in applications menu or right-click desktop)
2. **You can now run commands directly**

## Step 5: Set Up ngrok Service

Now you can create the ngrok service file. In the terminal:

```bash
# 1. Create the service file
nano /etc/systemd/system/ngrok.service
```

When nano opens, paste this:

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

Save:
- Press `Ctrl + X`
- Press `Y`
- Press `Enter`

## Step 6: Enable and Start Service

```bash
# Reload systemd
systemctl daemon-reload

# Enable on boot
systemctl enable ngrok

# Start service
systemctl start ngrok

# Check status
systemctl status ngrok
```

## Step 7: Get Your ngrok URL

```bash
# View logs to see URL
journalctl -u ngrok -f
```

You should see your URL: `https://unsweltering-barton-scribal.ngrok-free.dev`

Press `Ctrl+C` to exit.

## Step 8: Test It Works

```bash
# Test backend through ngrok
curl https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

Should return a response!

## Step 9: Update Netlify (From Your Computer)

1. **Go to Netlify Dashboard** → Site settings → Environment variables
2. **Update `REACT_APP_API_URL`:**
   - Value: `https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/`
   - Scope: All scopes
3. **Save and trigger new deploy**

## Done! ✅

Your ngrok service is now running on the VPS, and you can access it via VNC anytime to manage it.

## Useful Commands (Run via VNC Terminal)

```bash
# Check ngrok status
systemctl status ngrok

# View ngrok logs
journalctl -u ngrok -f

# Restart ngrok
systemctl restart ngrok

# Check if backend is running
pm2 status

# Restart backend
pm2 restart gifalot-backend
```

## VNC Tips

- **VNC is slower than SSH** but works when SSH is blocked
- **Keep VNC connected** while setting things up
- **You can disconnect VNC** after services are running - they'll keep running on the VPS


