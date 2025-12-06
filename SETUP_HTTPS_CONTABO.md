# Setup HTTPS on Contabo VPS - Step by Step

## Prerequisites

You have SSH access:
- **IP:** `38.242.204.63`
- **Port:** `2049` (not default 22)
- **Username:** `root`
- **Password:** `constant-heard-swans-ari`

## Step 1: Connect via SSH

### Windows (PowerShell or Command Prompt)

```powershell
ssh root@38.242.204.63 -p 2049
```

When prompted, enter password: `constant-heard-swans-ari`

### Alternative: Use PuTTY (Windows)

1. Download PuTTY if you don't have it
2. Open PuTTY
3. Enter:
   - **Host Name:** `38.242.204.63`
   - **Port:** `2049`
   - **Connection type:** SSH
4. Click "Open"
5. Login as: `root`
6. Password: `constant-heard-swans-ari`

## Step 2: Verify Domain DNS

Before setting up SSL, make sure your domain points to the VPS:

```bash
# Check if domain resolves to your IP
nslookup dev.gifalot.com
```

Should return: `38.242.204.63`

**If DNS is not set up yet:**
1. Go to your domain registrar
2. Add A record: `dev` → `38.242.204.63`
3. Wait 15-30 minutes for DNS propagation
4. Then continue with Step 3

## Step 3: Install Certbot

Once connected via SSH, run:

```bash
# Update package list
sudo apt update

# Install Certbot using snap (recommended - more reliable)
sudo apt install snapd -y
sudo systemctl enable --now snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

# Install Nginx plugin for Certbot
sudo snap set certbot trust-plugin-with-root=ok
sudo snap install certbot-nginx
```

**Alternative: If snap doesn't work, try fixing the Python OpenSSL issue:**

```bash
# Update all packages first
sudo apt update && sudo apt upgrade -y

# Remove old certbot
sudo apt remove certbot python3-certbot-nginx -y

# Fix Python OpenSSL dependencies
sudo apt install --reinstall python3-openssl python3-pip -y
sudo pip3 install --upgrade pyOpenSSL cryptography

# Reinstall certbot
sudo apt install certbot python3-certbot-nginx -y
```

## Step 4: Get SSL Certificate

```bash
# Get SSL certificate for your domain
sudo certbot --nginx -d dev.gifalot.com
```

**Follow the prompts:**
1. **Email address:** Enter your email (for renewal notices)
2. **Terms of Service:** Type `A` to agree
3. **Share email with EFF:** Type `Y` or `N` (your choice)
4. **Redirect HTTP to HTTPS:** Type `2` and press Enter (recommended)

Certbot will:
- Automatically configure Nginx
- Obtain SSL certificate from Let's Encrypt
- Set up automatic renewal

## Step 5: Verify SSL Certificate

```bash
# Check certificate is installed
sudo certbot certificates

# Test certificate renewal (dry run)
sudo certbot renew --dry-run

# Test HTTPS endpoint
curl https://dev.gifalot.com/gif-j/
```

Should return a response (not connection error).

## Step 6: Verify Nginx Configuration

```bash
# Test Nginx configuration
sudo nginx -t

# If successful, reload Nginx
sudo systemctl reload nginx
```

## Step 7: Update Netlify Environment Variable

1. Go to https://app.netlify.com
2. Select your site: **gifalot**
3. Go to **Site settings** → **Environment variables**
4. Edit `REACT_APP_API_URL`
5. Change from: `http://38.242.204.63/gif-j/`
6. Change to: `https://dev.gifalot.com/gif-j/`
7. **Important:** Include trailing slash `/`
8. Save

## Step 8: Trigger New Deploy

1. Go to **Deploys** tab in Netlify
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete (2-5 minutes)

## Step 9: Verify It's Working

After deployment:

1. Visit `https://gifalot.netlify.app/#/2/6/carousel`
2. Open browser console (F12)
3. Check for:
   - ✅ API calls to `https://dev.gifalot.com/gif-j/collection/2/6`
   - ✅ No mixed content errors
   - ✅ No `ERR_NAME_NOT_RESOLVED` errors
   - ✅ Compilation loads successfully

## Troubleshooting

### SSH Connection Issues

**If SSH on port 2049 doesn't work:**
1. Check firewall allows port 2049
2. Try VNC access instead
3. Contact Contabo support

**To enable SSH on port 22 (optional):**
```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Ensure this line exists (not commented):
Port 22

# Reload SSH
sudo systemctl reload sshd

# Update firewall to allow port 22
sudo ufw allow 22/tcp
```

### Certbot Issues

**If certbot fails with "AttributeError: module 'lib' has no attribute 'X509_V_FLAG_CB_ISSUER_CHECK'":**

This is a Python OpenSSL version mismatch. Fix it with:

```bash
# Option 1: Use snap (recommended)
sudo apt install snapd -y
sudo systemctl enable --now snapd
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot
sudo snap install certbot-nginx

# Option 2: Fix Python dependencies
sudo apt remove certbot python3-certbot-nginx -y
sudo apt install --reinstall python3-openssl python3-pip -y
sudo pip3 install --upgrade pyOpenSSL cryptography
sudo apt install certbot python3-certbot-nginx -y
```

**If certbot fails with "Domain not pointing to this server":**
- Wait for DNS propagation (can take up to 48 hours, usually 15-30 minutes)
- Verify DNS: `nslookup dev.gifalot.com`
- Make sure it returns `38.242.204.63`

**If Nginx is not installed:**
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

**If port 80/443 is blocked or already in use:**

**Check what's using port 80:**
```bash
# See what process is using port 80
sudo lsof -i :80
# or
sudo netstat -tulpn | grep :80
# or
sudo ss -tulpn | grep :80
```

**If your backend is using port 80:**

You have two options:

**Option 1: Stop backend temporarily (if it's safe to do so)**
```bash
# Find and stop the process using port 80
# If it's your backend app, stop it temporarily
sudo systemctl stop <your-backend-service>
# or if running via docker
sudo docker ps
sudo docker stop <container-name>

# Then retry certbot
sudo certbot --nginx -d dev.gifalot.com

# After certbot succeeds, restart your backend
sudo systemctl start <your-backend-service>
```

**Option 2: Configure Nginx as reverse proxy (Recommended)**

If your backend is running on port 80, you need to:
1. Move backend to a different port (e.g., 3000)
2. Configure Nginx to proxy requests to backend
3. Then run certbot

```bash
# First, check your backend configuration
# Your backend should run on port 3000 or 3001, not 80

# Configure Nginx to proxy /gif-j/ to your backend
sudo nano /etc/nginx/sites-available/default
```

Add this configuration (adjust port if different):
```nginx
server {
    listen 80;
    server_name dev.gifalot.com;

    location /gif-j/ {
        proxy_pass http://localhost:3000/gif-j/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then:
```bash
# Test nginx config
sudo nginx -t

# If OK, reload nginx
sudo systemctl reload nginx

# Now retry certbot
sudo certbot --nginx -d dev.gifalot.com
```

**If port 80/443 is blocked by firewall:**
```bash
# Check firewall
sudo ufw status

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### SSL Certificate Renewal

Certbot automatically renews certificates. To verify:

```bash
# Check renewal status
sudo certbot renew --dry-run

# View renewal logs
sudo tail -f /var/log/letsencrypt/letsencrypt.log
```

Certificates auto-renew 30 days before expiration.

## Quick Reference

**SSH Connection:**
```bash
ssh root@38.242.204.63 -p 2049
# Password: constant-heard-swans-ari
```

**Install Certbot:**
```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

**Get SSL Certificate:**
```bash
sudo certbot --nginx -d dev.gifalot.com
```

**Test HTTPS:**
```bash
curl https://dev.gifalot.com/gif-j/
```

**Netlify Environment Variable:**
```
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
```

## After Setup

✅ Backend will be accessible via HTTPS
✅ No more mixed content errors
✅ Public compilation links will work
✅ Secure connection between frontend and backend
