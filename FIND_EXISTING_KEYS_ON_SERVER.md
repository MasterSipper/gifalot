# Find Existing Keys on Server

## Yes, You Can Reuse the Same Keys!

The test environment can use the **same** AWS, Google, GIPHY, and other keys as your dev environment. You don't need to create new ones.

---

## Commands to Find Values on Server

SSH into your server and run these commands:

```bash
ssh root@38.242.204.63 -p 2049
```

---

## Method 1: Check Running Container Environment

```bash
# Find the backend container
docker ps | grep gif-j-backend-dev

# Get the container ID/name, then inspect it
# Replace CONTAINER_NAME with actual name from above
docker inspect CONTAINER_NAME | grep -A 100 "Env" | grep -E "AWS|GIPHY|RECAPTCHA|MAIL"
```

**Or try this all-in-one command:**
```bash
# Get environment from any running gif-j-backend container
docker inspect $(docker ps -q --filter "name=gif-j-backend") 2>/dev/null | \
  grep -A 100 "Env" | \
  grep -E "AWS_ACCESS_KEY_ID|AWS_SECRET|GIPHY|RECAPTCHA|MAIL_USER|MAIL_PASSWORD" | \
  sed 's/",//g' | sed 's/"//g' | sed 's/\[//g' | sed 's/\]//g'
```

---

## Method 2: Check Docker Compose File

```bash
# Check docker-compose.yml for environment variables
cat /home/ansible/services/dev/gif-j-backend/docker-compose.yml 2>/dev/null | \
  grep -A 50 "environment:" | \
  grep -E "AWS|GIPHY|RECAPTCHA|MAIL"
```

---

## Method 3: Check .env Files

```bash
# Find .env files
find /home/ansible/services -name ".env" -o -name "*.env" 2>/dev/null

# Check the .env file (if it exists)
cat /home/ansible/services/dev/gif-j-backend/.env 2>/dev/null | \
  grep -E "AWS|GIPHY|RECAPTCHA|MAIL"
```

---

## Method 4: Check Ansible Variables

```bash
# Check Ansible vars file
cat /home/ansible/services/dev/gif-j-backend/ansible/playbooks/app/vars.yml 2>/dev/null

# Check for any config files
find /home/ansible/services/dev -name "*.env" -o -name "*config*" 2>/dev/null
```

---

## Method 5: Check Environment from Process

If the backend is running as a process (not container):

```bash
# Find the process
ps aux | grep -i "gif-j\|node" | grep -v grep

# Get environment (replace PID with actual process ID)
cat /proc/PID/environ 2>/dev/null | tr '\0' '\n' | grep -E "AWS|GIPHY|RECAPTCHA|MAIL"
```

---

## Method 6: Quick All-in-One Check

Run this to check multiple places:

```bash
echo "=== Checking Docker Containers ==="
docker ps | grep gif-j-backend

echo -e "\n=== Container Environment Variables ==="
CONTAINER=$(docker ps -q --filter "name=gif-j-backend-dev")
if [ ! -z "$CONTAINER" ]; then
  docker inspect $CONTAINER | grep -A 100 "Env" | \
    grep -E "AWS_ACCESS_KEY_ID|AWS_SECRET|GIPHY|RECAPTCHA|MAIL_USER|MAIL_PASSWORD" | \
    sed 's/.*"//' | sed 's/".*//' | sed 's/=/\n/'
fi

echo -e "\n=== Docker Compose Environment ==="
cat /home/ansible/services/dev/gif-j-backend/docker-compose.yml 2>/dev/null | \
  grep -A 50 "environment:" | \
  grep -E "AWS|GIPHY|RECAPTCHA|MAIL"

echo -e "\n=== .env Files ==="
find /home/ansible/services -name ".env" 2>/dev/null | while read file; do
  echo "File: $file"
  grep -E "AWS|GIPHY|RECAPTCHA|MAIL" "$file" 2>/dev/null
done
```

---

## What to Look For

When you run these commands, look for values like:

- `AWS_ACCESS_KEY_ID=...`
- `AWS_SECRET_ACCESS_KEY=...`
- `GIPHY_API_KEY=...`
- `GOOGLE_RECAPTCHA_SECRET_KEY=...`
- `MAIL_USER=...`
- `MAIL_PASSWORD=...`

These are the values you'll copy to GitHub secrets.

---

## If You Can't Find the Values

If the commands don't show the values (they might be masked or in a different format):

### Option 1: Check Your Local Files
You might have these values locally:
```powershell
# On your local machine
Get-Content C:\Projects\Gifalot\gif-j-backend\.env -ErrorAction SilentlyContinue | Select-String -Pattern "AWS|GIPHY|RECAPTCHA|MAIL"
```

### Option 2: Check Your Accounts
- **AWS/Contabo S3**: Log into your Contabo or AWS account to see credentials
- **Google reCAPTCHA**: Check Google Cloud Console
- **GIPHY**: Check your GIPHY account/dashboard
- **Email**: Use your email account credentials

### Option 3: Use Placeholders (Can Update Later)
You can add placeholder values now and update them later when you find the real ones.

---

## After Finding Values

Once you have the values, add them to GitHub secrets:

- `AWS_ACCESS_KEY_ID_DEV` = (your AWS access key)
- `AWS_SECRET_ACCESS_KEY_SECRET_DEV` = (your AWS secret key)
- `GIPHY_API_KEY_DEV` = (your GIPHY API key)
- `GOOGLE_RECAPTCHA_SECRET_KEY_DEV` = (your reCAPTCHA secret)
- `MAIL_USER_DEV` = (your email address)
- `MAIL_PASSWORD_DEV` = (your email password)

---

## Summary

✅ **Yes, reuse the same keys** - Test environment can use the same credentials  
✅ **Run the commands above** to find the values on the server  
✅ **Copy the values** to GitHub secrets  
✅ **If you can't find them** - Check your local files or account dashboards

Start with the "Quick All-in-One Check" command - it should show you the values!

