# Fix Dev Backend Down - Use Docker Compose v2

## Problem:
- Dev backend container doesn't exist
- `docker-compose` (v1) has Python/OpenSSL errors
- Need to use `docker compose` (v2) instead

## Step 1: Check What Containers Exist

```bash
# Check all containers (running and stopped)
docker ps -a | grep gif-j-backend-dev

# Check what's actually running
docker ps
```

## Step 2: Navigate to Dev Directory

```bash
cd /home/ansible/services/dev/gif-j-backend
ls -la
```

## Step 3: Use Docker Compose v2 (without hyphen)

```bash
# Check status
docker compose ps

# Start/restart services
docker compose up -d

# Or if you need to rebuild:
docker compose up -d --build
```

## Step 4: If Docker Compose v2 Not Available, Use Direct Docker Commands

```bash
# First, check if there's a docker-compose.yml file
cat docker-compose.yml

# Then manually start containers based on the compose file
# But it's better to use docker compose v2 or trigger a redeploy
```

## Step 5: Alternative - Trigger GitHub Actions Redeploy

Since the dev environment is managed by GitHub Actions, the easiest fix is to trigger a redeploy:

1. Go to GitHub Actions
2. Find the "Deploy DEV" workflow
3. Click "Run workflow" on the `main` branch

Or make a small commit to trigger it:

```bash
# On your local machine:
git checkout main
# Make a small change (like adding a comment)
git commit --allow-empty -m "Trigger dev redeploy"
git push origin main
```

## Step 6: Verify After Restart

```bash
# Check if container is running
docker ps | grep gif-j-backend-dev

# Check logs
docker logs $(docker ps -q --filter "name=gif-j-backend-dev-app") --tail 50

# Test backend
curl -I http://localhost:3333/
```

## Quick Fix Command:

```bash
cd /home/ansible/services/dev/gif-j-backend
docker compose up -d
```
