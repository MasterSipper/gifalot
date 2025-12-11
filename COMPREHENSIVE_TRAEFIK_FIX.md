# Comprehensive Traefik Fix

## Current Problems

1. **Port 443 conflict** - Another Traefik instance or old container still running
2. **Container name mismatch** - `infrastructure-traefik_traefik_1` vs `traefik-traefik-1`
3. **File provider not loaded** - Container wasn't recreated with new config
4. **Docker provider still trying to discover backend** - Even with `traefik.enable=false`

## Step 1: Find All Traefik Containers

```bash
# Find all Traefik containers
docker ps -a | grep traefik

# Find what's using port 443
netstat -tlnp | grep :443
# Or
ss -tlnp | grep :443
```

## Step 2: Stop All Traefik Containers

```bash
# Stop all Traefik containers
docker ps | grep traefik | awk '{print $1}' | xargs docker stop

# Or stop by name
docker stop infrastructure-traefik_traefik_1 traefik-traefik-1 2>/dev/null

# Remove them
docker ps -a | grep traefik | awk '{print $1}' | xargs docker rm
```

## Step 3: Verify Backend Has traefik.enable=false

```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend

# Check if backend has the label
docker inspect services-gif-j-backend-dev-app-1 | grep -i "traefik.enable"

# If not, rebuild
git pull origin dev
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app
```

## Step 4: Verify File Provider Config

```bash
cd /home/ansible/infrastructure/traefik

# Check docker-compose.yml has file provider
grep -A 5 "providers.file" docker-compose.yml

# Check dynamic config file exists
cat /etc/traefik/dynamic/backend-dev.yml
```

## Step 5: Start Traefik with Correct Project Name

```bash
cd /home/ansible/infrastructure/traefik

# Check what project name is used
docker compose config | grep "name:"

# Start with explicit project name if needed
COMPOSE_PROJECT_NAME=infrastructure-traefik docker compose up -d

# Or just
docker compose up -d
```

## Step 6: Verify File Provider is Loaded

```bash
# Check container command
docker ps | grep traefik
docker inspect $(docker ps | grep traefik | awk '{print $1}') | grep -A 30 "Cmd" | grep "file"

# Check logs
docker logs $(docker ps | grep traefik | awk '{print $1}') --tail 30
```

Should see messages about loading dynamic config.

## Step 7: Test Route

```bash
curl -I https://dev.gifalot.com/gif-j/
curl -X OPTIONS https://dev.gifalot.com/gif-j/auth/login \
  -H "Origin: https://gifalot.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## Alternative: Simplify - Use Only File Provider

If Docker provider keeps causing issues, we could:
1. Disable Docker provider entirely (only use file provider)
2. Or configure Docker provider to ignore containers with `traefik.enable=false`

But the file provider should work once the container is properly recreated.





