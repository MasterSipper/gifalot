# Fix Nginx Config - Static Files Still Serving HTML

## Problem
Nginx is serving HTML (581 bytes) instead of JavaScript (1.2M) for static file requests.

## Solution: Check and Fix Config

### Step 1: Check Current Config
```bash
cat /etc/nginx/sites-enabled/default
```

### Step 2: Verify Config Location
```bash
# Check if there are multiple config files
ls -la /etc/nginx/sites-enabled/
ls -la /etc/nginx/conf.d/
```

### Step 3: Check Main Nginx Config
```bash
# Check which config file is being used
grep "include" /etc/nginx/nginx.conf
```

### Step 4: Create Correct Config

The issue is likely that the `/static/` location block isn't matching, or there's a conflicting config. 

**Correct config should be:**
```nginx
server {
    listen 8080;
    server_name localhost;
    root /var/www/html;
    index index.html;

    # CRITICAL: Static files must come BEFORE the catch-all location
    location /static/ {
        alias /var/www/html/static/;
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Other static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/html;
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # React app - catch-all (must be LAST)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 5: Apply Config
```bash
# Backup
cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.backup

# Create new config
cat > /etc/nginx/sites-enabled/default << 'EOF'
server {
    listen 8080;
    server_name localhost;
    root /var/www/html;
    index index.html;

    location /static/ {
        alias /var/www/html/static/;
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        root /var/www/html;
        try_files $uri =404;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Test
nginx -t

# Reload
systemctl reload nginx
```

### Step 6: Verify
```bash
curl -I http://localhost:8080/static/js/main.3d8c4b7d.js
```

**Should show:**
- Content-Type: application/javascript
- Content-Length: ~1243857


