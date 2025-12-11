# Fix Nginx to Listen on Port 8080

## Current Situation
- ✅ Traefik routes frontend to `http://localhost:8080`
- ❌ Nginx is trying to listen on port 80 (conflict with Traefik)
- ✅ Nginx config syntax is OK

## Solution: Change Nginx to Listen on Port 8080

### Step 1: Check Current Nginx Config
```bash
grep -n "listen" /etc/nginx/sites-enabled/default
# or
grep -n "listen" /etc/nginx/nginx.conf
```

### Step 2: Edit Nginx Config
```bash
nano /etc/nginx/sites-enabled/default
```

**Find:**
```nginx
listen 80;
```

**Change to:**
```nginx
listen 8080;
```

**Or use sed:**
```bash
sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/sites-enabled/default
sed -i 's/listen \[::\]:80;/listen [::]:8080;/g' /etc/nginx/sites-enabled/default
```

### Step 3: Test Config
```bash
nginx -t
```

### Step 4: Start Nginx
```bash
systemctl start nginx
```

### Step 5: Verify
```bash
systemctl status nginx
ss -tlnp | grep :8080
```

**Expected Result:**
- Nginx is running
- Listening on port 8080
- Traefik can route to it

## Quick One-Liner

```bash
sed -i 's/listen 80;/listen 8080;/g' /etc/nginx/sites-enabled/default && \
sed -i 's/listen \[::\]:80;/listen [::]:8080;/g' /etc/nginx/sites-enabled/default && \
nginx -t && \
systemctl start nginx && \
systemctl status nginx
```


