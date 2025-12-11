# Add GitHub Secrets - Starting from Scratch

## Current Status: No Secrets Found

You need to add all secrets. Let's do this step by step, starting with what you know.

---

## Step 1: Add Essential Connection Secrets

Click **"New repository secret"** and add these one at a time:

### 1. Server Connection
- **Name:** `ANSIBLE_HOST_VPS1_DEV`
- **Secret:** `38.242.204.63`
- Click **Add secret**

- **Name:** `ANSIBLE_PORT_DEV`
- **Secret:** `2049`
- Click **Add secret**

### 2. SSH Key (You'll need to get this)

**Option A: If you have SSH access working:**
- On your local machine, check: `cat ~/.ssh/id_rsa` or `cat ~/.ssh/id_ed25519`
- Copy the entire private key (including `-----BEGIN` and `-----END` lines)

**Option B: Generate a new SSH key for the ansible user:**
```bash
# On your local machine
ssh-keygen -t ed25519 -C "ansible@server"
# Save it somewhere safe, then copy the private key
```

- **Name:** `ANSIBLE_PRIVATE_SSH_KEY_DEV`
- **Secret:** (paste the entire private key)
- Click **Add secret**

### 3. Ansible Password (if using password auth)
- **Name:** `ANSIBLE_PASSWORD_DEV`
- **Secret:** (your ansible user password, or leave empty if using key-only auth)
- Click **Add secret**

---

## Step 2: Generate JWT Secrets

On your local machine (PowerShell or Command Prompt):

```powershell
# Generate JWT Access Token Secret
openssl rand -base64 32

# Generate JWT Refresh Token Secret (run again)
openssl rand -base64 32
```

**If openssl isn't available, use this PowerShell command:**
```powershell
# Generate random string
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Add to GitHub:
- **Name:** `JWT_ACCESS_TOKEN_SECRET_DEV`
- **Secret:** (paste the first generated string)
- Click **Add secret**

- **Name:** `JWT_REFRESH_TOKEN_SECRET_DEV`
- **Secret:** (paste the second generated string)
- Click **Add secret**

---

## Step 3: Database Secrets

Use these defaults or your actual values:

- **Name:** `POSTGRES_HOST_DEV`
- **Secret:** `localhost` (or your database host)
- Click **Add secret**

- **Name:** `POSTGRES_DB_DEV`
- **Secret:** `gifalot` (from your template)
- Click **Add secret**

- **Name:** `POSTGRES_USER_DEV`
- **Secret:** `postgres` (or your database user)
- Click **Add secret**

- **Name:** `POSTGRES_PASSWORD_DEV`
- **Secret:** (your database password - if you don't know it, you may need to check your server setup)
- Click **Add secret**

---

## Step 4: Redis Secrets

- **Name:** `REDIS_HOST_DEV`
- **Secret:** `localhost` (or your Redis host)
- Click **Add secret**

- **Name:** `REDIS_PASSWORD_DEV`
- **Secret:** `redis` (or your actual Redis password)
- Click **Add secret**

---

## Step 5: AWS/S3 Secrets (If You Have Them)

If you're using AWS S3 or Contabo Object Storage:

- **Name:** `AWS_ACCESS_KEY_ID_DEV`
- **Secret:** (your S3 access key ID)
- Click **Add secret**

- **Name:** `AWS_SECRET_ACCESS_KEY_SECRET_DEV`
- **Secret:** (your S3 secret access key)
- Click **Add secret**

**If you don't have these yet:** You can add placeholder values or skip for now and add later.

---

## Step 6: Optional Secrets (Can Add Later)

These are optional - add them if you have the values:

- **Name:** `GOOGLE_RECAPTCHA_SECRET_KEY_DEV`
- **Secret:** (your reCAPTCHA secret, if you have one)

- **Name:** `GIPHY_API_KEY_DEV`
- **Secret:** (your GIPHY API key, if you have one)

- **Name:** `MAIL_USER_DEV`
- **Secret:** (your email address for sending emails)

- **Name:** `MAIL_PASSWORD_DEV`
- **Secret:** (your email password or app password)

---

## Quick Checklist

Add these secrets in order:

### Must Have:
- [ ] `ANSIBLE_HOST_VPS1_DEV` = `38.242.204.63`
- [ ] `ANSIBLE_PORT_DEV` = `2049`
- [ ] `ANSIBLE_PRIVATE_SSH_KEY_DEV` = (your SSH private key)
- [ ] `ANSIBLE_PASSWORD_DEV` = (your password, if needed)
- [ ] `JWT_ACCESS_TOKEN_SECRET_DEV` = (generate with openssl)
- [ ] `JWT_REFRESH_TOKEN_SECRET_DEV` = (generate with openssl)

### Database:
- [ ] `POSTGRES_HOST_DEV` = `localhost`
- [ ] `POSTGRES_DB_DEV` = `gifalot`
- [ ] `POSTGRES_USER_DEV` = `postgres`
- [ ] `POSTGRES_PASSWORD_DEV` = (your password)

### Redis:
- [ ] `REDIS_HOST_DEV` = `localhost`
- [ ] `REDIS_PASSWORD_DEV` = `redis` (or your password)

### Optional (Can Add Later):
- [ ] `AWS_ACCESS_KEY_ID_DEV`
- [ ] `AWS_SECRET_ACCESS_KEY_SECRET_DEV`
- [ ] `GOOGLE_RECAPTCHA_SECRET_KEY_DEV`
- [ ] `GIPHY_API_KEY_DEV`
- [ ] `MAIL_USER_DEV`
- [ ] `MAIL_PASSWORD_DEV`

---

## How to Get SSH Key

If you don't have your SSH key:

### Option 1: Check if you already have one
```powershell
# On Windows PowerShell
Get-Content ~/.ssh/id_rsa
# OR
Get-Content ~/.ssh/id_ed25519
```

### Option 2: Generate a new one
```powershell
# Generate new SSH key
ssh-keygen -t ed25519 -C "ansible@server"
# Save it to: C:\Users\YourName\.ssh\id_ed25519
# Then copy the private key content
Get-Content ~/.ssh/id_ed25519
```

### Option 3: Use existing server access
If you can SSH into the server, you already have a key somewhere. Check:
- Your SSH client (PuTTY, if using that)
- Your `.ssh` folder
- Any saved keys in your password manager

---

## After Adding Secrets

Once you've added the essential secrets:

1. Commit and push the workflow file (if not already done)
2. Create a test branch
3. Push it to trigger the workflow
4. Check GitHub Actions to see if it works

---

## Need Help Finding Values?

If you need help finding specific values:
- **SSH Key**: Check your local `.ssh` folder or SSH client
- **Database password**: Check your server setup or reset it
- **AWS/S3**: Check your Contabo or AWS account
- **JWT secrets**: Generate new ones (it's safe to use new values)

Start with the essential secrets first, then add the optional ones later!

