# Fix Port 3333 and Redis Connection Issues

## Problems
1. Port 3333 is already in use (another backend container running)
2. Redis connection reset error

## Solution

### Step 1: Find What's Using Port 3333
**Command:**
```bash
docker ps -a | grep app
```

**Expected Result:**
- Lists all app containers
- Shows which one is using port 3333

**Or check port directly:**
```bash
ss -tlnp | grep 3333
```

**Expected Result:**
- Shows what process/container is using port 3333

### Step 2: Stop All Old Backend Containers
**Find and stop all old app containers:**

**Command:**
```bash
docker ps -a --filter "name=app" --format "{{.ID}} {{.Names}} {{.Status}}"
```

**Stop all old app containers:**
```bash
docker ps -a --filter "name=services-gif-j-backend-dev-app" --format "{{.ID}}" | xargs -r docker stop
docker ps -a --filter "name=services-gif-j-backend-dev-app" --format "{{.ID}}" | xargs -r docker rm
```

**Or manually:**
```bash
docker stop <container-id>
docker rm <container-id>
```

**Expected Result:**
- Old app containers stopped and removed
- Port 3333 is now free

### Step 3: Verify Ports are Free
**Command:**
```bash
ss -tlnp | grep -E "(3333|6379|3306)"
```

**Expected Result:**
- No output (all ports are free)
- Or only shows your new containers after starting

### Step 4: Stop Current Containers and Start Fresh
**Command:**
```bash
docker compose down
docker compose up -d
```

**Expected Result:**
- All containers start successfully
- No port conflicts

### Step 5: Check Container Status
**Command:**
```bash
docker compose ps
```

**Expected Result:**
- All containers show as "Up"
- No errors

### Step 6: Check Logs
**App logs:**
```bash
docker compose logs app --tail 50
```

**Expected Result:**
- App starts successfully
- No "EADDRINUSE" errors
- No Redis connection errors

**Redis logs:**
```bash
docker compose logs redis --tail 20
```

**Expected Result:**
- Redis is running
- Ready to accept connections

**If Redis connection still fails, check network:**
```bash
docker compose logs app | grep -i redis
```

### Step 7: Verify Network Connectivity
**Test if app can reach Redis:**
```bash
docker compose exec app ping -c 2 redis
```

**Expected Result:**
- Pings successful
- Network is working

## Quick Fix (All-in-One)

```bash
# Stop everything
docker compose down

# Stop all old containers
docker ps -a --filter "name=services-gif-j-backend-dev" --format "{{.ID}}" | xargs -r docker stop
docker ps -a --filter "name=services-gif-j-backend-dev" --format "{{.ID}}" | xargs -r docker rm

# Start fresh
docker compose up -d

# Check status
docker compose ps
docker compose logs app --tail 30
```


