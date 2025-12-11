# Setup SSH Key Created on Server

## What You Did
✅ Created SSH key pair on the server as `root` user
✅ Got the public key: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDK9tWiZpfSrFSN0N4LEFts3Vk9dta3u8knGzldiU2xB github-actions`

## Important: Add Public Key to `ansible` User

Since GitHub Actions connects as the `ansible` user (not `root`), you need to add the public key to the `ansible` user's `authorized_keys`.

### Step 1: Add Public Key to ansible User

On your server, run these commands:

```bash
# Switch to ansible user (or use sudo)
sudo su - ansible

# Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add the public key to authorized_keys
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDK9tWiZpfSrFSN0N4LEFts3Vk9dta3u8knGzldiU2xB github-actions" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# Exit back to root
exit
```

### Step 2: Copy Private Key to GitHub

You need to get the private key and add it to GitHub secrets:

```bash
# On your server (as root)
cat ~/.ssh/github_actions_deploy
```

Copy the **entire output** (including `-----BEGIN` and `-----END` lines), then:

1. Go to: `https://github.com/MasterSipper/gifalot/settings/secrets/actions`
2. Update the `ANSIBLE_PRIVATE_SSH_KEY_DEV` secret
3. Paste the entire private key
4. Save

### Step 3: Test Connection

Test if the key works (from your local machine, or from the server):

```bash
# From server, test as ansible user
sudo -u ansible ssh -i /root/.ssh/github_actions_deploy ansible@localhost -p 2049
```

Or if you have the private key locally, test from your local machine.

## Alternative: Create Key on Local Machine

If you prefer, you can also create the key on your local machine:

1. **On your local Windows machine:**
   ```powershell
   ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_actions_deploy
   ```

2. **Copy public key to server:**
   ```powershell
   # Get public key
   cat ~/.ssh/github_actions_deploy.pub
   ```
   
   Then on server:
   ```bash
   sudo su - ansible
   echo "PASTE_PUBLIC_KEY" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   ```

3. **Add private key to GitHub:**
   ```powershell
   cat ~/.ssh/github_actions_deploy
   ```
   Copy and paste into GitHub secret.

## Current Status

Since you already created the key on the server:
- ✅ Private key is at: `/root/.ssh/github_actions_deploy`
- ⚠️ Need to: Add public key to `/home/ansible/.ssh/authorized_keys`
- ⚠️ Need to: Copy private key to GitHub secret

