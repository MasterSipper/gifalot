# Fix MySQL Port 3306 Conflict

## Problem
Port 3306 is already allocated, preventing the new MySQL container from starting.

## Solution

### Step 1: Find What's Using Port 3306
**Command:**
```bash
docker ps -a | grep mysql
```

**Expected Result:**
- Lists all MySQL containers (running or stopped)
- Shows container IDs and names

**Alternative - Check port directly:**
```bash
ss -tlnp | grep 3306
```

**Expected Result:**
- Shows what process is using port 3306
- May show a Docker container ID

### Step 2: Stop Old MySQL Container
**If you see an old MySQL container, stop and remove it:**

**Command:**
```bash
docker stop <container-id-or-name>
docker rm <container-id-or-name>
```

**Example:**
```bash
docker stop gif-j-backend-mysql-1
docker rm gif-j-backend-mysql-1
```

**Or stop all old containers:**
```bash
docker ps -a --filter "name=mysql" --format "{{.ID}}" | xargs -r docker stop
docker ps -a --filter "name=mysql" --format "{{.ID}}" | xargs -r docker rm
```

**Expected Result:**
- Old container stopped and removed
- Port 3306 is now free

### Step 3: Check for Other Services Using Port 3306
**If no Docker container is using it, check for system MySQL:**

**Command:**
```bash
systemctl status mysql
```

**If MySQL service is running:**
```bash
systemctl stop mysql
systemctl disable mysql  # Optional: prevent it from starting on boot
```

**Expected Result:**
- System MySQL service stopped
- Port 3306 is now free

### Step 4: Verify Port is Free
**Command:**
```bash
ss -tlnp | grep 3306
```

**Expected Result:**
- No output (port is free)
- Or shows only the new container after starting

### Step 5: Start Docker Compose Services
**Command:**
```bash
docker compose up -d
```

**Expected Result:**
- All containers start successfully
- No port conflict errors

### Step 6: Verify All Containers are Running
**Command:**
```bash
docker compose ps
```

**Expected Result:**
- All containers show as "Up"
- MySQL, Redis, and App containers are running

**Check logs:**
```bash
docker compose logs app --tail 50
docker compose logs mysql --tail 20
```

**Expected Result:**
- App logs show successful startup
- MySQL logs show database ready

## Quick One-Liner Solution

If you just want to stop all old containers and restart:

```bash
docker compose down && docker compose up -d
```

This will:
1. Stop and remove all containers from the current docker-compose.yml
2. Start fresh containers
3. Should resolve the port conflict


