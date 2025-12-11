# Setup Cloudflare Tunnel for HTTPS Backend (Quick Guide)

This is the **easiest and fastest** way to get HTTPS on your backend without a domain.

## Step-by-Step Setup

### Step 1: Install Cloudflare Tunnel on VPS

SSH into your VPS:
```bash
ssh root@38.242.204.63
```

Install cloudflared:
```bash
# Download latest cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# Install
dpkg -i cloudflared-linux-amd64.deb

# Verify installation
cloudflared --version
```

### Step 2: Login to Cloudflare

```bash
cloudflared tunnel login
```

- Opens browser window
- Login with Cloudflare account (create free account if needed)
- Select domain or skip if using tunnel hostname

### Step 3: Create Tunnel

```bash
cloudflared tunnel create gifalot-backend
```

Save the tunnel ID shown (you'll need it).

### Step 4: Create Config File

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Add this configuration:

**Option A: Using Tunnel Hostname (No domain needed)**
```yaml
tunnel: gifalot-backend
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  - service: http://localhost:3001
```

Replace `<TUNNEL-ID>` with the actual tunnel ID from Step 3.

**Option B: Using Your Domain (If you have one)**
```yaml
tunnel: gifalot-backend
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: api.your-domain.com
    service: http://localhost:3001
  - service: http_status:404
```

### Step 5: Run Tunnel (Test First)

```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run gifalot-backend
```

You should see:
- A public URL like `https://<random>.cfargotunnel.com`
- Or your domain URL if configured

**Keep this terminal open** to test. In another terminal, test:
```bash
curl https://your-tunnel-url/gif-j/
```

### Step 6: Install as Service

Once tested, install as a systemd service:

```bash
cloudflared service install
systemctl enable cloudflared
systemctl start cloudflared
systemctl status cloudflared
```

### Step 7: Configure DNS (Optional - Only if using domain)

If you used a domain in the config:

```bash
cloudflared tunnel route dns gifalot-backend api.your-domain.com
```

### Step 8: Get Your HTTPS URL

**If using tunnel hostname:**
- Check tunnel logs: `journalctl -u cloudflared -f`
- Or check the URL from Step 5
- Format: `https://<random-id>.cfargotunnel.com`

**If using domain:**
- Use: `https://api.your-domain.com`

### Step 9: Update Netlify Environment Variable

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Update `REACT_APP_API_URL`:
   - **New value:** `https://your-tunnel-url/gif-j/`
   - **Scope:** All scopes
3. Save
4. Go to Deploys → Trigger deploy → Clear cache and deploy site

### Step 10: Update Backend CORS

Update your backend `.env` on the VPS:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Restart backend:
```bash
pm2 restart gifalot-backend
```

## Verify It Works

1. Check tunnel is running:
   ```bash
   systemctl status cloudflared
   ```

2. Test HTTPS endpoint:
   ```bash
   curl https://your-tunnel-url/gif-j/
   ```

3. Visit your Netlify site and check browser console - no more Mixed Content errors!

## Troubleshooting

### Tunnel Not Starting

```bash
# Check logs
journalctl -u cloudflared -n 50

# Restart service
systemctl restart cloudflared
```

### Connection Refused

- Make sure your backend is running: `pm2 status`
- Verify backend is on port 3001: `netstat -tulpn | grep 3001`

### Can't Access Tunnel URL

- Check tunnel is running: `systemctl status cloudflared`
- Verify config file path and tunnel name
- Check credentials file exists: `ls -la ~/.cloudflared/*.json`

## Your New Setup

- **Backend HTTPS URL:** `https://your-tunnel-url/gif-j/`
- **Frontend:** `https://gifalot.netlify.app`
- **No more Mixed Content errors!** ✅

## Quick Reference Commands

```bash
# Check tunnel status
systemctl status cloudflared

# View tunnel logs
journalctl -u cloudflared -f

# Restart tunnel
systemctl restart cloudflared

# List tunnels
cloudflared tunnel list

# Delete tunnel (if needed)
cloudflared tunnel delete gifalot-backend
```




