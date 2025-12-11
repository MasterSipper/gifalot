# Stop Redis Container to Fix Port Conflict

## Problem
The test environment Redis container can't start because port 6379 is already allocated (likely by dev environment).

## Solution: Stop Dev Redis Container

**On your server, run:**

```bash
# Check what Redis containers are running
docker ps | grep redis

# Stop and remove dev Redis container
docker stop services-gif-j-backend-dev-redis-1 2>/dev/null
docker rm services-gif-j-backend-dev-redis-1 2>/dev/null

# Or stop all Redis containers
docker stop $(docker ps -q --filter "name=redis") 2>/dev/null
docker rm $(docker ps -q --filter "name=redis") 2>/dev/null

# Verify port is free
sudo netstat -tlnp | grep 6379
```

## After Stopping Container

Re-run the workflow and the backend deployment should succeed.

