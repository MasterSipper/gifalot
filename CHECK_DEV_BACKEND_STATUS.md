# Check Dev Backend Status - Fix 502 Error

## Step 1: Check if Dev Backend Container is Running

```bash
# SSH to your server, then run:
docker ps | grep gif-j-backend-dev
```

**Expected**: Should show a container with status "Up" (not "Restarting" or "Exited")

## Step 2: Check Backend Logs for Errors

```bash
# Find the container name first:
docker ps | grep gif-j-backend-dev-app

# Then check logs (replace CONTAINER_NAME with actual name):
docker logs CONTAINER_NAME --tail 50

# Or if using the project name:
docker logs services-gif-j-backend-dev-app-1 --tail 50
```

**Look for**:
- Database connection errors
- Redis connection errors
- JWT secret errors
- Any crash/exception messages

## Step 3: Test Backend Directly (bypass Traefik)

```bash
# Test if backend is responding on port 3333:
curl -I http://localhost:3333/

# Should return HTTP 200, 404, or 401 (not Connection refused)
```

## Step 4: Check Traefik Routing

```bash
# Check if Traefik can reach the backend:
curl -I http://localhost:3333/gif-j/collection

# Should return 401 (Unauthorized) if backend is working, not 502
```

## Step 5: Check Traefik Logs

```bash
# Check Traefik logs for routing issues:
docker logs traefik --tail 50 | grep -i "backend\|502\|error"
```

## Step 6: Restart Dev Backend if Needed

If the container is restarting or not responding:

```bash
cd /home/ansible/services/dev/gif-j-backend
docker-compose restart app

# Or if that doesn't work:
docker-compose down
docker-compose up -d
```

## Common Issues:

1. **Backend crashed**: Check logs for database/Redis connection errors
2. **Port conflict**: Another service might be using port 3333
3. **Traefik routing**: Traefik might not be routing `/gif-j/collection` correctly
4. **JWT authentication**: Backend might be crashing when processing JWT tokens

## Quick Fix:

If backend is down, restart it:

```bash
cd /home/ansible/services/dev/gif-j-backend
docker-compose restart
```

Then check logs again to see if it starts successfully.
