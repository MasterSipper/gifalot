# Quick VNC Connection - Ready to Use!

## Your Connection Details

**VNC Connection:**
- **Address:** `207.180.255.187:63341`
- **Password:** `Guerill5`

## Connect Now

1. **Install VNC Viewer** (if needed):
   - Download: https://www.realvnc.com/en/connect/download/viewer/

2. **Connect:**
   - Open VNC Viewer
   - Enter: `207.180.255.187:63341`
   - Password: `Guerill5`
   - Click Connect

3. **You should see your VPS desktop!**

## Once Connected - Set Up ngrok Service

1. **Open Terminal** (right-click desktop or Applications menu)

2. **Create service file:**
   ```bash
   nano /etc/systemd/system/ngrok.service
   ```

3. **Paste this (Ctrl+Shift+V in terminal):**
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

4. **Save:** Ctrl+X, then Y, then Enter

5. **Enable and start:**
   ```bash
   systemctl daemon-reload
   systemctl enable ngrok
   systemctl start ngrok
   systemctl status ngrok
   ```

6. **Get your URL:**
   ```bash
   journalctl -u ngrok -f
   ```
   You should see: `https://unsweltering-barton-scribal.ngrok-free.dev`

## Update Netlify

Update `REACT_APP_API_URL` to:
```
https://unsweltering-barton-scribal.ngrok-free.dev/gif-j/
```

**Done!** ✅


