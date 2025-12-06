# Quick Setup - Copy These Commands

## After You Login

Once you see `root@vmi1301963:~#`, run these commands:

### 1. Create Service File

```bash
nano /etc/systemd/system/ngrok.service
```

When nano opens, paste this (right-click in VNC to paste):
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

Save: `Ctrl+X`, then `Y`, then `Enter`

### 2. Enable and Start

```bash
systemctl daemon-reload
systemctl enable ngrok
systemctl start ngrok
systemctl status ngrok
```

### 3. Get Your URL

```bash
journalctl -u ngrok -f
```

You should see: `https://unsweltering-barton-scribal.ngrok-free.dev`

Press `Ctrl+C` to exit.

### 4. Test It

```bash
curl https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

Should return a response!

## Update Netlify

Update `REACT_APP_API_URL` to:
```
https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

Done! ✅


