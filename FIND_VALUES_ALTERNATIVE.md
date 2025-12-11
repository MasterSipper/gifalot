# Find Values - Container Not Running

## Issue: Container Not Found

The container might not be running or has a different name. Let's check what's actually there.

---

## Step 1: See What Containers Are Running

```bash
# See ALL running containers
docker ps

# See ALL containers (including stopped)
docker ps -a

# Look for anything with "gif" or "backend" in the name
docker ps -a | grep -i "gif\|backend"
```

---

## Step 2: Check Docker Compose File (Easier!)

Since you're already in the directory, check the docker-compose.yml:

```bash
# You're already here, so just:
cat docker-compose.yml | grep -A 50 "environment:" | grep -E "AWS|GIPHY|RECAPTCHA|MAIL"
```

This will show the environment variables configured in docker-compose.

---

## Step 3: Check for .env Files

```bash
# Check current directory
ls -la .env* 2>/dev/null

# Check for .env file
cat .env 2>/dev/null | grep -E "AWS|GIPHY|RECAPTCHA|MAIL"

# Check parent directories
cat ../.env 2>/dev/null | grep -E "AWS|GIPHY|RECAPTCHA|MAIL"
```

---

## Step 4: Check Ansible Variables

```bash
# Check Ansible vars file
cat ansible/playbooks/app/vars.yml 2>/dev/null

# This might show some values (though secrets are usually passed via extra-vars)
```

---

## Step 5: Check What's Actually Deployed

```bash
# Go back to parent directory
cd ..

# See what's in the dev directory
ls -la

# Check if there are any config files
find . -name "*.env" -o -name "*config*" 2>/dev/null | head -10
```

---

## Most Likely: Check Docker Compose

Since you're in `/home/ansible/services/dev/gif-j-backend`, the easiest is:

```bash
# Show environment section of docker-compose
cat docker-compose.yml | grep -A 60 "environment:"
```

This will show all the environment variables, including the ones you need!

---

## Alternative: Check GitHub Actions Logs

If `deploy-dev.yml` has run successfully, the values are being passed from GitHub secrets. You can:

1. Go to GitHub → Actions
2. Find a successful "Deploy DEV" run
3. Look at the logs - they might show variable names (values are masked, but you can see what's being used)

---

## Quick Commands to Run Now

Run these in order:

```bash
# 1. See all containers
docker ps -a

# 2. Check docker-compose.yml (you're already in the right directory!)
cat docker-compose.yml | grep -A 60 "environment:"

# 3. Check for .env files
ls -la .env* ../.env* 2>/dev/null
cat .env 2>/dev/null
```

The docker-compose.yml file should have the environment variables you need!

