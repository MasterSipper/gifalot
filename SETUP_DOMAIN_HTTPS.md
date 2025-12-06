# Set Up HTTPS with Domain (dev.gifalot.com)

This is a much better solution! Set up HTTPS directly on your domain instead of using ngrok.

## Your Plan

1. ✅ Point `dev.gifalot.com` to your VPS IP: `38.242.204.63`
2. ✅ Install SSL certificate (Let's Encrypt - free!)
3. ✅ Configure Nginx for HTTPS
4. ✅ Update Netlify to use: `https://dev.gifalot.com/gif-j/`

**Benefits:**
- ✅ Permanent solution (no changing URLs)
- ✅ Professional domain
- ✅ Free SSL certificate
- ✅ Auto-renewal
- ✅ Solves Mixed Content error

## Step 1: Set Up DNS

Point your domain to the VPS:

1. **Go to your domain registrar** (where you bought gifalot.com)
2. **Find DNS management**
3. **Add A record:**
   - **Type:** A
   - **Name/Host:** `dev` (or `dev.gifalot.com` depending on provider)
   - **Value/Points to:** `38.242.204.63`
   - **TTL:** 3600 (or default)

4. **Wait for DNS propagation** (5 minutes to 48 hours, usually ~15 minutes)

**Test DNS:**
```bash
# On your local machine
nslookup dev.gifalot.com
# Should show: 38.242.204.63
```

## Step 2: Access Your VPS to Set Up SSL

You still need access to your VPS. Options:

### Option A: Use Contabo Console/Web Shell

1. **Check Contabo panel** for:
   - "Console" or "Web Terminal" option
   - "Server Management" → "Console Access"
   - This might bypass login issues

### Option B: Contact Contabo Support

Ask them to:
1. Help set up SSL certificate for dev.gifalot.com
2. Configure Nginx for HTTPS
3. Or provide access to set it up yourself

### Option C: Fix Login First

Once you get SSH/VNC access working, you can set up SSL yourself.

## Step 3: Install SSL Certificate (Once You Have Access)

Once you can access your VPS:

```bash
# Install Certbot
apt update
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (automatically configures Nginx)
certbot --nginx -d dev.gifalot.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose: Redirect HTTP to HTTPS (recommend Yes)
```

Certbot will:
- ✅ Get SSL certificate from Let's Encrypt
- ✅ Configure Nginx automatically
- ✅ Set up auto-renewal

## Step 4: Verify SSL Works

```bash
# Test HTTPS endpoint
curl https://dev.gifalot.com/gif-j/

# Check SSL certificate
curl -I https://dev.gifalot.com
```

Should work without certificate errors!

## Step 5: Update Netlify

1. **Go to Netlify Dashboard**
2. **Site settings** → **Environment variables**
3. **Update `REACT_APP_API_URL`:**
   - **Value:** `https://dev.gifalot.com/gif-j/`
   - **Scope:** All scopes
4. **Save**
5. **Trigger new deploy**

## Step 6: Update Backend CORS

Make sure backend allows requests from Netlify:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Restart backend after updating.

## Complete Nginx Configuration (If Setting Up Manually)

If Certbot doesn't auto-configure, here's the manual setup:

```nginx
# HTTP - Redirect to HTTPS
server {
    listen 80;
    server_name dev.gifalot.com;
    return 301 https://$server_name$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    server_name dev.gifalot.com;

    # SSL certificates (from Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/dev.gifalot.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/dev.gifalot.com/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Increase body size for file uploads
    client_max_body_size 20M;

    # Backend proxy
    location /gif-j/ {
        proxy_pass http://localhost:3001/gif-j/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Benefits of This Approach

- ✅ **Permanent:** No changing URLs
- ✅ **Professional:** Uses your domain
- ✅ **Free:** Let's Encrypt SSL is free
- ✅ **Auto-renewal:** Certificates renew automatically
- ✅ **Better than ngrok:** No rate limits, no "visit site" pages
- ✅ **Solves Mixed Content:** Proper HTTPS

## Challenges

**You still need VPS access to:**
- Install Certbot
- Configure Nginx
- Set up SSL

**But this is a better goal than ngrok!**

## Alternative: Let Contabo Support Help

Contact Contabo support and ask:

> "I need to set up HTTPS/SSL for dev.gifalot.com pointing to my VPS (38.242.204.63). Can you help configure Let's Encrypt SSL certificate and Nginx for HTTPS?"

They might be able to:
- Help set it up
- Provide guidance
- Or give you access to do it

## Quick Summary

1. ✅ Point DNS: `dev.gifalot.com` → `38.242.204.63`
2. ✅ Wait for DNS propagation
3. ✅ Get VPS access (console or fix login)
4. ✅ Install SSL certificate with Certbot
5. ✅ Update Netlify to use `https://dev.gifalot.com/gif-j/`
6. ✅ Done! ✅

This is definitely the better solution! Much more professional and permanent than ngrok.


