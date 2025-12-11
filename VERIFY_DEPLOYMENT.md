# Verify Frontend Deployment

## Problem
Build is successful, files are deployed, but changes not showing.

## Verification Steps

### Step 1: Verify Files Were Copied
```bash
# Check if new files are in /var/www/html
ls -lh /var/www/html/static/js/main.*.js

# Should show main.3d8c4b7d.js with recent timestamp
```

### Step 2: Check File Contents
```bash
# Verify version is in deployed file
grep -o "1\.0\.7" /var/www/html/static/js/main.*.js | head -1

# Verify sharing URL code
grep -o "window\.location\.origin" /var/www/html/static/js/main.*.js | head -1
```

### Step 3: Check Nginx/Traefik Caching
```bash
# Check if there's any caching configured
grep -i "cache\|expires" /etc/nginx/sites-enabled/default
grep -i "cache\|expires" /etc/nginx/nginx.conf
```

### Step 4: Restart Services
```bash
# Restart nginx
systemctl restart nginx

# Check Traefik (if using Docker)
docker ps | grep traefik
```

### Step 5: Test Direct Access
```bash
# Test if nginx serves the file directly
curl -I http://localhost:8080/static/js/main.3d8c4b7d.js

# Should return 200 OK with recent Last-Modified date
```

### Step 6: Check Browser Cache Headers
```bash
# Check what headers nginx sends
curl -v http://localhost:8080/static/js/main.3d8c4b7d.js 2>&1 | grep -i "cache\|expires\|last-modified"
```

## Common Issues

### Issue 1: Browser Cache
**Solution:** 
- Hard refresh: Ctrl+Shift+R
- Incognito window
- Clear browser cache completely

### Issue 2: Nginx Cache Headers
**Solution:** Add no-cache headers to nginx config:
```nginx
location /static/ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

### Issue 3: Traefik Caching
**Solution:** Check Traefik config for caching middleware

### Issue 4: Service Worker (if exists)
**Solution:** Unregister service worker in DevTools → Application → Service Workers

## Quick Diagnostic

```bash
# Check deployment
ls -lh /var/www/html/static/js/main.*.js && \
grep -o "1\.0\.7" /var/www/html/static/js/main.*.js | head -1 && \
curl -I http://localhost:8080/static/js/main.3d8c4b7d.js | head -5
```


