# Generate SSH Key on Windows - Quick Guide

## Step 1: Open PowerShell

Press `Win + X` and select "Windows PowerShell" or "Terminal"

## Step 2: Generate SSH Key

```powershell
ssh-keygen -t ed25519 -C "gifalot-vps"
```

**When prompted:**
1. **File location:** Just press `Enter` (uses default: `C:\Users\YourName\.ssh\id_ed25519`)
2. **Passphrase:** Press `Enter` for no passphrase (easier), or type a passphrase

## Step 3: Copy Your Public Key

After generation, display your public key:

```powershell
Get-Content ~\.ssh\id_ed25519.pub
```

**Copy the entire output** - it starts with `ssh-ed25519` and ends with your email/comment.

Example:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIabcdefghijklmnopqrstuvwxyz gifalot-vps
```

## Step 4: Add to Contabo

1. Go to Contabo panel: https://my.contabo.com/
2. VPS section → Your VPS
3. Look for "SSH Keys" or "Access" section
4. Paste your public key
5. Save

## Step 5: Test Connection

```powershell
ssh admin@38.242.204.63
```

Should connect without password! 🎉

## If Ed25519 Doesn't Work

Use RSA instead:

```powershell
ssh-keygen -t rsa -b 4096 -C "gifalot-vps"
Get-Content ~\.ssh\id_rsa.pub
```

## Your SSH Key Location

- **Private key:** `C:\Users\YourName\.ssh\id_ed25519` (KEEP SECRET!)
- **Public key:** `C:\Users\YourName\.ssh\id_ed25519.pub` (this is what you share)

**Never share your private key!** Only share the public key (ends in .pub).

Generate the key first, then we'll add it to Contabo!



