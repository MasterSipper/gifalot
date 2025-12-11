# Deploy Frontend to Contabo Server

## Step 1: Create Frontend Directory on Server

**On Contabo server, run:**
```bash
# Create directory for frontend static files
mkdir -p /var/www/gifalot-frontend

# Set permissions
chown -R root:root /var/www/gifalot-frontend
chmod -R 755 /var/www/gifalot-frontend
```

**Expected Result:**
- Directory `/var/www/gifalot-frontend` created
- Permissions set to 755

## Step 2: Update Frontend API URL for Production

**On local machine:**
```bash
cd gif-j-react

# Create production environment file
cat > .env.production << 'EOF'
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
EOF

# Verify
cat .env.production
```

**Expected Result:**
- `.env.production` file created
- Contains: `REACT_APP_API_URL=https://dev.gifalot.com/gif-j/`

## Step 3: Build Frontend

**On local machine:**
```bash
cd gif-j-react

# Install dependencies (if needed)
npm ci

# Build for production
npm run build
```

**Expected Result:**
- Build completes without errors
- `build/` directory created with static files
- Should see: "The build folder is ready to be deployed"

## Step 4: Deploy Frontend Files to Server

**On local machine, choose one method:**

**Method A: Using rsync (Recommended)**
```bash
cd gif-j-react

# Deploy build files
rsync -avz --delete build/ root@38.242.204.63:/var/www/gifalot-frontend/
```

**Method B: Using scp**
```bash
cd gif-j-react

# Compress and upload
tar -czf build.tar.gz build/
scp build.tar.gz root@38.242.204.63:/tmp/

# On server, extract:
# ssh root@38.242.204.63
# cd /var/www/gifalot-frontend
# tar -xzf /tmp/build.tar.gz --strip-components=1
```

**Expected Result:**
- Files copied to `/var/www/gifalot-frontend/` on server
- Should see `index.html` and other static files

## Step 5: Set Up Nginx to Serve Frontend

**On Contabo server:**
```bash
# Create nginx container to serve static files
docker run -d \
  --name gifalot-frontend \
  --network host \
  -v /var/www/gifalot-frontend:/usr/share/nginx/html:ro \
  --restart always \
  nginx:alpine

# Verify it's running
docker ps | grep gifalot-frontend

# Test nginx is serving files
curl http://localhost:8080/ 2>/dev/null | head -20
```

**Expected Result:**
- Container `gifalot-frontend` is running
- Nginx serves files on port 8080 (or check which port)
- Should see HTML content

## Step 6: Update Traefik to Route Frontend

**On Contabo server:**
```bash
# Update Traefik dynamic config
cat > /etc/traefik/dynamic/frontend-dev.yml << 'EOF'
http:
  routers:
    frontend-dev:
      rule: "Host(`dev.gifalot.com`) && !PathPrefix(`/gif-j`)"
      service: frontend-service-dev
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 1
  
    backend-dev:
      rule: "Host(`dev.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: backend-service-dev
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 10
  
  services:
    frontend-service-dev:
      loadBalancer:
        servers:
          - url: "http://localhost:8080"
    
    backend-service-dev:
      loadBalancer:
        servers:
          - url: "http://localhost:3333"
EOF

# Restart Traefik
docker restart traefik-traefik-1
sleep 5
```

**Expected Result:**
- Config file updated
- Traefik restarts successfully

## Step 7: Test Frontend

**On Contabo server:**
```bash
# Test frontend
curl -k -I https://dev.gifalot.com/

# Test backend still works
curl -k -I https://dev.gifalot.com/gif-j/
```

**Expected Result:**
- Frontend returns `HTTP/2 200` with HTML
- Backend returns `HTTP/2 200` with JSON
- Both work on same domain!

## Step 8: Test in Browser

1. Open `https://dev.gifalot.com/` in browser
2. Try to log in
3. Check browser console - should have NO CORS errors!

**Expected Result:**
- Frontend loads correctly
- Login works without CORS errors
- All API calls work (same origin)





