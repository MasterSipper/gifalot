# Fix Nginx Restart Failure

## Problem
Nginx failed to restart - likely a configuration error.

## Diagnosis

### Step 1: Check Nginx Status
```bash
systemctl status nginx.service
```

**Expected Result:**
- Shows error message
- Indicates what's wrong

### Step 2: Check Nginx Configuration
```bash
# Test nginx configuration
nginx -t

# Or
nginx -T
```

**Expected Result:**
- Shows configuration errors
- Points to problematic file/line

### Step 3: Check Nginx Logs
```bash
journalctl -xe | tail -50
```

**Or:**
```bash
tail -50 /var/log/nginx/error.log
```

## Common Issues

### Issue 1: Syntax Error in Config
**Fix:**
```bash
# Find the error
nginx -t

# Edit the config file mentioned in error
nano /etc/nginx/sites-enabled/default
# or
nano /etc/nginx/nginx.conf

# Fix the syntax error
# Test again
nginx -t

# If OK, restart
systemctl start nginx
```

### Issue 2: Port Already in Use
**Fix:**
```bash
# Check what's using port 80/443
ss -tlnp | grep -E "(80|443)"

# Stop conflicting service or change nginx port
```

### Issue 3: Missing Directory
**Fix:**
```bash
# Check if /var/www/html exists
ls -la /var/www/html

# Create if missing
mkdir -p /var/www/html
chown -R www-data:www-data /var/www/html
```

## Quick Fix

```bash
# Test config
nginx -t

# If config is OK but service won't start, try:
systemctl stop nginx
systemctl start nginx

# Or reload instead of restart
nginx -s reload
```

## Alternative: Reload Instead of Restart

If restart fails but config is valid:
```bash
# Just reload the config (doesn't require full restart)
nginx -s reload
```

This is often safer and doesn't require stopping the service.



