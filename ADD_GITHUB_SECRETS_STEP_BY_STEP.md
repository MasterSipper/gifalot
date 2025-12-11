# Add GitHub Secrets - Step by Step

## How to Add Secrets

**You add ONE secret at a time** - each secret is a separate entry.

---

## Step-by-Step Instructions

### Step 1: Go to Secrets Page

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Click **Secrets and variables** → **Actions** (left sidebar)
4. Click **Repository secrets** tab
5. Click **New repository secret** button

### Step 2: Add Each Secret One by One

For each secret, you'll:
1. Enter the **Name** (exactly as shown below)
2. Enter the **Secret** (the actual value)
3. Click **Add secret**
4. Repeat for the next secret

---

## List of Secrets to Add

Add these secrets one at a time:

### 1. SSH Key for Ansible
- **Name:** `ANSIBLE_PRIVATE_SSH_KEY_DEV`
- **Secret:** Your SSH private key (the entire key, including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----`)

### 2. Server Connection Info
- **Name:** `ANSIBLE_HOST_VPS1_DEV`
- **Secret:** `38.242.204.63` (your Contabo server IP)

- **Name:** `ANSIBLE_PORT_DEV`
- **Secret:** `22` (or your SSH port)

- **Name:** `ANSIBLE_PASSWORD_DEV`
- **Secret:** Your ansible user password (if using password auth)

### 3. AWS/S3 Credentials
- **Name:** `AWS_ACCESS_KEY_ID_DEV`
- **Secret:** Your AWS access key ID

- **Name:** `AWS_SECRET_ACCESS_KEY_SECRET_DEV`
- **Secret:** Your AWS secret access key

### 4. Application Secrets
- **Name:** `GOOGLE_RECAPTCHA_SECRET_KEY_DEV`
- **Secret:** Your Google reCAPTCHA secret key

- **Name:** `GIPHY_API_KEY_DEV`
- **Secret:** Your GIPHY API key

### 5. Email Configuration
- **Name:** `MAIL_USER_DEV`
- **Secret:** Your email address

- **Name:** `MAIL_PASSWORD_DEV`
- **Secret:** Your email password

### 6. Database/Redis Configuration
- **Name:** `REDIS_HOST_DEV`
- **Secret:** Your Redis host (probably `localhost` or container name)

- **Name:** `REDIS_PASSWORD_DEV`
- **Secret:** Your Redis password

- **Name:** `POSTGRES_HOST_DEV`
- **Secret:** Your PostgreSQL host (probably `localhost` or container name)

- **Name:** `POSTGRES_DB_DEV`
- **Secret:** Your database name (e.g., `gifalot`)

- **Name:** `POSTGRES_USER_DEV`
- **Secret:** Your database username

- **Name:** `POSTGRES_PASSWORD_DEV`
- **Secret:** Your database password

### 7. JWT Secrets
- **Name:** `JWT_ACCESS_TOKEN_SECRET_DEV`
- **Secret:** A long random string (for JWT signing)

- **Name:** `JWT_REFRESH_TOKEN_SECRET_DEV`
- **Secret:** Another long random string (for JWT refresh tokens)

---

## Where to Find These Values

### If You Already Have deploy-dev.yml Working

These secrets should be the **same values** you're using for `dev.gifalot.com`. Check your:
- Server `.env` files
- Ansible configuration
- Existing deployment setup

### SSH Key

If you need to generate or find your SSH key:
```bash
# On your local machine, check if you have the key
cat ~/.ssh/id_rsa
# OR
cat ~/.ssh/id_ed25519

# If you need to generate a new one for the ansible user:
ssh-keygen -t ed25519 -C "ansible@server"
```

Then copy the **private key** (not the public `.pub` file) to the secret.

---

## Quick Reference: Secret Names

Copy-paste these names exactly (case-sensitive):

```
ANSIBLE_PRIVATE_SSH_KEY_DEV
ANSIBLE_HOST_VPS1_DEV
ANSIBLE_PORT_DEV
ANSIBLE_PASSWORD_DEV
AWS_ACCESS_KEY_ID_DEV
AWS_SECRET_ACCESS_KEY_SECRET_DEV
GOOGLE_RECAPTCHA_SECRET_KEY_DEV
GIPHY_API_KEY_DEV
MAIL_USER_DEV
MAIL_PASSWORD_DEV
REDIS_HOST_DEV
REDIS_PASSWORD_DEV
POSTGRES_HOST_DEV
POSTGRES_DB_DEV
POSTGRES_USER_DEV
POSTGRES_PASSWORD_DEV
JWT_ACCESS_TOKEN_SECRET_DEV
JWT_REFRESH_TOKEN_SECRET_DEV
```

---

## Tips

1. **Exact names:** Secret names are case-sensitive - copy them exactly
2. **One at a time:** Add each secret separately
3. **No spaces:** Don't add extra spaces in names or values
4. **Private key:** For SSH key, include the BEGIN/END lines
5. **Save values:** GitHub won't show you the values again after saving

---

## After Adding All Secrets

Once all secrets are added:
1. Go back to your repository
2. Create a test branch
3. Push it to trigger the workflow
4. Check the Actions tab to see it deploy!

---

## Troubleshooting

### "Secret not found" error in workflow

- Check the secret name is spelled exactly right (case-sensitive)
- Verify you added it as a **Repository secret** (not Environment secret)
- Make sure you clicked "Add secret" after entering the value

### Can't find a value

- Check your server's `.env` files
- Check your existing `deploy-dev.yml` workflow (if it works, use the same values)
- Check your Ansible configuration files

---

## Summary

✅ Add **ONE secret at a time**  
✅ Use **Repository secrets** (not Environment secrets)  
✅ Copy the **exact names** (case-sensitive)  
✅ Use the **same values** as your dev environment (if it's working)

Once all secrets are added, you're ready to deploy!


