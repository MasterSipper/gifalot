# Fix Nginx Port Configuration

## Problem
Nginx is trying to bind to port 80, but Traefik is already using it.

## Solution: Configure Nginx to Listen on Port 8080

### Step 1: Check Current Nginx Config
```bash
cat /etc/nginx/sites-enabled/default
# or
cat /etc/nginx/nginx.conf
```

### Step 2: Edit Nginx Config to Use Port 8080
```bash
# Edit the default site config
nano /etc/nginx/sites-enabled/default
```

**Change:**
```nginx
listen 80;
```

**To:**
```nginx
listen 8080;
```

**Or if using nginx.conf, find:**
```nginx
server {
    listen 80;
    ...
}
```

**Change to:**
```nginx
server {
    listen 8080;
    ...
}
```

### Step 3: Test Nginx Config
```bash
nginx -t
```

**Expected Result:**
- Configuration test is successful

### Step 4: Start Nginx
```bash
systemctl start nginx
```

### Step 5: Verify Nginx is Running
```bash
systemctl status nginx
ss -tlnp | grep :8080
```

**Expected Result:**
- Nginx is running
- Listening on port 8080

### Step 6: Check Traefik Configuration

Traefik should route to Nginx on port 8080. Check Traefik dynamic config:

```bash
# Check Traefik dynamic config directory
ls -la /home/ansible/infrastructure/traefik/dynamic/

# Look for frontend config
cat /home/ansible/infrastructure/traefik/dynamic/frontend-dev.yml
# or similar file
```

**Traefik should have something like:**
```yaml
http:
  routers:
    frontend-dev:
      rule: "Host(`dev.gifalot.com`)"
      service: frontend-dev
  services:
    frontend-dev:
      loadBalancer:
        servers:
          - url: "http://localhost:8080"
```

## Quick Fix

```bash
# Edit nginx config
sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/sites-enabled/default

# Or if using nginx.conf
sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/nginx.conf

# Test config
nginx -t

# Start nginx
systemctl start nginx

# Verify
systemctl status nginx
```

## Alternative: Traefik Serves Files Directly

If Traefik is configured to serve static files directly from `/var/www/html`, you might not need Nginx at all. Check Traefik config to see if it has a file server configured.


