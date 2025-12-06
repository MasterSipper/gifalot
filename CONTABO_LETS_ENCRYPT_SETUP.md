# Install Let's Encrypt SSL - Contabo's Official Method

Perfect! Contabo supports free Let's Encrypt SSL. Here's how to do it for your setup.

## Prerequisites (According to Contabo)

1. ✅ Domain name pointing to server: `dev.gifalot.com` → `38.242.204.63`
2. ❌ Root or sudo access: **This is your challenge!**

## Your Setup

- **Domain:** dev.gifalot.com
- **Server:** Ubuntu 20.04.6 LTS (from VNC)
- **Web Server:** Nginx (since you're using Nginx proxy)
- **Backend:** Running on port 3001

## Step-by-Step Instructions (Adapted for Your Setup)

### Step 1: Point DNS

In your domain registrar:
- Add A record: `dev` → `38.242.204.63`
- Wait for DNS propagation (15 minutes - 48 hours)

**Test DNS:**
```bash
nslookup dev.gifalot.com
# Should show: 38.242.204.63
```

### Step 2: Get VPS Access

You need root or sudo access to run commands. Options:

**Option A: Fix Login Issues**
- Get SSH/VNC working
- Use Contabo console if available

**Option B: Contact Contabo Support**
- Ask: "I need to install Let's Encrypt SSL certificate. Can you help with access or guide me?"

### Step 3: Install Certbot (Once You Have Access)

Since you're using **Ubuntu** with **Nginx**:

```bash
# Update package list
sudo apt update

# Install Certbot for Nginx
sudo apt install certbot python3-certbot-nginx
```

### Step 4: Get SSL Certificate

For your domain `dev.gifalot.com`:

```bash
# Get SSL certificate (automatically configures Nginx)
sudo certbot --nginx -d dev.gifalot.com
```

**Or if you also want www subdomain:**

```bash
sudo certbot --nginx -d dev.gifalot.com -d www.dev.gifalot.com
```

**During setup, Certbot will ask:**
1. Email address (for renewal notices)
2. Agree to terms of service
3. Share email with EFF (optional)
4. **Redirect HTTP to HTTPS?** → Choose "Yes" (recommended)

Certbot will:
- ✅ Get SSL certificate from Let's Encrypt
- ✅ Automatically configure Nginx
- ✅ Set up auto-renewal

### Step 5: Test Certificate Renewal

According to Contabo:

```bash
# Test auto-renewal (doesn't actually renew, just tests)
sudo certbot renew --dry-run
```

Should show: "The dry run was successful."

### Step 6: Restart Nginx

```bash
sudo systemctl restart nginx
```

### Step 7: Verify SSL Works

```bash
# Test HTTPS endpoint
curl https://dev.gifalot.com/gif-j/

# Check SSL certificate
curl -I https://dev.gifalot.com
```

Should work with valid SSL!

### Step 8: Update Netlify

1. Go to Netlify Dashboard
2. Site settings → Environment variables
3. Update `REACT_APP_API_URL`:
   - **Value:** `https://dev.gifalot.com/gif-j/`
   - **Scope:** All scopes
4. Save and trigger new deploy

## What Certbot Does Automatically

When you run `certbot --nginx -d dev.gifalot.com`, it:

1. ✅ Gets SSL certificate from Let's Encrypt
2. ✅ Modifies your Nginx configuration
3. ✅ Adds SSL settings
4. ✅ Sets up HTTP → HTTPS redirect
5. ✅ Configures auto-renewal (cron job)

Your Nginx config will automatically be updated to include:
- SSL certificate paths
- HTTPS listener on port 443
- HTTP → HTTPS redirect

## Your Nginx Config (After Certbot)

Certbot will modify your config to look like:

```nginx
# HTTP - Redirect to HTTPS (auto-added by Certbot)
server {
    listen 80;
    server_name dev.gifalot.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS (auto-configured by Certbot)
server {
    listen 443 ssl http2;
    server_name dev.gifalot.com;

    # SSL certificates (auto-added by Certbot)
    ssl_certificate /etc/letsencrypt/live/dev.gifalot.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.gifalot.com/privkey.pem;

    # Your existing backend proxy
    location /gif-j/ {
        proxy_pass http://localhost:3001/gif-j/;
        # ... your existing proxy settings
    }
}
```

## Troubleshooting

### DNS Not Resolved

```bash
# Check DNS
nslookup dev.gifalot.com

# If not showing your IP, wait longer or check DNS settings
```

### Certbot Fails

**Error: "Could not find a VirtualHost"**
- Make sure Nginx config has `server_name dev.gifalot.com;`
- Check: `nginx -t` (test config)

**Error: "Failed to connect to port 80"**
- Make sure port 80 is open: `ufw allow 80/tcp`
- Make sure Nginx is running: `systemctl status nginx`

**Error: "DNS problem"**
- Wait longer for DNS propagation
- Verify DNS is pointing correctly

### Certificate Renewal

Certificates auto-renew, but you can manually renew:

```bash
sudo certbot renew
```

Check renewal status:
```bash
sudo certbot certificates
```

## Quick Command Reference

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d dev.gifalot.com

# Test renewal
sudo certbot renew --dry-run

# Restart Nginx
sudo systemctl restart nginx

# Check certificates
sudo certbot certificates

# View Nginx config
sudo nano /etc/nginx/sites-available/gifalot-backend
```

## Next Steps

1. ✅ **Point DNS:** dev.gifalot.com → 38.242.204.63
2. ✅ **Get VPS access** (fix login or contact support)
3. ✅ **Run Certbot:** `sudo certbot --nginx -d dev.gifalot.com`
4. ✅ **Update Netlify:** Use HTTPS URL
5. ✅ **Done!** Free SSL working!

## Contact Contabo Support

If you need help with access, you can say:

> "I found your Let's Encrypt guide and want to install SSL for dev.gifalot.com. I need help getting access to run the Certbot commands. Can you assist?"

They should help you get access or guide you through it!

You're on the right track! Once you have access, it's just a few commands. 🚀


