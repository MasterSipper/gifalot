# Setup SSH Key for Contabo VPS

## Step 1: Check if You Already Have SSH Keys

First, check if you already have SSH keys:

```powershell
# Check if .ssh directory exists
Test-Path ~\.ssh

# List existing keys
Get-ChildItem ~\.ssh
```

If you see `id_rsa` and `id_rsa.pub` (or `id_ed25519` and `id_ed25519.pub`), you already have keys! Skip to Step 3.

## Step 2: Generate New SSH Key Pair

Open PowerShell and run:

```powershell
# Generate SSH key (using Ed25519 - recommended, more secure)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Or if Ed25519 doesn't work, use RSA:
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
```

**When prompted:**
1. **File location:** Press Enter to use default (`C:\Users\YourUsername\.ssh\id_ed25519`)
2. **Passphrase:** 
   - Press Enter for no passphrase (easier, less secure)
   - OR enter a passphrase (more secure, but you'll need to enter it each time)

## Step 3: View Your Public Key

After generating, view your public key:

```powershell
# For Ed25519 key:
Get-Content ~\.ssh\id_ed25519.pub

# Or for RSA key:
Get-Content ~\.ssh\id_rsa.pub
```

**Copy the entire output** - it will look like:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... your-email@example.com
```

Or for RSA:
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQ... your-email@example.com
```

## Step 4: Add Public Key to Contabo

1. Log into your **Contabo Customer Panel**
2. Go to your VPS management
3. Look for **"SSH Keys"** or **"Access"** section
4. Click **"Add SSH Key"** or **"Register SSH Key"**
5. Paste your **public key** (the one you copied in Step 3)
6. Give it a name (e.g., "My Laptop" or "Windows PC")
7. Save/Submit

## Step 5: Test SSH Connection

After adding the key, test the connection:

```powershell
# Connect to your VPS
ssh root@38.242.204.63
```

**First time connection:**
- You'll see a message about host authenticity - type `yes`
- If you set a passphrase, enter it
- You should be logged in without a password!

## Alternative: Password Authentication

If Contabo doesn't support SSH key upload, or you want to use password:

1. **Get your root password** from Contabo control panel
2. Connect with:
   ```powershell
   ssh root@38.242.204.63
   ```
3. Enter the password when prompted

## Troubleshooting

### "Permission denied (publickey)"

- Make sure you copied the **public key** (`.pub` file), not the private key
- Verify the key was added correctly in Contabo
- Try: `ssh -v root@38.242.204.63` for detailed error messages

### "Could not resolve hostname"

- Check your internet connection
- Verify the IP: `38.242.204.63`
- Try pinging: `ping 38.242.204.63`

### "Connection refused"

- VPS might be down - check Contabo control panel
- Firewall might be blocking - check Contabo firewall settings
- SSH service might not be running on VPS

### SSH Key Not Working

If password auth works but key doesn't:

1. Make sure you're using the correct key:
   ```powershell
   ssh -i ~\.ssh\id_ed25519 root@38.242.204.63
   ```

2. Check key permissions (on Linux VPS):
   ```bash
   # After logging in with password
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```

## Quick Reference

**Your VPS Details:**
- IP: `38.242.204.63`
- User: `root`
- SSH Port: `22` (default)

**Common Commands:**
```powershell
# Connect
ssh root@38.242.204.63

# Connect with specific key
ssh -i ~\.ssh\id_ed25519 root@38.242.204.63

# Copy file to VPS
scp file.txt root@38.242.204.63:/path/to/destination

# Copy file from VPS
scp root@38.242.204.63:/path/to/file.txt ./
```

## Next Steps

Once SSH is working:
1. ✅ Follow [QUICK_START_CONTABO_VPS.md](./QUICK_START_CONTABO_VPS.md)
2. ✅ Set up your backend
3. ✅ Deploy your application







