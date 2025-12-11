# Get Deployment Values from Server

## Commands to Run on Server

SSH into your server and run these commands to find the values for GitHub secrets:

```bash
ssh root@38.242.204.63
```

---

## 1. Check Ansible Configuration

```bash
# Check Ansible inventory/hosts file
cat /home/ansible/infrastructure/traefik/dynamic/*.yml 2>/dev/null | head -20

# Check if there are any .env files in the deployment directories
find /home/ansible/services -name "*.env" -o -name ".env" 2>/dev/null

# Check the deployed application directory
ls -la /home/ansible/services/dev/gif-j-backend/ 2>/dev/null
```

---

## 2. Check Docker Container Environment Variables

```bash
# Check backend container environment (if running)
docker ps | grep gif-j-backend-dev

# Get environment variables from running container
docker inspect $(docker ps -q --filter "name=gif-j-backend-dev") 2>/dev/null | grep -A 50 "Env"

# OR if you know the container name exactly:
docker inspect services-gif-j-backend-dev_app_1 2>/dev/null | grep -A 50 "Env"
```

---

## 3. Check Ansible Playbook Variables

```bash
# Check Ansible vars file
cat /home/ansible/services/dev/gif-j-backend/ansible/playbooks/app/vars.yml 2>/dev/null

# Check if there's a local vars file
find /home/ansible -name "vars.yml" -o -name "*.yml" | grep -E "vars|config" | head -10
```

---

## 4. Check Environment Files in Repository (if cloned on server)

```bash
# Check if repository is cloned on server
ls -la /home/ansible/services/dev/gif-j-backend/.env* 2>/dev/null

# Check for env template
cat /home/ansible/services/dev/gif-j-backend/env.template 2>/dev/null

# Check docker-compose environment
cat /home/ansible/services/dev/gif-j-backend/docker-compose.yml 2>/dev/null | grep -A 30 "environment:"
```

---

## 5. Check Running Processes Environment

```bash
# If backend is running as a process (not container)
ps aux | grep -i "gif-j\|node\|nest" | grep -v grep

# Check environment of running process
cat /proc/$(pgrep -f "gif-j-backend" | head -1)/environ 2>/dev/null | tr '\0' '\n' | grep -E "AWS|POSTGRES|REDIS|JWT|MAIL|GIPHY|RECAPTCHA"
```

---

## 6. Check System Environment Files

```bash
# Check common env file locations
cat /etc/environment 2>/dev/null
cat ~/.bashrc | grep -E "export.*DEV" 2>/dev/null
cat ~/.profile | grep -E "export.*DEV" 2>/dev/null

# Check if there's a deployment config
find /home/ansible -name "*config*" -o -name "*secret*" 2>/dev/null | head -10
```

---

## 7. Check GitHub Actions Workflow File (if repo is on server)

```bash
# If the repository is cloned on the server
cat /home/ansible/services/dev/gif-j-backend/.github/workflows/deploy-dev.yml 2>/dev/null

# OR if it's in a different location
find /home -name "deploy-dev.yml" 2>/dev/null
```

---

## 8. Most Useful: Check Docker Compose Environment

```bash
# Navigate to deployment directory
cd /home/ansible/services/dev/gif-j-backend/ 2>/dev/null

# Check docker-compose file for environment variables
cat docker-compose.yml | grep -A 40 "environment:" | grep -E "AWS|POSTGRES|REDIS|JWT|MAIL|GIPHY|RECAPTCHA|STAGE|PORT"

# Check if there's a .env file being used
ls -la .env* 2>/dev/null
cat .env 2>/dev/null
```

---

## 9. Check Ansible Extra Vars (from deployment logs)

```bash
# Check if there are any deployment logs
find /home/ansible -name "*.log" | grep -i deploy | head -5

# Check system logs for deployment info
journalctl -u docker 2>/dev/null | grep -i "gif-j-backend" | tail -20
```

---

## 10. Quick All-in-One Check

```bash
# Run this to check multiple places at once
echo "=== Checking Docker Containers ==="
docker ps | grep gif-j

echo -e "\n=== Checking Deployment Directory ==="
ls -la /home/ansible/services/dev/ 2>/dev/null

echo -e "\n=== Checking for .env files ==="
find /home/ansible/services -name ".env" -o -name "*.env" 2>/dev/null

echo -e "\n=== Checking docker-compose.yml ==="
cat /home/ansible/services/dev/gif-j-backend/docker-compose.yml 2>/dev/null | grep -A 30 "environment:"

echo -e "\n=== Checking Running Container Env ==="
docker inspect $(docker ps -q --filter "name=gif-j-backend-dev") 2>/dev/null | grep -A 50 "Env" | grep -E "AWS|POSTGRES|REDIS|JWT|MAIL|GIPHY|RECAPTCHA"
```

---

## Alternative: Check Your Local Machine

If the server doesn't have the values easily accessible, check your **local machine**:

```powershell
# On Windows (PowerShell)
cd C:\Projects\Gifalot

# View the deploy-dev.yml workflow file
Get-Content gif-j-backend\.github\workflows\deploy-dev.yml

# Check for local .env files
Get-ChildItem -Recurse -Filter ".env*" | Select-Object FullName
```

---

## What to Look For

When you run these commands, look for values like:
- `AWS_ACCESS_KEY_ID=...`
- `POSTGRES_PASSWORD=...`
- `REDIS_PASSWORD=...`
- `JWT_ACCESS_TOKEN_SECRET=...`
- `GIPHY_API_KEY=...`
- etc.

These are the values you'll need to add to GitHub secrets.

---

## Security Note

⚠️ **Be careful** - these commands may show sensitive information. Don't share the output publicly!

---

## Quick Start Command

Run this first to get an overview:

```bash
# Quick overview
cd /home/ansible/services/dev/gif-j-backend/ 2>/dev/null && \
echo "=== Docker Compose Environment ===" && \
cat docker-compose.yml 2>/dev/null | grep -A 40 "environment:" && \
echo -e "\n=== Running Container Environment ===" && \
docker inspect $(docker ps -q --filter "name=gif-j-backend-dev") 2>/dev/null | grep -A 50 "Env" | head -30
```

This will show you the environment variables being used, which you can then copy to GitHub secrets.


