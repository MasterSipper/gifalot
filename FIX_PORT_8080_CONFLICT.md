# Fix Port 8080 Conflict

## Problem
Port 8080 is already in use, preventing Nginx from starting.

## Solution

### Step 1: Find What's Using Port 8080
```bash
ss -tlnp | grep :8080
```

### Step 2: Check for Zombie Nginx Processes
```bash
ps aux | grep nginx
```

### Step 3: Kill Processes Using Port 8080

**Option A: If it's a zombie nginx process**
```bash
# Find nginx processes
ps aux | grep nginx | grep -v grep

# Kill all nginx processes
pkill -9 nginx

# Or kill specific PID
kill -9 <PID>
```

**Option B: If it's another service**
```bash
# Find the process
lsof -i :8080

# Kill it
kill -9 <PID>
```

### Step 4: Verify Port is Free
```bash
ss -tlnp | grep :8080
```

**Should return nothing (port is free)**

### Step 5: Start Nginx
```bash
systemctl start nginx
```

## Quick Fix

```bash
# Find and kill processes on port 8080
lsof -ti :8080 | xargs kill -9

# Or if lsof not available
fuser -k 8080/tcp

# Verify port is free
ss -tlnp | grep :8080

# Start nginx
systemctl start nginx

# Verify
systemctl status nginx
```



