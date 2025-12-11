# Quick Fix: Enable HTTPS for Backend

## The Problem

Your frontend is HTTPS, backend is HTTP → Browser blocks the connection.

## Fastest Solution: Cloudflare Tunnel (5 minutes)

### Quick Setup

**1. On your VPS, install cloudflared:**

```bash
ssh root@38.242.204.63

# Install
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared-linux-amd64.deb
```

**2. Login to Cloudflare (creates free account if needed):**

```bash
cloudflared tunnel login
```
- Opens browser, login/register
- Authorize the tunnel

**3. Create tunnel:**

```bash
cloudflared tunnel create gifalot-backend
```
- Copy the tunnel ID shown

**4. Create config:**

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste this (replace `<TUNNEL-ID>` with actual ID):
```yaml
tunnel: gifalot-backend
credentials-file: /root/.cloudflared/<TUNNEL-ID>.json

ingress:
  - service: http://localhost:3001
```

**5. Test it:**

```bash
cloudflared tunnel --config ~/.cloudflared/config.yml run gifalot-backend
```

You'll see a URL like: `https://abc123-xyz.cfargotunnel.com`
- Copy this URL
- Test: `curl https://abc123-xyz.cfargotunnel.com/gif-j/`

**6. Install as service:**

```bash
cloudflared service install
systemctl start cloudflared
systemctl enable cloudflared
```

**7. Update Netlify:**

- Go to Netlify → Site settings → Environment variables
- Update `REACT_APP_API_URL` to: `https://abc123-xyz.cfargotunnel.com/gif-j/`
- Trigger new deploy

**Done!** ✅

Your backend is now HTTPS accessible.

## Alternative: If You Have a Domain

If you have a domain pointing to `38.242.204.63`, use Let's Encrypt:

```bash
# On VPS
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.your-domain.com
```

Then update Netlify to: `https://api.your-domain.com/gif-j/`

---

**Need the full detailed guide?** See `SETUP_CLOUDFLARE_TUNNEL.md`




