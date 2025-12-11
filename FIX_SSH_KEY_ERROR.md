# Fix SSH Key Authentication Error

## Error Message
```
Permission denied (publickey,password)
```

This means the SSH key authentication is failing.

## Possible Causes

1. **SSH key secret is missing or incorrect**
   - The `ANSIBLE_PRIVATE_SSH_KEY_DEV` secret might not be set
   - The key might be incorrectly formatted

2. **SSH key format issue**
   - The key might be missing the header/footer
   - The key might have extra whitespace

3. **Key not authorized on server**
   - The public key might not be in `~/.ssh/authorized_keys` on the server

## How to Fix

### Step 1: Verify SSH Key Secret Exists

1. Go to: `https://github.com/MasterSipper/gifalot/settings/secrets/actions`
2. Look for: `ANSIBLE_PRIVATE_SSH_KEY_DEV`
3. If it's missing, you need to add it

### Step 2: Get the Correct SSH Private Key

The SSH key should be the **private key** that corresponds to a public key that's authorized on your server.

**Option A: If you have the key file locally**
```bash
# On your local machine, find your SSH key
cat ~/.ssh/id_rsa
# or
cat ~/.ssh/id_ed25519
```

**Option B: Generate a new key pair (if you don't have one)**

1. **Generate new SSH key:**
   ```bash
   ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
   ```
   - Press Enter to accept default location
   - Press Enter twice for no passphrase (or set one if preferred)

2. **Copy the public key to your server:**
   ```bash
   # On your local machine
   cat ~/.ssh/github_actions_deploy.pub
   ```
   
   Then on your server:
   ```bash
   # SSH into your server
   ssh ansible@your-server-ip -p 2049
   
   # Add the public key to authorized_keys
   echo "PASTE_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
   chmod 600 ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   ```

3. **Get the private key:**
   ```bash
   # On your local machine
   cat ~/.ssh/github_actions_deploy
   ```
   Copy the entire output (including `-----BEGIN` and `-----END` lines)

### Step 3: Add/Update the Secret in GitHub

1. Go to: `https://github.com/MasterSipper/gifalot/settings/secrets/actions`
2. Click **"New repository secret"** (or update existing)
3. **Name:** `ANSIBLE_PRIVATE_SSH_KEY_DEV`
4. **Secret:** Paste the **entire private key** (including headers):
   ```
   -----BEGIN OPENSSH PRIVATE KEY-----
   [key content]
   -----END OPENSSH PRIVATE KEY-----
   ```
5. Click **"Add secret"**

### Step 4: Verify Key Format

The private key should:
- Start with `-----BEGIN OPENSSH PRIVATE KEY-----` or `-----BEGIN RSA PRIVATE KEY-----`
- End with `-----END OPENSSH PRIVATE KEY-----` or `-----END RSA PRIVATE KEY-----`
- Have no extra spaces or line breaks at the start/end
- Be the complete key (not truncated)

### Step 5: Test SSH Connection

Test if the key works:

```bash
# On your local machine
ssh -i ~/.ssh/github_actions_deploy ansible@your-server-ip -p 2049
```

If this works, the key is correct. If not, check:
- The public key is in `~/.ssh/authorized_keys` on the server
- File permissions on server: `chmod 600 ~/.ssh/authorized_keys`

## Quick Check: Do You Have Existing SSH Keys?

If you already have SSH keys set up for your server, you can use those:

1. **Find your existing key:**
   ```bash
   ls -la ~/.ssh/
   ```

2. **Check which key is authorized on the server:**
   ```bash
   # SSH into server
   ssh ansible@your-server-ip -p 2049
   
   # Check authorized_keys
   cat ~/.ssh/authorized_keys
   ```

3. **Match the public key to a private key on your local machine**

4. **Use that private key as the GitHub secret**

## After Fixing

Once you've updated the secret:
1. Go to Actions tab
2. Re-run the failed workflow (or push a new commit)
3. The SSH connection should work

