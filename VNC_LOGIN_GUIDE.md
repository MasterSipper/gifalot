# VNC Login Guide - You're Connected!

You're at the login screen. The error messages you see are warnings, but the system should still work.

## Step 1: Login

At the login prompt, type:

```
root
```

Then press `Enter`.

You'll be prompted for the password. Enter:
- The root password from your Contabo control panel
- OR if you set one up, use that password

**Note:** When typing the password, you won't see any characters (no dots, nothing) - this is normal for security. Just type it and press Enter.

## Step 2: If Login Works

Once logged in, you should see a command prompt like:
```
root@vmi1301963:~#
```

## Step 3: Check System Status

First, let's check if the system is responsive:

```bash
# Check if we can run commands
uptime

# Check system load
top
# Press 'q' to exit top
```

If commands work, the system is fine and we can proceed.

## Step 4: Set Up ngrok Service

Once you're logged in, create the ngrok service:

```bash
# Create the service file
nano /etc/systemd/system/ngrok.service
```

Paste this content (in VNC, you might need to right-click to paste, or use Shift+Insert):

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
- Press `Y` (yes)
- Press `Enter`

Then run:

```bash
# Reload systemd
systemctl daemon-reload

# Enable service
systemctl enable ngrok

# Start service
systemctl start ngrok

# Check status
systemctl status ngrok
```

## About Those Error Messages

The watchdog errors you see:
- `watchdog: BUG: soft lockup - CPU#0 stuck for 23s! [containerd:505]`
- `watchdog: BUG: soft lockup - CPU#2 stuck for 24s! [dockerd:561]`

These indicate the system was under heavy load or frozen temporarily. Common causes:
- Docker containers consuming too much CPU
- System overload
- Resource constraints

**If the system responds to commands, we can proceed.** If it's completely frozen:
- Try rebooting the VPS from Contabo control panel
- Or wait a few minutes for the system to recover

## If Login Doesn't Work

If you can't login:

1. **Try different passwords:**
   - Check Contabo control panel for root password
   - Try common defaults (if this is a fresh install)

2. **Check Contabo Control Panel:**
   - Go to your VPS management
   - Look for "Root Password" or "Reset Password"
   - You might need to reset it

3. **If system seems frozen:**
   - Reboot from Contabo control panel
   - Wait a few minutes
   - Try connecting again

## Quick Troubleshooting

**System seems unresponsive:**
```bash
# Try a simple command first
date

# If that works, system is fine
# If it hangs, system might be frozen
```

**If system is frozen:**
1. Go to Contabo control panel
2. Find your VPS
3. Click "Reboot" or "Restart"
4. Wait 2-3 minutes
5. Try VNC again

## Next Steps

Once logged in and system responds:
1. ✅ Check system is responsive
2. ✅ Create ngrok service file
3. ✅ Enable and start service
4. ✅ Get your ngrok URL
5. ✅ Update Netlify

Try logging in first with `root` and see if the system responds!







