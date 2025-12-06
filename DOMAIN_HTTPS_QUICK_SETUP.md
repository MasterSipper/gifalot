# Quick: Set Up dev.gifalot.com with HTTPS

## Your Solution

Instead of ngrok, use your domain with HTTPS! Much better approach.

## Steps

### 1. Point DNS

In your domain registrar (where you bought gifalot.com):

**Add A Record:**
- **Host:** `dev`
- **Points to:** `38.242.204.63`
- **TTL:** 3600

Wait 15 minutes for DNS propagation.

### 2. Get VPS Access

You still need access. Try:

**Option A: Contabo Console**
- Check Contabo panel for "Console" or "Web Terminal"
- Might bypass login

**Option B: Contact Contabo Support**
- Ask them to help set up SSL
- Or provide access to set it up

### 3. Install SSL Certificate

Once you have access:

```bash
# Install Certbot
apt update
apt install -y certbot python3-certbot-nginx

# Get certificate (auto-configures Nginx)
certbot --nginx -d dev.gifalot.com
```

Follow prompts - it configures everything automatically!

### 4. Update Netlify

Change `REACT_APP_API_URL` to:
```
https://dev.gifalot.com/gif-j/
```

### 5. Done! ✅

Much better than ngrok!

## Why This is Better

- ✅ Permanent URL (no changes)
- ✅ Professional domain
- ✅ Free SSL (Let's Encrypt)
- ✅ No rate limits
- ✅ Solves Mixed Content error

**First step:** Point DNS for dev.gifalot.com to your VPS IP!


