# Fix SSH Connection Timeout

## Problem

SSH connection to `38.242.204.63` is timing out on port 22.

## Possible Causes

1. **Firewall blocking port 22**
2. **SSH service not running on VPS**
3. **Wrong SSH port** (some VPS use different ports)
4. **VPS is down or not accessible**

## Solutions

### Option 1: Check Contabo Firewall Settings ⭐

The firewall might be blocking SSH:

1. **Log into Contabo Customer Panel**
   - Go to: https://my.contabo.com/
   - Login to your account

2. **Check Firewall Rules**
   - Navigate to your VPS management
   - Look for **"Firewall"** or **"Security"** section
   - Make sure **port 22 (SSH)** is allowed
   - Allow incoming connections from your IP

3. **If firewall is enabled, add rule:**
   - Protocol: TCP
   - Port: 22
   - Source: Your IP address (or 0.0.0.0/0 for all)
   - Action: Allow

### Option 2: Use VNC Access (No SSH Needed) ⭐

You have VNC access available! Use this to access your VPS directly:

**VNC Details:**
- **Host:** `207.180.255.187:63341`
- Use a VNC client to connect

**Steps:**

1. **Install VNC Viewer:**
   - Download: https://www.realvnc.com/en/connect/download/viewer/
   - Or use any VNC client

2. **Connect:**
   - Open VNC Viewer
   - Enter: `207.180.255.187:63341`
   - Connect
   - You'll see the VPS desktop

3. **Get VNC password from Contabo:**
   - Check your Contabo control panel
   - Look for VNC password or access details

4. **Once connected via VNC:**
   - Open terminal on the VPS
   - You can now run commands directly
   - Set up ngrok service as needed

### Option 3: Try Different SSH Port

Some VPS providers use non-standard SSH ports. Check your Contabo panel for:
- Custom SSH port (might be 2222, 2200, etc.)
- SSH port configuration

Try:
```powershell
# Try common alternative ports
ssh -p 2222 root@38.242.204.63
ssh -p 2200 root@38.242.204.63
```

### Option 4: Check if VPS is Running

1. **Log into Contabo Control Panel**
2. **Check VPS Status**
   - Make sure VPS is running
   - If stopped, start it

3. **Check VPS IP**
   - Verify IP is correct: `38.242.204.63`
   - Make sure it hasn't changed

### Option 5: Try from Different Network

Sometimes your network/firewall blocks outbound SSH:
- Try from different network (mobile hotspot)
- Try from different location

## Recommended: Use VNC

Since SSH isn't working, **use VNC access** - it's the fastest solution:

1. **Install VNC Viewer:**
   - Download: https://www.realvnc.com/en/connect/download/viewer/

2. **Get VNC credentials from Contabo:**
   - Log into Contabo panel
   - Go to your VPS
   - Find VNC access section
   - Note the password

3. **Connect via VNC:**
   - Open VNC Viewer
   - Connect to: `207.180.255.187:63341`
   - Enter password when prompted

4. **Once connected:**
   - Open terminal in VNC
   - Run commands directly on the VPS
   - Set up ngrok service

## Alternative: Use Contabo Console Access

Many VPS providers offer a web-based console:

1. **Log into Contabo Control Panel**
2. **Go to your VPS**
3. **Look for "Console" or "Terminal" option**
4. **Open web-based console**
5. **Run commands directly**

## Quick Actions

### Check VPS Status

1. Log into Contabo: https://my.contabo.com/
2. Check if VPS is running
3. Check firewall settings
4. Check VNC access details

### Enable SSH via VNC/Console

Once you access via VNC or console, you can:

1. **Check if SSH is running:**
   ```bash
   systemctl status ssh
   # Or
   systemctl status sshd
   ```

2. **Start SSH if stopped:**
   ```bash
   systemctl start ssh
   systemctl enable ssh
   ```

3. **Check firewall:**
   ```bash
   ufw status
   # Allow SSH if needed
   ufw allow 22/tcp
   ```

4. **Check if SSH is listening:**
   ```bash
   netstat -tulpn | grep :22
   # Or
   ss -tulpn | grep :22
   ```

## Next Steps

1. ✅ **Try VNC access first** (easiest)
2. ✅ **Check Contabo firewall settings**
3. ✅ **Check VPS status in Contabo panel**
4. ✅ Once connected, set up ngrok service

## Using VNC to Set Up ngrok Service

Once you're connected via VNC and have terminal access:

1. **Open terminal on VPS**
2. **Create ngrok service file:**
   ```bash
   nano /etc/systemd/system/ngrok.service
   ```

3. **Add the service configuration:**
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

4. **Enable and start:**
   ```bash
   systemctl daemon-reload
   systemctl enable ngrok
   systemctl start ngrok
   ```

## Need Help?

If VNC also doesn't work:
- Contact Contabo support
- Check Contabo status page for outages
- Verify your VPS is active and paid for



