# Restart Nginx Properly

## Problem
Nginx processes are running but systemd thinks it's not active.

## Solution: Clean Restart

### Step 1: Kill All Nginx Processes
```bash
pkill -9 nginx
```

### Step 2: Verify They're Gone
```bash
ps aux | grep nginx | grep -v grep
ss -tlnp | grep :8080
```

**Should return nothing**

### Step 3: Clean Up PID Files (if any)
```bash
rm -f /var/run/nginx.pid
rm -f /var/run/nginx/nginx.pid
```

### Step 4: Start Nginx via Systemd
```bash
systemctl start nginx
```

### Step 5: Verify
```bash
systemctl status nginx
ss -tlnp | grep :8080
```

**Expected Result:**
- Nginx is active and running
- Listening on port 8080
- Multiple worker processes (normal)

## Quick Fix

```bash
pkill -9 nginx && \
sleep 1 && \
rm -f /var/run/nginx.pid /var/run/nginx/nginx.pid && \
systemctl start nginx && \
systemctl status nginx
```


