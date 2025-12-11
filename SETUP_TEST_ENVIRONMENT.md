# Setup Test Environment - test.gifalot.com

## Overview

This guide will set up `test.gifalot.com` for branch testing without affecting `dev.gifalot.com`.

**Time required**: ~15-20 minutes  
**Risk level**: Zero - completely isolated from dev environment

---

## Prerequisites

- [ ] SSH access to Contabo server (root@38.242.204.63)
- [ ] GitHub repository access
- [ ] DNS access to add `test.gifalot.com` record
- [ ] `dev.gifalot.com` is currently working (verify before starting)

---

## Step 1: Verify Current Setup

**On your local machine, verify dev.gifalot.com works:**
```bash
curl -I https://dev.gifalot.com/
curl -I https://dev.gifalot.com/gif-j/
```

Both should return `200 OK`. If not, don't proceed until dev is working.

---

## Step 2: Server Setup (One-Time)

**SSH into your Contabo server:**
```bash
ssh root@38.242.204.63
```

### 2.1 Create Frontend Directory

```bash
# Create directory for test frontend
mkdir -p /var/www/gifalot-frontend-test

# Set permissions
chown -R root:root /var/www/gifalot-frontend-test
chmod -R 755 /var/www/gifalot-frontend-test

# Verify
ls -la /var/www/ | grep gifalot
```

**Expected output:**
- You should see both `gifalot-frontend` and `gifalot-frontend-test` directories

### 2.2 Create Nginx Container for Test Frontend

```bash
# Create Nginx container for test frontend (port 8081)
docker run -d \
  --name gifalot-frontend-test \
  --network host \
  -v /var/www/gifalot-frontend-test:/usr/share/nginx/html:ro \
  --restart always \
  nginx:alpine

# Verify container is running
docker ps | grep gifalot-frontend-test
```

**Expected output:**
- Container `gifalot-frontend-test` should be running

### 2.3 Configure Nginx to Listen on Port 8081

```bash
# Create custom nginx config for port 8081
docker exec -it gifalot-frontend-test sh -c "cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 8081;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
EOF
"

# Reload nginx
docker exec -it gifalot-frontend-test nginx -s reload

# Test nginx is serving on port 8081
curl http://localhost:8081/ 2>/dev/null | head -5
```

**Expected output:**
- Should see HTML content (even if it's a 404, that's OK - we'll deploy files later)

---

## Step 3: Traefik Configuration

**Still on the server, create Traefik config for test environment:**

```bash
# Check where Traefik dynamic config is located
docker exec traefik-traefik-1 ls -la /etc/traefik/dynamic/ 2>/dev/null || echo "Check Traefik volume mount"

# Based on your setup, it should be at:
# /home/ansible/infrastructure/traefik/dynamic/ (on host)
# OR
# /etc/traefik/dynamic/ (inside container)

# Find the actual location
docker inspect traefik-traefik-1 | grep -A 5 "Mounts"
```

**Note the volume mount path, then create the config file:**

```bash
# Create test environment Traefik config
# First, check what your dev environment uses:
echo "Checking existing dev config..."
cat /home/ansible/infrastructure/traefik/dynamic/*.yml 2>/dev/null | grep -A 10 "dev.gifalot.com" || echo "No dev config found, will use HTTPS setup"

# Create test config (matching dev.gifalot.com setup with HTTPS)
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

# NOTE: If your Traefik doesn't have websecure/letsencrypt configured,
# you may need to use 'web' entrypoint instead. Check your Traefik setup:
# docker exec traefik-traefik-1 cat /etc/traefik/traefik.yml
# OR check the docker-compose: docker inspect traefik-traefik-1 | grep -A 20 "Cmd"

# Set permissions
chown ansible:ansible /home/ansible/infrastructure/traefik/dynamic/test.yml
chmod 644 /home/ansible/infrastructure/traefik/dynamic/test.yml

# Restart Traefik to pick up new config
docker restart traefik-traefik-1

# Wait a moment for Traefik to restart
sleep 5

# Verify Traefik is running
docker ps | grep traefik
```

**Expected output:**
- Traefik container should be running
- Config file should exist at the path you specified

---

## Step 4: DNS Setup

**In your DNS provider (wherever you manage gifalot.com DNS):**

1. Add a new A record:
   - **Name**: `test`
   - **Type**: `A`
   - **Value**: `38.242.204.63` (your Contabo VPS IP)
   - **TTL**: 300 (or default)

2. Save the DNS record

**Verify DNS propagation (may take a few minutes):**
```bash
# On your local machine
nslookup test.gifalot.com
# OR
dig test.gifalot.com
```

**Expected output:**
- Should resolve to `38.242.204.63`

---

## Step 5: GitHub Actions Workflow

**The workflow file has already been created:**
- `gif-j-backend/.github/workflows/deploy-test.yml`

**Verify it exists:**
```bash
# On your local machine
ls -la gif-j-backend/.github/workflows/deploy-test.yml
```

**The workflow will:**
- Trigger on any branch push (except `main`)
- Deploy backend with `STAGE=test` on port 3334
- Build and deploy frontend to `/var/www/gifalot-frontend-test`

---

## Step 6: Test the Setup

### 6.1 Create a Test Branch

```bash
# On your local machine
git checkout -b test-setup-verification

# Make a small change (optional - just to trigger deployment)
echo "# Test" >> README.md

# Commit and push
git add .
git commit -m "Test: Verify test environment setup"
git push origin test-setup-verification
```

### 6.2 Monitor GitHub Actions

1. Go to your GitHub repository
2. Click "Actions" tab
3. You should see "Deploy TEST" workflow running
4. Wait for it to complete (both backend and frontend jobs)

### 6.3 Verify Deployment

**Wait for DNS to propagate (5-15 minutes), then test:**

```bash
# Test frontend (may show 404 or default nginx page initially)
curl -I https://test.gifalot.com/

# Test backend (should work after deployment)
curl -I https://test.gifalot.com/gif-j/
```

**Expected results:**
- Frontend: Should return `200 OK` (may show default page if no files deployed yet)
- Backend: Should return `200 OK` after GitHub Actions completes

---

## Step 7: Verify dev.gifalot.com Still Works

**CRITICAL: Verify dev environment is unaffected:**

```bash
# Test dev frontend
curl -I https://dev.gifalot.com/

# Test dev backend
curl -I https://dev.gifalot.com/gif-j/
```

**Both should still return `200 OK`** ✅

If dev is broken, something went wrong. Check:
- Traefik logs: `docker logs traefik-traefik-1`
- Container status: `docker ps`
- Traefik config: `cat /home/ansible/infrastructure/traefik/dynamic/test.yml`

---

## Troubleshooting

### Issue: Frontend shows 404 or default nginx page

**Solution:** Frontend files haven't been deployed yet. Wait for GitHub Actions to complete, or manually deploy:

```bash
# On your local machine, build and deploy manually
cd gif-j-react
npm ci
REACT_APP_API_URL=https://test.gifalot.com/gif-j/ npm run build
rsync -avz --delete build/ root@38.242.204.63:/var/www/gifalot-frontend-test/
```

### Issue: Backend not accessible

**Solution:** Check if backend container is running:

```bash
# On server
docker ps | grep gif-j-backend-test
docker logs services-gif-j-backend-test_app_1
```

### Issue: Traefik not routing test.gifalot.com

**Solution:** 
1. Check Traefik config exists: `cat /home/ansible/infrastructure/traefik/dynamic/test.yml`
2. Check Traefik logs: `docker logs traefik-traefik-1 | tail -50`
3. Verify DNS: `nslookup test.gifalot.com`
4. Restart Traefik: `docker restart traefik-traefik-1`

### Issue: Port conflicts

**Solution:** Verify ports are available:

```bash
# On server
netstat -tuln | grep -E '8081|3334'
# Should show these ports in use (that's good)
# If you see conflicts, check what's using them
```

---

## Usage

### Testing Frontend Changes

1. Create branch: `git checkout -b feature/new-ui`
2. Make changes in `gif-j-react/`
3. Push: `git push origin feature/new-ui`
4. GitHub Actions deploys automatically
5. Visit `https://test.gifalot.com` to see changes

### Testing Backend Changes

1. Create branch: `git checkout -b feature/new-api`
2. Make changes in `gif-j-backend/`
3. Push: `git push origin feature/new-api`
4. GitHub Actions deploys automatically
5. Test at `https://test.gifalot.com/gif-j/`

### Testing Full Stack Changes

1. Create branch: `git checkout -b feature/full-stack`
2. Make changes in both frontend and backend
3. Push: `git push origin feature/full-stack`
4. Both deploy automatically
5. Test at `https://test.gifalot.com`

---

## Rollback (If Needed)

If you need to remove the test environment:

```bash
# On server
# Stop and remove containers
docker stop gifalot-frontend-test
docker rm gifalot-frontend-test
docker stop services-gif-j-backend-test_app_1 2>/dev/null
docker rm services-gif-j-backend-test_app_1 2>/dev/null

# Remove directories (optional)
rm -rf /var/www/gifalot-frontend-test
rm -rf /home/ansible/services/test

# Remove Traefik config
rm /home/ansible/infrastructure/traefik/dynamic/test.yml
docker restart traefik-traefik-1

# Remove DNS record (in your DNS provider)
# Delete the test.gifalot.com A record
```

**Result:** dev.gifalot.com continues working exactly as before.

---

## Next Steps

1. ✅ Verify `dev.gifalot.com` still works
2. ✅ Test a branch deployment
3. ✅ Verify `test.gifalot.com` works
4. ✅ Start using test environment for branch testing!

---

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Check server logs: `docker logs <container-name>`
3. Verify DNS: `nslookup test.gifalot.com`
4. Verify Traefik: `docker logs traefik-traefik-1`

