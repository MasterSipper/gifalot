# Quick Start - Test Environment Setup

## TL;DR - Fast Setup

**Time**: ~10 minutes  
**Risk**: Zero - completely isolated from dev.gifalot.com

---

## Step 1: Server Setup (SSH into server)

```bash
ssh root@38.242.204.63

# Create frontend directory
mkdir -p /var/www/gifalot-frontend-test
chmod -R 755 /var/www/gifalot-frontend-test

# Create Nginx container
docker run -d \
  --name gifalot-frontend-test \
  --network host \
  -v /var/www/gifalot-frontend-test:/usr/share/nginx/html:ro \
  --restart always \
  nginx:alpine

# Configure Nginx for port 8081 (FIXED VERSION)
# First, wait for container to be fully running
sleep 3

# Create nginx config file on host
mkdir -p /etc/nginx/test-frontend
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

# Stop and recreate container with config mounted
docker stop gifalot-frontend-test
docker rm gifalot-frontend-test

docker run -d \
  --name gifalot-frontend-test \
  --network host \
  -v /var/www/gifalot-frontend-test:/usr/share/nginx/html:ro \
  -v /etc/nginx/test-frontend/default.conf:/etc/nginx/conf.d/default.conf:ro \
  --restart always \
  nginx:alpine

# Wait and verify
sleep 2
docker ps | grep gifalot-frontend-test

# Test nginx (may show 403 - that's OK, directory is empty)
curl http://localhost:8081/ 2>/dev/null | head -3

# NOTE: 403 Forbidden is EXPECTED at this stage - the directory is empty.
# Once GitHub Actions deploys files, it will work. Container is running correctly!

# Create Traefik config
cat > /home/ansible/infrastructure/traefik/dynamic/test.yml << 'EOF'
http:
  routers:
    test-frontend:
      rule: "Host(`test.gifalot.com`) && !PathPrefix(`/gif-j`)"
      service: test-frontend-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 1
    test-backend:
      rule: "Host(`test.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: test-backend-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 10
  services:
    test-frontend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:8081"
    test-backend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3334"
EOF

# Restart Traefik
docker restart traefik-traefik-1
```

---

## Step 2: DNS Setup

Add DNS A record:
- **Name**: `test`
- **Type**: `A`
- **Value**: `38.242.204.63`
- **TTL**: 300

---

## Step 3: Verify

```bash
# Wait 5-15 minutes for DNS, then:
curl -I https://test.gifalot.com/
curl -I https://test.gifalot.com/gif-j/

# Verify dev still works:
curl -I https://dev.gifalot.com/
```

---

## Step 4: Test Deployment

```bash
# Create test branch
git checkout -b test-setup
git push origin test-setup

# GitHub Actions will deploy automatically
# Check Actions tab in GitHub
```

---

## Done! 🎉

Your test environment is ready. Push any branch (except `main`) and it will deploy to `test.gifalot.com`.

**Full guide**: See `SETUP_TEST_ENVIRONMENT.md` for detailed instructions.

