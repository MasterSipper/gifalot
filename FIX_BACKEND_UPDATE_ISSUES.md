# Fix Backend Update Issues

## Problem
1. Git merge conflict with local `docker-compose.yml` changes
2. `docker-compose` command broken due to Python/OpenSSL library issue

## Solution

### Step 1: Stash Local Changes
**Command:**
```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend
git stash
```

**Expected Result:**
- Local changes to `docker-compose.yml` are saved temporarily
- Working directory is clean

### Step 2: Pull Latest Changes
**Command:**
```bash
git pull origin dev
```

**Expected Result:**
- Updates downloaded successfully
- No merge conflicts

### Step 3: Use Docker Compose V2 (Avoids Python Issue)
**Instead of `docker-compose`, use `docker compose` (note: no hyphen)**

**Stop containers:**
```bash
docker compose down
```

**Expected Result:**
- Containers stopped successfully
- No Python errors

**Rebuild without cache:**
```bash
docker compose build --no-cache
```

**Expected Result:**
- Build starts
- May take several minutes
- No Python errors

**Start containers:**
```bash
docker compose up -d
```

**Expected Result:**
- Containers start in background
- No Python errors

### Step 4: Verify Backend is Running
**Command:**
```bash
docker compose ps
```

**Expected Result:**
- All containers show as "Up" or "running"
- App container is healthy

**Check logs:**
```bash
docker compose logs app --tail 50
```

**Expected Result:**
- No errors in logs
- Application started successfully

### Step 5: (Optional) Restore Local Changes
If you had important local changes to `docker-compose.yml` that you want to keep:

**Command:**
```bash
git stash pop
```

**Expected Result:**
- Your local changes are restored
- You may need to resolve conflicts if the file changed in the remote

**Note:** Only do this if you had intentional local changes. Otherwise, the pulled version should be correct.

## Alternative: Fix docker-compose (if needed)

If `docker compose` (v2) is not available, you can try fixing the Python issue:

```bash
pip3 install --upgrade pyopenssl cryptography
```

But using `docker compose` (v2) is the recommended solution as it doesn't depend on Python.



