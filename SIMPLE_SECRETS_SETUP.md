# Simple Secrets Setup - Step by Step

## Easiest Approach: Check If Secrets Already Exist

Since `dev.gifalot.com` is working, the secrets might already be in GitHub:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Look at **Repository secrets** - do you see any secrets there?
4. If yes, note the names - we'll use the same pattern

---

## Method 1: Check Your Local .env Files

On your local machine (Windows PowerShell):

```powershell
cd C:\Projects\Gifalot

# Check backend .env file (if it exists)
if (Test-Path "gif-j-backend\.env") {
    Write-Host "=== Backend .env ==="
    Get-Content gif-j-backend\.env
}

# Check frontend .env file
if (Test-Path "gif-j-react\.env") {
    Write-Host "=== Frontend .env ==="
    Get-Content gif-j-react\.env
}
```

---

## Method 2: Check What's Actually Running on Server

Run these simple commands on server:

```bash
# What containers are running?
docker ps

# What's the actual container name?
docker ps | grep -i backend

# Get the container name, then inspect it
# Replace CONTAINER_NAME with actual name from above
docker inspect CONTAINER_NAME | grep -i "env" | head -30
```

---

## Method 3: Use env.template as Reference

I can see your `env.template` file. For GitHub secrets, you need:

### Required Secrets (with example values):

1. **ANSIBLE_PRIVATE_SSH_KEY_DEV**
   - Your SSH private key for server access
   - Format: `-----BEGIN OPENSSH PRIVATE KEY-----...-----END OPENSSH PRIVATE KEY-----`

2. **ANSIBLE_HOST_VPS1_DEV**
   - Server IP: `38.242.204.63`

3. **ANSIBLE_PORT_DEV**
   - SSH port: `22`

4. **ANSIBLE_PASSWORD_DEV**
   - Password for ansible user (if using password auth)

5. **AWS_ACCESS_KEY_ID_DEV**
   - Your AWS/Contabo S3 access key

6. **AWS_SECRET_ACCESS_KEY_SECRET_DEV**
   - Your AWS/Contabo S3 secret key

7. **POSTGRES_HOST_DEV**
   - Database host (probably: `localhost` or container name)

8. **POSTGRES_DB_DEV**
   - Database name (probably: `gifalot`)

9. **POSTGRES_USER_DEV**
   - Database user (probably: `postgres` or `root`)

10. **POSTGRES_PASSWORD_DEV**
    - Database password

11. **REDIS_HOST_DEV**
    - Redis host (probably: `localhost`)

12. **REDIS_PASSWORD_DEV**
    - Redis password (check your setup)

13. **JWT_ACCESS_TOKEN_SECRET_DEV**
    - Generate: `openssl rand -base64 32`

14. **JWT_REFRESH_TOKEN_SECRET_DEV**
    - Generate: `openssl rand -base64 32`

15. **GOOGLE_RECAPTCHA_SECRET_KEY_DEV**
    - Your reCAPTCHA secret (if you have one)

16. **GIPHY_API_KEY_DEV**
    - Your GIPHY API key (if you have one)

17. **MAIL_USER_DEV**
    - Your email address

18. **MAIL_PASSWORD_DEV**
    - Your email password

---

## Method 4: Generate Values You Don't Have

For values you don't know, you can:

### Generate JWT Secrets:
```bash
# On server or locally
openssl rand -base64 32
# Run twice - once for ACCESS_TOKEN, once for REFRESH_TOKEN
```

### Use Defaults for Some:
- **POSTGRES_HOST_DEV**: `localhost` (or check with `docker ps | grep postgres`)
- **POSTGRES_DB_DEV**: `gifalot` (from your template)
- **POSTGRES_USER_DEV**: `postgres` (common default)
- **REDIS_HOST_DEV**: `localhost` (or check with `docker ps | grep redis`)

---

## Quick Check: What Do You Actually Have?

Answer these questions:

1. **Do you have SSH access to the server?** 
   - If yes, you have the SSH key somewhere

2. **Is dev.gifalot.com working?**
   - If yes, the secrets are working - they might already be in GitHub

3. **Do you have AWS/Contabo S3 credentials?**
   - Check your Contabo account or AWS account

4. **Do you have database credentials?**
   - Check if you set them up when deploying dev

---

## Simplest Solution: Check GitHub First

**Before adding secrets, check if they already exist:**

1. GitHub → Your Repo → Settings → Secrets and variables → Actions
2. Look at Repository secrets
3. If you see any `*_DEV` secrets, note them
4. If `deploy-dev.yml` is working, the secrets are already there!

---

## If Secrets Don't Exist: Start with Minimum

You can start with just the essential secrets and add others later:

### Minimum Required:
1. `ANSIBLE_PRIVATE_SSH_KEY_DEV` - SSH key
2. `ANSIBLE_HOST_VPS1_DEV` - `38.242.204.63`
3. `ANSIBLE_PORT_DEV` - `22`
4. `ANSIBLE_PASSWORD_DEV` - Your password

### Can Use Defaults/Generate:
- JWT secrets - generate with `openssl rand -base64 32`
- Database - use defaults from template
- Redis - use defaults from template

### Optional (can add later):
- AWS/S3 credentials
- reCAPTCHA
- GIPHY API
- Email

---

## Next Steps

1. **First**: Check GitHub to see if secrets already exist
2. **Second**: Check your local `.env` files
3. **Third**: Generate JWT secrets if needed
4. **Fourth**: Use defaults for database/Redis if you don't know them
5. **Fifth**: Add optional secrets later if needed

What do you find when you check GitHub secrets? That's the easiest place to start!

