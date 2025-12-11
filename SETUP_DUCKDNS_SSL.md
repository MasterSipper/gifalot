# Setup DuckDNS + Let's Encrypt (Free, Permanent HTTPS)

This gives you a free, permanent HTTPS URL for your backend - better than ngrok's changing URLs.

## Step 1: Get DuckDNS Subdomain

1. Go to: https://www.duckdns.org
2. Sign in with GitHub or Google (free)
3. Create a subdomain: `gifalot-backend`
4. Full domain will be: `gifalot-backend.duckdns.org`
5. Set IP to: `38.242.204.63`
6. Copy your token from the page

## Step 2: Update IP Automatically (Optional but Recommended)

SSH into your VPS:
```bash
ssh root@38.242.204.63
```

Create update script:
```bash
nano /usr/local/bin/update-duckdns.sh
```

Add (replace `YOUR_TOKEN` and `gifalot-backend`):
```bash
#!/bin/bash
DOMAIN="gifalot-backend"
TOKEN="YOUR_TOKEN_HERE"
echo url="https://www.duckdns.org/update?domains=$DOMAIN&token=$TOKEN&ip=" | curl -k -o /tmp/duckdns.log -K -
```

Make executable:
```bash
chmod +x /usr/local/bin/update-duckdns.sh
```

Test it:
```bash
/usr/local/bin/update-duckdns.sh
cat /tmp/duckdns.log
# Should show: OK
```

Add to crontab (updates every 5 minutes):
```bash
crontab -e
# Add this line:
*/5 * * * * /usr/local/bin/update-duckdns.sh >/dev/null 2>&1
```

## Step 3: Wait for DNS Propagation

Wait a few minutes for DNS to propagate. Test:
```bash
nslookup gifalot-backend.duckdns.org
# Should show: 38.242.204.63
```

Or:
```bash
ping gifalot-backend.duckdns.org
# Should ping your IP
```

## Step 4: Install Certbot

```bash
apt update
apt install -y certbot python3-certbot-nginx
```

## Step 5: Update Nginx Configuration

Make sure your Nginx config is ready:
```bash
nano /etc/nginx/sites-available/gifalot-backend
```

Should have:
```nginx
server {
    listen 80;
    server_name gifalot-backend.duckdns.org;

    client_max_body_size 20M;

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

Test config:
```bash
nginx -t
```

Reload if needed:
```bash
systemctl reload nginx
```

## Step 6: Get SSL Certificate

```bash
certbot --nginx -d gifalot-backend.duckdns.org
```

Follow prompts:
- Enter email address
- Agree to terms
- Choose whether to redirect HTTP to HTTPS (recommend: Yes)

Certbot will:
- Get SSL certificate from Let's Encrypt
- Configure Nginx automatically
- Set up auto-renewal

## Step 7: Verify SSL

Test HTTPS:
```bash
curl https://gifalot-backend.duckdns.org/gif-j/
```

Should work without certificate errors.

## Step 8: Test Auto-Renewal

SSL certificates expire every 90 days, but Certbot auto-renews them. Test:

```bash
certbot renew --dry-run
```

Should show: "The dry run was successful."

## Step 9: Update Netlify Environment Variable

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Update `REACT_APP_API_URL`:
   - **New value:** `https://gifalot-backend.duckdns.org/gif-j/`
   - **Scope:** All scopes
3. Save
4. Trigger new deploy

## Step 10: Update Backend CORS

Update backend `.env`:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Restart backend:
```bash
pm2 restart gifalot-backend
```

## Verify Everything Works

1. **Check SSL certificate:**
   ```bash
   curl -I https://gifalot-backend.duckdns.org/gif-j/
   ```

2. **Check backend responds:**
   ```bash
   curl https://gifalot-backend.duckdns.org/gif-j/collection
   ```

3. **Visit Netlify site** - should work without Mixed Content errors!

## Troubleshooting

### DNS Not Resolving

```bash
# Check DNS
nslookup gifalot-backend.duckdns.org

# Update manually in DuckDNS dashboard
# Wait 5-10 minutes for propagation
```

### Certbot Fails

```bash
# Make sure port 80 is open
ufw allow 80/tcp

# Make sure Nginx is running
systemctl status nginx

# Check Nginx config
nginx -t

# Try certbot with verbose output
certbot --nginx -d gifalot-backend.duckdns.org --verbose
```

### Certificate Not Auto-Renewing

```bash
# Check renewal timer
systemctl status certbot.timer

# Enable if needed
systemctl enable certbot.timer
systemctl start certbot.timer
```

## Benefits of This Setup

- ✅ **Free** - No cost at all
- ✅ **Permanent** - URL doesn't change
- ✅ **Auto-renewal** - SSL renews automatically
- ✅ **Professional** - Uses proper SSL certificate
- ✅ **Reliable** - No third-party tunnel service

## Next Steps

Your backend now has:
- ✅ Permanent HTTPS URL
- ✅ Valid SSL certificate
- ✅ Auto-renewing SSL
- ✅ No dependency on tunnel services

Perfect for production use! 🎉




