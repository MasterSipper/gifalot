# Quick VNC Login Steps

You're at the login screen. Here's what to do:

## Login

1. **Type:** `root`
2. **Press Enter**
3. **Enter password** (from Contabo control panel)
   - You won't see characters when typing - this is normal!
4. **Press Enter**

## If Login Works

You should see:
```
root@vmi1301963:~#
```

Test if system is responsive:
```bash
date
```

If it shows the date/time, system is working! ✅

## If System Responds - Set Up ngrok

```bash
# Create service file
nano /etc/systemd/system/ngrok.service
```

Paste this (right-click or Shift+Insert to paste in VNC):
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

Save: Ctrl+X, Y, Enter

Then:
```bash
systemctl daemon-reload
systemctl enable ngrok
systemctl start ngrok
systemctl status ngrok
```

## Get Root Password

If you don't have it:
1. Go to Contabo control panel
2. Find your VPS
3. Look for "Root Password" or "Access Details"
4. Copy the password

## Error Messages?

Those watchdog errors are just warnings. If you can login and run commands, ignore them - system is fine!

Try logging in now with `root` and your password! 🔑







