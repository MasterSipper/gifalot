# Fix Nginx Static File Serving

## Problem
Nginx is serving HTML (index.html) instead of JavaScript files for `/static/js/main.*.js` requests.

## Solution: Fix Nginx Configuration

### Step 1: Check Current Nginx Config
```bash
cat /etc/nginx/sites-enabled/default
```

### Step 2: Fix Nginx Config

The config should serve static files directly, and only fall back to index.html for React routes.

```bash
nano /etc/nginx/sites-enabled/default
```

**Correct Configuration:**
```nginx
server {
    listen 8080;
    server_name localhost;
    root /var/www/html;
    index index.html;

    # Serve static files directly
    location /static/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve other static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # React app - fall back to index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 3: Test and Reload
```bash
nginx -t
systemctl reload nginx
```

### Step 4: Verify
```bash
# Should return JavaScript (large file)
curl -I http://localhost:8080/static/js/main.3d8c4b7d.js

# Should show Content-Type: application/javascript (or similar)
# Should show Content-Length: ~1243857 (1.2M)
```

## Quick Fix Script

```bash
cat > /tmp/nginx-fix.conf << 'EOF'
server {
    listen 8080;
    server_name localhost;
    root /var/www/html;
    index index.html;

    # Serve static files directly
    location /static/ {
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Serve other static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }

    # React app - fall back to index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Backup current config
cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup

# Apply new config
cp /tmp/nginx-fix.conf /etc/nginx/sites-enabled/default

# Test and reload
nginx -t && systemctl reload nginx
```



