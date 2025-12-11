# Debug Nginx Start Failure

## Problem
Nginx fails to start after configuration change.

## Diagnosis

### Step 1: Check Error Details
```bash
systemctl status nginx.service
```

### Step 2: Check Nginx Error Log
```bash
tail -50 /var/log/nginx/error.log
```

### Step 3: Test Configuration
```bash
nginx -t
```

### Step 4: Check for Port Conflicts
```bash
ss -tlnp | grep :8080
```

## Common Issues

### Issue 1: Port 8080 Already in Use
**Solution:**
```bash
# Find what's using port 8080
ss -tlnp | grep :8080

# Kill the process or change nginx port
```

### Issue 2: Configuration Syntax Error
**Solution:**
```bash
# Test config
nginx -t

# If error, check the config file
cat /etc/nginx/sites-enabled/default
```

### Issue 3: Missing Directory
**Solution:**
```bash
# Check if /var/www/html exists
ls -la /var/www/html

# Create if missing
mkdir -p /var/www/html
```

### Issue 4: Permission Issues
**Solution:**
```bash
# Check nginx user
grep "user" /etc/nginx/nginx.conf

# Check directory permissions
ls -la /var/www/html
```

## Quick Check

```bash
systemctl status nginx.service && \
tail -20 /var/log/nginx/error.log && \
nginx -t && \
ss -tlnp | grep :8080
```



