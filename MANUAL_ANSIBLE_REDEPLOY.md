# Manual Ansible Redeploy for Test Environment

## Step 1: Stop and Remove Old Containers

```bash
# Stop test backend containers
docker stop services-gif-j-backend-test-app-1 services-gif-j-backend-test-app-2 2>/dev/null
docker rm services-gif-j-backend-test-app-1 services-gif-j-backend-test-app-2 2>/dev/null

# Optionally stop MySQL and Redis too if you want to recreate everything
# docker stop services-gif-j-backend-test-mysql-1 services-gif-j-backend-test-redis-1
# docker rm services-gif-j-backend-test-mysql-1 services-gif-j-backend-test-redis-1
```

## Step 2: Recreate the Traefik Network (if it was deleted)

```bash
# Recreate the infrastructure-traefik network
docker network create infrastructure-traefik
```

## Step 3: Run Ansible Playbook Locally

From your local machine (Windows), you can run the Ansible playbook. First, ensure you have the latest code:

```powershell
# On Windows (PowerShell)
cd C:\Projects\Gifalot

# Make sure you're on the test-deployment branch with the latest changes
git pull origin test-deployment

# Install ansible if not already installed (via WSL or use GitHub Actions)
# Or run the playbook using the same action that GitHub Actions uses
```

## Step 4: Alternative - Use SSH to Run Ansible from Server

If you have Ansible installed on the server, you can run it directly:

```bash
# SSH to the server
# Then run ansible-playbook with the correct variables

cd /path/to/your/repo  # Or clone it fresh
git pull origin test-deployment

# Set up the inventory
cat > /tmp/inventory <<EOF
[dev_infrastructure]
vps1   ansible_host=localhost   ansible_port=22   ansible_user=ansible
EOF

# Run the playbook (you'll need to provide all the secrets)
# This is complex, so it's better to trigger GitHub Actions instead
```

## Step 5: Easiest Option - Trigger GitHub Actions

The easiest way is to trigger GitHub Actions to redeploy:

1. Go to GitHub Actions in your repository
2. Find the "Deploy TEST" workflow
3. Click "Run workflow" and select the `test-deployment` branch
4. Or make a small commit to trigger it:

```powershell
# On Windows
cd C:\Projects\Gifalot
git checkout test-deployment
# Make a tiny change
echo "# Redeploy trigger" >> .deploy-trigger
git add .deploy-trigger
git commit -m "Trigger redeploy"
git push origin test-deployment
```

## Step 6: After Deployment, Verify

```bash
# Check containers are running
docker ps | grep test

# Check environment variables
docker exec services-gif-j-backend-test-app-1 env | grep -E "REDIS_HOST|MYSQL_USER|PORT"

# Should show:
# REDIS_HOST=localhost
# MYSQL_USER=<should have value>
# PORT=3334

# Check if backend is listening
curl -I http://localhost:3334/

# Check logs
docker logs services-gif-j-backend-test-app-1 --tail 30
```


