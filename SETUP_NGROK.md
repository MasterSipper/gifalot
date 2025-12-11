# Setup ngrok for HTTPS Backend (Quick Guide)

## Step 1: Sign Up for ngrok

1. Go to: https://dashboard.ngrok.com/signup
2. Sign up with email (free account)
3. Get your authtoken from the dashboard

## Step 2: Install ngrok on VPS

SSH into your VPS:
```bash
ssh root@38.242.204.63
```

Install ngrok:
```bash
# Download ngrok
cd /tmp
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz

# Extract
tar xvzf ngrok-v3-stable-linux-amd64.tgz

# Move to system path
mv ngrok /usr/local/bin/
chmod +x /usr/local/bin/ngrok

# Verify
ngrok version
```

## Step 3: Configure ngrok

Set your auth token:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

Replace `YOUR_AUTH_TOKEN_HERE` with the token from ngrok dashboard.

## Step 4: Test ngrok

Test it works:
```bash
ngrok http 3001
```

You should see:
```
Forwarding  https://xxxx-xx-xx-xx-xx.ngrok-free.app -> http://localhost:3001
```

Copy the HTTPS URL (something like `https://abc123.ngrok-free.app`).

Press `Ctrl+C` to stop the test.

## Step 5: Create Systemd Service

Create service file:
```bash
nano /etc/systemd/system/ngrok.service
```

Add this configuration:
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

Save and exit (Ctrl+X, Y, Enter).

## Step 6: Start ngrok Service

```bash
# Reload systemd
systemctl daemon-reload

# Enable on boot
systemctl enable ngrok

# Start service
systemctl start ngrok

# Check status
systemctl status ngrok

# View logs to get URL
journalctl -u ngrok -f
```

The logs will show your HTTPS URL.

## Step 7: Get Your HTTPS URL

The URL is in the logs. It looks like:
```
https://xxxx-xx-xx-xx-xx.ngrok-free.app
```

Or get it via API (if web interface is on):
```bash
curl http://localhost:4040/api/tunnels 2>/dev/null | grep -o '"public_url":"https://[^"]*"' | head -1
```

**Note:** On free tier, the URL changes when you restart ngrok. To get a stable URL:
- Use ngrok's static domain feature (requires paid plan)
- Or set up a domain + Let's Encrypt (free, better long-term)

## Step 8: Update Netlify Environment Variable

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Update `REACT_APP_API_URL`:
   - **Old:** `http://38.242.204.63/gif-j/`
   - **New:** `https://xxxx-xx-xx-xx-xx.ngrok-free.app/gif-j/`
   - **Scope:** All scopes
3. Save
4. Go to Deploys → Trigger deploy → Clear cache and deploy site

## Step 9: Update Backend CORS

Make sure your backend allows requests from Netlify:

Update backend `.env` on VPS:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Restart backend:
```bash
pm2 restart gifalot-backend
```

## Step 10: Verify It Works

1. Check ngrok is running:
   ```bash
   systemctl status ngrok
   ```

2. Test HTTPS endpoint:
   ```bash
   curl https://your-ngrok-url.ngrok-free.app/gif-j/
   ```

3. Visit your Netlify site - Mixed Content error should be gone!

## Important Notes

### Free Tier Limitations

- ✅ URL changes on restart (not stable)
- ✅ Rate limits apply
- ✅ "Visit Site" page before accessing (can be annoying)
- 💰 Paid tier ($8/month) removes limitations and gives static domains

### Getting Stable URL (Free Alternative)

If you want a stable URL without paying:
1. Set up DuckDNS (free subdomain)
2. Use Let's Encrypt SSL
3. See `SETUP_DUCKDNS_SSL.md` guide

### Troubleshooting

**ngrok not starting:**
```bash
# Check logs
journalctl -u ngrok -n 50

# Check if port 3001 is in use
netstat -tulpn | grep 3001

# Restart
systemctl restart ngrok
```

**Can't see URL:**
```bash
# View real-time logs
journalctl -u ngrok -f

# Look for line like:
# Forwarding  https://xxxx.ngrok-free.app -> http://localhost:3001
```

**Backend not responding through ngrok:**
- Make sure backend is running: `pm2 status`
- Test backend directly: `curl http://localhost:3001/gif-j/`
- Check ngrok logs for errors

## Quick Commands Reference

```bash
# Start ngrok service
systemctl start ngrok

# Stop ngrok service
systemctl stop ngrok

# Check status
systemctl status ngrok

# View logs
journalctl -u ngrok -f

# Restart
systemctl restart ngrok

# Get URL from logs
journalctl -u ngrok | grep "Forwarding"
```

## Next Steps

Once ngrok is working, consider:
1. ✅ Set up DuckDNS + Let's Encrypt for permanent solution (free)
2. ✅ Or upgrade ngrok for stable domain ($8/month)

Your backend is now accessible via HTTPS! 🎉







