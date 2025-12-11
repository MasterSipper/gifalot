# Quick: Create ngrok Service File

You have:
- ✅ ngrok installed
- ✅ Auth token set
- ✅ URL: `https://unsweltering-barton-scribal.ngrok-free.dev`

Now create the service file:

## Commands to Run (Copy-Paste)

SSH into your VPS first:
```bash
ssh root@38.242.204.63
```

Then run these commands:

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

Then:
1. Press `Ctrl + X` to exit
2. Press `Y` to save
3. Press `Enter` to confirm

Now run these commands:

```bash
# 2. Reload systemd
systemctl daemon-reload

# 3. Enable service to start on boot
systemctl enable ngrok

# 4. Start the service
systemctl start ngrok

# 5. Check if it's running
systemctl status ngrok
```

## Verify It's Working

Check the logs to see your URL:

```bash
journalctl -u ngrok -f
```

You should see your URL. Press `Ctrl+C` to exit.

## Test Your Backend

```bash
curl https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

Should return a response!

## Update Netlify

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Update `REACT_APP_API_URL` to:
   ```
   https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
   ```
3. Trigger a new deploy

**Done!** ✅







