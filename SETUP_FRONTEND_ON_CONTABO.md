# Setup Frontend on Contabo Server

## Overview
Deploy the React frontend directly on the Contabo server to eliminate CORS issues and simplify the architecture.

## Architecture
- **Frontend**: `https://dev.gifalot.com/` (served as static files via Traefik)
- **Backend API**: `https://dev.gifalot.com/gif-j/` (existing backend)
- **Same Origin**: No CORS needed!

## Step 1: Create Frontend Directory on Server

**On Contabo server:**
```bash
# Create directory for frontend static files
mkdir -p /var/www/gifalot-frontend

# Set permissions
chown -R root:root /var/www/gifalot-frontend
chmod -R 755 /var/www/gifalot-frontend
```

**Expected Result:**
- Directory created at `/var/www/gifalot-frontend`
- Permissions set correctly

## Step 2: Configure Traefik to Serve Frontend

**On Contabo server:**
```bash
cd /home/ansible/infrastructure/traefik

# Create frontend router config
cat > /etc/traefik/dynamic/frontend-dev.yml << 'EOF'
http:
  routers:
    frontend-dev:
      rule: "Host(`dev.gifalot.com`) && PathPrefix(`/`)"
      service: frontend-service-dev
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 1  # Lower priority than backend (backend has /gif-j prefix)
  
    backend-dev:
      rule: "Host(`dev.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: backend-service-dev
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 10  # Higher priority for API routes
  
  services:
    frontend-service-dev:
      loadBalancer:
        servers:
          - url: "file:///var/www/gifalot-frontend"
    
    backend-service-dev:
      loadBalancer:
        servers:
          - url: "http://localhost:3333"
EOF
```

**Expected Result:**
- Frontend router config created
- Backend router updated with priority

## Step 3: Update Frontend Build Configuration

**On local machine:**
```bash
cd gif-j-react

# Check current .env
cat .env 2>/dev/null || echo "No .env file"

# Update API URL to use same domain (no CORS needed!)
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production
```

**Expected Result:**
- `.env.production` created with correct API URL

## Step 4: Build Frontend Locally

**On local machine:**
```bash
cd gif-j-react

# Install dependencies if needed
npm ci

# Build for production
npm run build
```

**Expected Result:**
- Build completes successfully
- `build/` directory created with static files

## Step 5: Deploy Frontend to Server

**Option A: Manual Upload (Quick Test)**
```bash
# On local machine - compress build
cd gif-j-react
tar -czf build.tar.gz build/

# Upload to server (using scp or your preferred method)
# scp build.tar.gz root@38.242.204.63:/tmp/

# On server - extract
# cd /var/www/gifalot-frontend
# tar -xzf /tmp/build.tar.gz --strip-components=1
```

**Option B: Use rsync (Better for updates)**
```bash
# On local machine
cd gif-j-react
rsync -avz --delete build/ root@38.242.204.63:/var/www/gifalot-frontend/
```

**Expected Result:**
- Frontend files copied to `/var/www/gifalot-frontend/`
- Files are accessible

## Step 6: Configure Traefik File Server

Traefik v2.9 doesn't have built-in file server. We need to use a simple HTTP server or Nginx. Let's use a simple approach:

**Option 1: Use Nginx in Docker (Recommended)**
```bash
# Create nginx config
cat > /var/www/gifalot-frontend/nginx.conf << 'EOF'
server {
    listen 8080;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# Run nginx container
docker run -d \
  --name gifalot-frontend \
  --network host \
  -v /var/www/gifalot-frontend:/usr/share/nginx/html:ro \
  nginx:alpine
```

**Option 2: Use Traefik with file server (if available)**
Actually, Traefik doesn't serve static files directly. We need a web server.

## Step 7: Update Traefik Config to Point to Nginx

```bash
# Update frontend service to point to nginx
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
```

## Step 8: Test Frontend

```bash
# Test frontend
curl -k -I https://dev.gifalot.com/

# Test backend still works
curl -k -I https://dev.gifalot.com/gif-j/
```

**Expected Result:**
- Frontend returns `200 OK` with HTML
- Backend still returns `200 OK`
- No CORS errors in browser!




