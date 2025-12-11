# Setup GitHub SSH Authentication - Contabo VPS

Based on Contabo support's recommendations, here's how to set up GitHub access on your VPS.

## Step 1: Generate SSH Key on Your Server

SSH into your VPS and run:

```bash
ssh root@38.242.204.63 -p 2049
```

Then generate the SSH key:

```bash
ssh-keygen -t ed25519 -C "vps-vmi1301963" -f ~/.ssh/id_ed25519_gifalot
```

**When prompted:**
- Press Enter to accept default location (or specify path)
- **Optionally** set a passphrase (recommended for security) or press Enter twice to skip

## Step 2: Display the Public Key

```bash
cat ~/.ssh/id_ed25519_gifalot.pub
```

**Copy the entire output** - it will look something like:
```
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... vps-vmi1301963
```

## Step 3: Add Public Key to GitHub

1. Go to GitHub: https://github.com/settings/keys
2. Click **"New SSH key"**
3. **Title:** `Contabo VPS - vmi1301963`
4. **Key type:** Authentication Key
5. **Key:** Paste the public key you copied in Step 2
6. Click **"Add SSH key"**

## Step 4: Configure SSH Config

Create/edit the SSH config file:

```bash
nano ~/.ssh/config
```

Add this configuration:

```
Host github.com-gifalot
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519_gifalot
```

Save and exit (Ctrl+X, Y, Enter)

## Step 5: Set Permissions

```bash
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/id_ed25519_gifalot
chmod 644 ~/.ssh/id_ed25519_gifalot.pub
```

## Step 6: Test SSH Connection

```bash
ssh -T git@github.com-gifalot
```

You should see:
```
Hi MasterSipper! You've successfully authenticated, but GitHub does not provide shell access.
```

## Step 7: Configure Git (if not already done)

```bash
git config --global user.name "MasterSipper"
git config --global user.email "your-email@example.com"
```

## Step 8: Clone Repository Using SSH

If you need to clone fresh:

```bash
cd /home/ansible/services/dev
git clone git@github.com-gifalot:MasterSipper/gifalot.git
```

## Step 9: Update Existing Repository to Use SSH

If you already have the repository cloned via HTTPS:

```bash
cd /home/ansible/services/dev/gif-j-backend
git remote -v
```

If it shows HTTPS URL, change it to SSH:

```bash
git remote set-url origin git@github.com-gifalot:MasterSipper/gifalot.git
```

Verify:
```bash
git remote -v
```

Should show:
```
origin  git@github.com-gifalot:MasterSipper/gifalot.git (fetch)
origin  git@github.com-gifalot:MasterSipper/gifalot.git (push)
```

## Step 10: Test Git Pull

```bash
cd /home/ansible/services/dev/gif-j-backend
git pull origin dev
```

Should work without asking for credentials!

## Troubleshooting

### If SSH Connection Fails

```bash
# Test connection with verbose output
ssh -vT git@github.com-gifalot

# Check if key is loaded
ssh-add -l

# Add key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519_gifalot
```

### If Git Pull Still Asks for Credentials

```bash
# Make sure remote URL is correct
git remote -v

# If it's still HTTPS, change it:
git remote set-url origin git@github.com-gifalot:MasterSipper/gifalot.git
```

### Check Firewall (if needed)

```bash
# Allow outbound SSH (port 22)
ufw allow out 22
ufw allow out 443

# Check firewall status
ufw status
```

### Verify Git Config

```bash
git config --global --list
```

Should show your name and email.

## Quick Reference Commands

```bash
# Pull latest code
cd /home/ansible/services/dev/gif-j-backend
git pull origin dev

# Rebuild and restart container
docker compose up -d --build app

# Or with project name
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app
```

## Automation (Optional)

Create a simple script to update and deploy:

```bash
nano /usr/local/bin/update-backend.sh
```

Add:
```bash
#!/bin/bash
cd /home/ansible/services/dev/gif-j-backend
git pull origin dev
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app
echo "Backend updated and restarted"
```

Make it executable:
```bash
chmod +x /usr/local/bin/update-backend.sh
```

Run it:
```bash
/usr/local/bin/update-backend.sh
```

## Success Checklist

- [ ] SSH key generated
- [ ] Public key added to GitHub
- [ ] SSH config file created
- [ ] Permissions set correctly
- [ ] SSH connection test successful
- [ ] Git remote URL updated to SSH
- [ ] `git pull` works without credentials
- [ ] Can rebuild containers after pull

## Next Steps

Once this is set up, you can:
1. Pull code updates: `git pull origin dev`
2. Rebuild containers: `docker compose up -d --build app`
3. Set up automated deployments (optional)





