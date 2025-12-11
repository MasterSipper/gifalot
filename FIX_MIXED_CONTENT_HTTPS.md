# Fix Mixed Content Error - HTTPS Required

## Problem

**Error:** `Mixed Content: The page at 'https://gifalot.netlify.app' was loaded over HTTPS, but requested an insecure XMLHttpRequest endpoint 'http://38.242.204.63/gif-j/...'`

**Cause:** Modern browsers block HTTP requests from HTTPS pages for security. Since Netlify serves your frontend over HTTPS, all API calls must also use HTTPS.

## Solution: Set Up HTTPS for Backend

You have two options:

### Option 1: Use Domain with HTTPS (Recommended)

If you have a domain pointing to your Contabo VPS (e.g., `dev.gifalot.com`):

1. **Set up SSL certificate** on your Contabo VPS:
   - Follow instructions in `CONTABO_SSL_COMMANDS.md`
   - Use Let's Encrypt (free SSL certificates)
   - Domain must be pointing to `38.242.204.63`

2. **Update Netlify environment variable:**
   - Go to Netlify → Site settings → Environment variables
   - Edit `REACT_APP_API_URL`
   - Change from: `http://38.242.204.63/gif-j/`
   - Change to: `https://dev.gifalot.com/gif-j/` (or your domain)
   - Save and trigger new deploy

### Option 2: Use IP with HTTPS (Advanced)

If you don't have a domain, you can:
1. Set up a self-signed certificate (browsers will show warning)
2. Use a reverse proxy (Nginx/Traefik) with SSL
3. Configure it to serve HTTPS on port 443

**Note:** Self-signed certificates will show browser warnings, which is not ideal for production.

## Quick Setup with Domain

If you have `dev.gifalot.com` pointing to your VPS:

### Step 1: Install Certbot on Contabo VPS

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### Step 2: Get SSL Certificate

```bash
sudo certbot --nginx -d dev.gifalot.com
```

Follow prompts:
- Enter email
- Agree to terms
- Redirect HTTP to HTTPS? → **Yes**

### Step 3: Test HTTPS

```bash
curl https://dev.gifalot.com/gif-j/
```

Should return response (not connection error).

### Step 4: Update Netlify

1. Go to Netlify → Site settings → Environment variables
2. Edit `REACT_APP_API_URL`
3. Change to: `https://dev.gifalot.com/gif-j/`
4. Save
5. Trigger new deploy (Deploys → Trigger deploy → Clear cache and deploy)

## Verify It's Working

After updating and deploying:

1. Visit `https://gifalot.netlify.app/#/2/6/carousel`
2. Open browser console (F12)
3. Check for:
   - ✅ API calls to `https://dev.gifalot.com/gif-j/collection/2/6`
   - ✅ No mixed content errors
   - ✅ Compilation loads successfully

## Current Status

- **Frontend:** `https://gifalot.netlify.app` (HTTPS ✅)
- **Backend:** `http://38.242.204.63/gif-j/` (HTTP ❌)
- **Required:** Backend must use HTTPS

## Troubleshooting

### Domain Not Pointing to VPS

1. Check DNS records:
   ```bash
   nslookup dev.gifalot.com
   ```
   Should return `38.242.204.63`

2. Wait for DNS propagation (can take up to 48 hours, usually 15 minutes)

### SSL Certificate Issues

1. Check certificate is installed:
   ```bash
   sudo certbot certificates
   ```

2. Test renewal:
   ```bash
   sudo certbot renew --dry-run
   ```

3. Check Nginx is configured:
   ```bash
   sudo nginx -t
   ```

### Still Getting Mixed Content Error

1. **Check Netlify environment variable:**
   - Must start with `https://` not `http://`
   - Must include trailing slash: `/gif-j/`

2. **Check you triggered new deploy:**
   - Environment variables only work in new builds
   - Old builds still have old HTTP URL

3. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

## Alternative: Temporary Workaround (Not Recommended)

If you can't set up HTTPS immediately, you can temporarily:

1. **Use HTTP for frontend** (not recommended):
   - This requires changing Netlify settings
   - Not secure and not recommended

2. **Use a proxy service:**
   - Services like Cloudflare can provide HTTPS for your backend
   - Requires domain setup

**Best practice:** Always use HTTPS for both frontend and backend in production.





