# Start Nginx

## Problem
Nginx is not active, so it can't be reloaded.

## Solution: Start Nginx

```bash
systemctl start nginx
```

## Verify

```bash
# Check status
systemctl status nginx

# Check if listening on port 8080
ss -tlnp | grep :8080

# Test static file serving
curl -I http://localhost:8080/static/js/main.3d8c4b7d.js
```

**Expected Result:**
- Nginx is active and running
- Listening on port 8080
- Static files are served correctly (not HTML)


