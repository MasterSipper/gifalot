# Check What's Using Port 80 on Server

## Run these commands on your server:

```bash
# 1. Check if any Docker containers are using port 80
docker ps --filter "publish=80"

# 2. Check what process is using port 80 (most reliable)
sudo netstat -tlnp | grep :80
# OR
sudo ss -tlnp | grep :80
# OR
sudo lsof -i :80

# 3. Check all containers (running and stopped)
docker ps -a | grep traefik

# 4. Stop all Traefik containers manually
docker ps -a | grep traefik | awk '{print $1}' | xargs -r docker stop
docker ps -a | grep traefik | awk '{print $1}' | xargs -r docker rm -f

# 5. If it's a system service (nginx, apache), stop it:
# For nginx:
sudo systemctl stop nginx
# For apache:
sudo systemctl stop apache2

# 6. After stopping, verify port 80 is free:
sudo netstat -tlnp | grep :80
# Should return nothing if port is free
```

## Quick Fix - Stop Everything Using Port 80:

```bash
# Find and kill whatever is using port 80
sudo fuser -k 80/tcp

# Or find the PID and kill it:
sudo lsof -ti:80 | xargs sudo kill -9
```

## After freeing port 80:

Once port 80 is free, the GitHub Actions deployment should work. The playbook will then be able to start Traefik on port 80.

