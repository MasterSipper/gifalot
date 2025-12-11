# Fix Nginx Config Conflict

## Problem
- Warning: conflicting server name "localhost" on port 8080
- Nginx processes running but systemd doesn't see it as active

## Solution

### Step 1: Find All Config Files
```bash
# Check all nginx config files
grep -r "listen 8080" /etc/nginx/
grep -r "server_name localhost" /etc/nginx/
```

### Step 2: Check for Multiple Server Blocks
```bash
# List all site configs
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/
```

### Step 3: Fix the Conflict

**Option A: Remove duplicate config**
```bash
# Find duplicate
grep -r "listen 8080" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/

# Remove or comment out the duplicate
```

**Option B: Change server_name to avoid conflict**
```bash
# Edit config to use different server_name
nano /etc/nginx/sites-enabled/default

# Change:
# server_name localhost;
# To:
# server_name _;
```

### Step 4: Stop and Restart Nginx Properly
```bash
# Kill all nginx processes
pkill -9 nginx

# Clean up
rm -f /var/run/nginx.pid /var/run/nginx/nginx.pid

# Start via systemd
systemctl start nginx

# Verify
systemctl status nginx
```

## Quick Fix

```bash
# Find conflicts
grep -r "listen 8080" /etc/nginx/sites-enabled/ /etc/nginx/conf.d/

# Fix server_name in default config
sed -i 's/server_name localhost;/server_name _;/g' /etc/nginx/sites-enabled/default

# Test
nginx -t

# Kill and restart
pkill -9 nginx && \
rm -f /var/run/nginx.pid /var/run/nginx/nginx.pid && \
systemctl start nginx && \
systemctl status nginx
```



