# Verify SSH Key Setup

## What You've Done
✅ Created a new SSH key pair
✅ Added the private key to GitHub secret `ANSIBLE_PRIVATE_SSH_KEY_DEV`

## Important: Add Public Key to Server

The **public key** must be added to your server's `authorized_keys` file.

### Step 1: Get Your Public Key

On your local machine, get the public key:
```bash
# If you created the key with a specific name
cat ~/.ssh/github_actions_deploy.pub

# Or if you used the default name
cat ~/.ssh/id_ed25519.pub
# or
cat ~/.ssh/id_rsa.pub
```

### Step 2: Add Public Key to Server

SSH into your server and add the public key:

```bash
# SSH into your server (using your existing method)
ssh ansible@your-server-ip -p 2049

# Add the public key to authorized_keys
echo "PASTE_YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys

# Set correct permissions
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### Step 3: Test the Connection

On your local machine, test if the new key works:

```bash
# Test with the new private key
ssh -i ~/.ssh/github_actions_deploy ansible@your-server-ip -p 2049
```

If this works, the GitHub Actions workflow should also work.

## After Setup

Once the public key is on the server:

1. **Trigger a new workflow run:**
   - Go to: `https://github.com/MasterSipper/gifalot/actions`
   - Click "Deploy TEST"
   - Click "Run workflow"
   - Select branch: `test-deployment`
   - Click "Run workflow"

2. **Or wait for the current run to complete** (if one is already running)

3. **Check the logs:**
   - The SSH connection should now succeed
   - The backend deployment should proceed

## Troubleshooting

If you still get "Permission denied":

1. **Verify public key is in authorized_keys:**
   ```bash
   # On server
   cat ~/.ssh/authorized_keys
   ```

2. **Check file permissions on server:**
   ```bash
   # On server
   ls -la ~/.ssh/
   # Should show:
   # -rw------- authorized_keys (600)
   # drwx------ . (700)
   ```

3. **Verify the private key in GitHub:**
   - Make sure it includes the `-----BEGIN` and `-----END` lines
   - No extra spaces at start/end
   - Complete key (not truncated)

4. **Test SSH connection manually:**
   ```bash
   # On local machine
   ssh -i ~/.ssh/github_actions_deploy ansible@your-server-ip -p 2049
   ```

