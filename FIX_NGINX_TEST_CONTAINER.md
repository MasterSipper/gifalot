# Fix Nginx Test Container - Restarting Issue

## Problem

The `gifalot-frontend-test` container is restarting because the nginx configuration we created has an issue.

## Solution

Let's fix this by stopping the container, creating a proper nginx config file on the host, and restarting with the correct configuration.

---

## Step 1: Stop and Remove the Problematic Container

```bash
# Stop the container
docker stop gifalot-frontend-test

# Remove it
docker rm gifalot-frontend-test
```

---

## Step 2: Create Nginx Config File on Host

```bash
# Create nginx config directory
mkdir -p /etc/nginx/test-frontend

# Create nginx config file
cat > /etc/nginx/test-frontend/default.conf << 'EOF'
server {
    listen 8081;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Verify the file was created
cat /etc/nginx/test-frontend/default.conf
```

---

## Step 3: Recreate Container with Proper Config

```bash
# Create container with nginx config mounted
docker run -d \
  --name gifalot-frontend-test \
  --network host \
  -v /var/www/gifalot-frontend-test:/usr/share/nginx/html:ro \
  -v /etc/nginx/test-frontend/default.conf:/etc/nginx/conf.d/default.conf:ro \
  --restart always \
  nginx:alpine

# Wait a moment for container to start
sleep 2

# Verify container is running (not restarting)
docker ps | grep gifalot-frontend-test
```

**Expected output:**
- Container should show "Up" status (not "Restarting")

---

## Step 4: Test Nginx

```bash
# Test nginx is serving on port 8081
curl http://localhost:8081/ 2>/dev/null | head -5

# Check nginx logs if needed
docker logs gifalot-frontend-test
```

**Expected output:**
- Should see HTML content or 404 (that's OK - we'll deploy files later)
- No errors in logs

---

## Alternative: Simpler Approach (If Above Doesn't Work)

If the mounted config still causes issues, use this simpler approach:

```bash
# Stop and remove
docker stop gifalot-frontend-test
docker rm gifalot-frontend-test

# Create container with default nginx (port 80)
docker run -d \
  --name gifalot-frontend-test \
  --network host \
  -v /var/www/gifalot-frontend-test:/usr/share/nginx/html:ro \
  --restart always \
  nginx:alpine

# Wait for container to start
sleep 2

# Create custom config inside container (simpler method)
docker exec -i gifalot-frontend-test sh << 'SCRIPT'
cat > /etc/nginx/conf.d/custom.conf << 'NGINXCONF'
server {
    listen 8081;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINXCONF

# Test nginx config
nginx -t

# If test passes, reload
if [ $? -eq 0 ]; then
    nginx -s reload
    echo "Nginx reloaded successfully"
else
    echo "Nginx config test failed - check the config"
fi
SCRIPT
```

---

## Verify Everything Works

```bash
# Check container status
docker ps | grep gifalot-frontend-test

# Should show: "Up" (not "Restarting")

# Test nginx
curl -I http://localhost:8081/

# Should return: HTTP/1.1 200 OK or 404 (both are OK)
```

---

## If Container Still Restarts

Check the logs to see what's wrong:

```bash
# Check logs
docker logs gifalot-frontend-test

# Look for nginx errors
docker logs gifalot-frontend-test 2>&1 | grep -i error
```

Common issues:
- **Port conflict**: Something else using port 8081? Check: `netstat -tuln | grep 8081`
- **Config syntax error**: Check the nginx config syntax
- **Permission issues**: Check file permissions

---

## Continue Setup

Once the container is running properly, continue with the Traefik configuration from `QUICK_START_TEST_ENV.md` Step 2.


