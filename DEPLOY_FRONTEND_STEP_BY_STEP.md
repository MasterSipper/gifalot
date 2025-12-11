# Deploy Frontend to Contabo - Step by Step

## Prerequisites
- Frontend built successfully (✅ Done)
- Build folder: `C:\Projects\Gifalot\gif-j-react\build\`
- Server access: `root@38.242.204.63`

## Step 1: Upload Build Files to Server

**In PowerShell on your local machine:**

```powershell
# Navigate to the build folder
cd C:\Projects\Gifalot\gif-j-react\build

# Upload all files to server (you'll be prompted for password)
scp -r * root@38.242.204.63:/var/www/gifalot-frontend/
```

**What this does:**
- `scp` = secure copy (like copying files over SSH)
- `-r` = recursive (copy folders and all contents)
- `*` = all files in current directory
- `root@38.242.204.63` = your server
- `/var/www/gifalot-frontend/` = destination folder on server

**Expected Result:**
- You'll be prompted for your server password
- Files will upload (may take a minute)
- Should see files being copied

**If scp doesn't work, use WinSCP or FileZilla:**
1. Download WinSCP (free): https://winscp.net/
2. Connect to `38.242.204.63` as `root`
3. Navigate to `/var/www/gifalot-frontend/` on the right (server)
4. Navigate to `C:\Projects\Gifalot\gif-j-react\build\` on the left (your computer)
5. Select all files on left, drag to right to upload

## Step 2: Verify Files Are on Server

**Connect to your server via SSH, then run:**

```bash
# Check if files are there
ls -la /var/www/gifalot-frontend/

# Should see index.html and other files
ls /var/www/gifalot-frontend/ | head -10
```

**Expected Result:**
- Should see `index.html` file
- Should see `static` folder
- Should see other files from the build

## Step 3: Set Up Nginx to Serve Frontend Files

**On your server (via SSH), run:**

```bash
# Create nginx container to serve the frontend files
docker run -d \
  --name gifalot-frontend \
  --network host \
  -v /var/www/gifalot-frontend:/usr/share/nginx/html:ro \
  --restart always \
  nginx:alpine
```

**What this does:**
- Creates a Docker container with Nginx (web server)
- `--network host` = uses host networking (simpler)
- `-v /var/www/gifalot-frontend:/usr/share/nginx/html:ro` = mounts your files into the container (read-only)
- `--restart always` = container restarts automatically if server reboots

**Expected Result:**
- Container starts successfully
- Should see a container ID

## Step 4: Verify Nginx is Running

**On your server, run:**

```bash
# Check if container is running
docker ps | grep gifalot-frontend

# Check what port nginx is using
ss -tlnp | grep nginx
```

**Expected Result:**
- Should see `gifalot-frontend` container running
- Should see nginx listening on port 80 (or check the output)

## Step 5: Test Nginx is Serving Files

**On your server, run:**

```bash
# Test if nginx is serving the frontend
curl http://localhost/ 2>/dev/null | head -20
```

**Expected Result:**
- Should see HTML content (the React app)
- Should see `<html>`, `<head>`, etc.

## Step 6: Update Traefik to Route Frontend

**On your server, run:**

```bash
# Update Traefik configuration to route frontend requests
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
          - url: "http://localhost:80"
    
    backend-service-dev:
      loadBalancer:
        servers:
          - url: "http://localhost:3333"
EOF

# Restart Traefik to load new config
docker restart traefik-traefik-1

# Wait a few seconds
sleep 5
```

**What this does:**
- Creates routing rules for Traefik
- Frontend: All requests to `dev.gifalot.com` EXCEPT `/gif-j/*` go to frontend
- Backend: All requests to `dev.gifalot.com/gif-j/*` go to backend
- Both use HTTPS with Let's Encrypt certificates

**Expected Result:**
- File created successfully
- Traefik restarts without errors

## Step 7: Test Frontend in Browser

**On your computer:**
1. Open browser
2. Go to: `https://dev.gifalot.com/`
3. Try to log in

**Expected Result:**
- Frontend loads (should see your React app)
- Login should work WITHOUT CORS errors!
- All API calls work (same domain = no CORS needed)

## Troubleshooting

**If frontend doesn't load:**
- Check Step 2: Are files on server?
- Check Step 4: Is nginx running?
- Check Step 5: Does `curl http://localhost/` work?

**If you see 404:**
- Check Traefik logs: `docker logs traefik-traefik-1 --tail 50`
- Verify config: `cat /etc/traefik/dynamic/frontend-dev.yml`




