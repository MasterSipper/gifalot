
# Set Up SSH Key Authentication

SSH keys can bypass password login issues. Here's how to set it up.

## Step 1: Generate SSH Key on Your Local Machine

Open PowerShell on your Windows machine:

```powershell
# Generate SSH key (Ed25519 - recommended)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Or if Ed25519 doesn't work, use RSA:
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

**When prompted:**
1. **File location:** Press Enter for default (`C:\Users\YourUsername\.ssh\id_ed25519`)
2. **Passphrase:** Press Enter for no passphrase (easier) OR enter a passphrase (more secure)

## Step 2: View Your Public Key

After generating, view your public key:

```powershell
# For Ed25519 key:
Get-Content ~\.ssh\id_ed25519.pub

# Or for RSA key:
Get-Content ~\.ssh\id_rsa.pub
```

**Copy the entire output** - it looks like:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... your-email@example.com
```

## Step 3: Add SSH Key to Contabo

### Option A: Via Contabo Control Panel (Recommended)

1. **Log into Contabo:**
   - Go to: https://my.contabo.com/
   - Login

2. **Go to VPS Section:**
   - Click "VPS"
   - Select your VPS (38.242.204.63)

3. **Find SSH Keys Section:**
   - Look for "SSH Keys", "Access", or "Security" section
   - Click "Add SSH Key" or "Register SSH Key"

4. **Add Your Public Key:**
   - Paste the public key you copied (entire line)
   - Give it a name (e.g., "My Windows PC")
   - Save

5. **Wait a few minutes** for it to apply

### Option B: Add Key via Contabo API/Interface

Some Contabo interfaces allow adding SSH keys directly to the VPS:
- Look for "SSH Keys" in VPS management
- Or "Access Management"
- Add your public key there

## Step 4: Test SSH Connection

From your local machine (PowerShell):

```powershell
# Try connecting with SSH key
ssh admin@38.242.204.63

# Or with root:
ssh root@38.242.204.63

# Or if using specific key file:
ssh -i ~\.ssh\id_ed25519 admin@38.242.204.63
```

If SSH key is set up correctly, you should connect **without entering a password!**

## Step 5: If Contabo Doesn't Support SSH Key Upload

If Contabo panel doesn't have SSH key management:

### Alternative: Manual Setup (Requires Login First)

Unfortunately, to add SSH keys manually, you need to log in first. But you can:

1. **Contact Contabo Support:**
   - Ask them to add your SSH public key
   - Provide them the public key
   - They can add it to authorized_keys

2. **Use Contabo's Console:**
   - Some providers offer web console
   - You might be able to add keys from there

## Step 6: Once SSH Works - Set Up ngrok

Once you can SSH into your VPS (with key or password):

```bash
# Create ngrok service file
sudo nano /etc/systemd/system/ngrok.service
```

Paste:
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

Save and enable:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ngrok
sudo systemctl start ngrok
systemctl status ngrok
```

## Troubleshooting

### SSH Connection Refused

1. **Check if SSH port is open:**
   - Contabo firewall might block port 22
   - Check firewall settings in Contabo panel

2. **Try different port:**
   ```powershell
   ssh -p 2222 admin@38.242.204.63
   ```

### SSH Key Not Working

1. **Check key permissions (on Linux):**
   ```bash
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

2. **Verify key is in authorized_keys:**
   ```bash
   cat ~/.ssh/authorized_keys
   ```

But you need login access first to run these commands!

### Permission Denied (publickey)

- SSH key might not be added correctly
- Try adding it again in Contabo panel
- Or contact Contabo support

## Quick Steps Summary

1. ✅ Generate SSH key on your Windows machine
2. ✅ Copy the public key
3. ✅ Add to Contabo control panel (SSH Keys section)
4. ✅ Test SSH connection from Windows
5. ✅ If SSH works, set up ngrok service
6. ✅ Update Netlify with HTTPS backend URL

## Check Contabo Panel First

**Before generating keys**, check if Contabo supports SSH key management:

1. Go to Contabo panel
2. VPS section → Your VPS
3. Look for:
   - "SSH Keys"
   - "Access Management"
   - "Security" → "SSH Keys"
   - Or similar options

If you find this option, that's the easiest way! If not, you'll need to contact Contabo support to add the key manually.

Let me know what you find in the Contabo panel regarding SSH keys!



