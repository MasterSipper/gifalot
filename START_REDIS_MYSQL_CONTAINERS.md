# Start Redis and MySQL Containers

## Problem
Redis and MySQL containers are not running. This happened because host networking broke the container dependencies.

## Solution: Start All Services

```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend

# Start all services (Redis, MySQL, and App)
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d

# Check all containers are running
docker ps

# Check logs
docker compose logs redis --tail 20
docker compose logs mysql --tail 20
```

## If Containers Still Don't Start

The issue might be that with host networking on the app, the other containers can't connect properly. 

### Option 1: Revert Host Networking (Recommended)

Remove `network_mode: "host"` from the app service and contact Simply support to whitelist Docker network IPs.

### Option 2: Keep Host Networking but Fix Dependencies

Ensure Redis and MySQL start before the app, and configure connections properly.

## Check Container Status

```bash
# See all containers (including stopped)
docker ps -a

# Check why containers stopped
docker logs <container-name>
```





