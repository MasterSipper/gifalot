# Create ngrok Service File - Quick Guide

Your ngrok URL: `https://unsweltering-barton-scribal.ngrok-free.dev`

## Step 1: Create the Service File

SSH into your VPS and create the service file:

```bash
ssh root@38.242.204.63

# Create the service file
nano /etc/systemd/system/ngrok.service
```

## Step 2: Add This Content

When nano opens, paste this exactly:

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

## Step 3: Save the File

1. Press `Ctrl + X` to exit
2. Press `Y` to confirm save
3. Press `Enter` to confirm filename

## Step 4: Enable and Start the Service

```bash
# Reload systemd to recognize the new service
systemctl daemon-reload

# Enable ngrok to start on boot
systemctl enable ngrok

# Start the ngrok service now
systemctl start ngrok

# Check if it's running
systemctl status ngrok
```

## Step 5: Verify It's Working

Check the logs to see your URL:

```bash
# View recent logs
journalctl -u ngrok -n 50

# Or watch logs in real-time
journalctl -u ngrok -f
```

You should see your URL: `https://unsweltering-barton-scribal.ngrok-free.dev`

Press `Ctrl+C` to stop watching logs.

## Step 6: Test the HTTPS Endpoint

```bash
# Test your backend through ngrok
curl https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

Should return a response from your backend.

## Step 7: Update Netlify

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Update `REACT_APP_API_URL`:
   - **Old:** `http://38.242.204.63/gif-j/`
   - **New:** `https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/`
   - **Scope:** All scopes
3. Click **Save**
4. Go to **Deploys** tab → **Trigger deploy** → **Clear cache and deploy site**

## Step 8: Verify Backend CORS

Make sure your backend allows requests from Netlify. On your VPS:

```bash
# Edit backend .env file
nano /opt/gifalot/gif-j-backend/.env
# (or wherever your backend .env file is)

# Add or update CORS_ORIGINS:
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Save and restart backend:
```bash
pm2 restart gifalot-backend
```

## Useful Commands

```bash
# Check if ngrok service is running
systemctl status ngrok

# View ngrok logs
journalctl -u ngrok -f

# Restart ngrok
systemctl restart ngrok

# Stop ngrok
systemctl stop ngrok

# Start ngrok
systemctl start ngrok
```

## Troubleshooting

### Service won't start

```bash
# Check what went wrong
journalctl -u ngrok -n 50

# Make sure ngrok is in the right place
which ngrok
# Should show: /usr/local/bin/ngrok

# If not, find where ngrok is:
find /usr -name ngrok 2>/dev/null
```

### Can't see the URL in logs

The URL should be in the logs. If not:
- Wait a few seconds for ngrok to start
- Check: `systemctl status ngrok`
- View logs: `journalctl -u ngrok -n 100`

### URL changes on restart

This is normal for ngrok free tier. The URL changes when you restart the service. For a permanent URL, use DuckDNS + Let's Encrypt (see `SETUP_DUCKDNS_SSL.md`).

## Next Steps

Once the service is running:
1. ✅ Update Netlify environment variable with your ngrok URL
2. ✅ Test your Netlify site
3. ✅ Consider setting up DuckDNS + Let's Encrypt for a permanent URL

You're all set! 🎉


