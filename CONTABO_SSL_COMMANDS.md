# Contabo SSL Setup - Copy These Commands

## Once You Have VPS Access

### 1. Point DNS First

In your domain registrar:
- Add: `dev` → `38.242.204.63`
- Wait 15 minutes

### 2. Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 3. Get SSL Certificate

```bash
sudo certbot --nginx -d dev.gifalot.com
```

**Follow prompts:**
- Enter email
- Agree to terms
- Redirect HTTP to HTTPS? → **Yes**

### 4. Test Renewal

```bash
sudo certbot renew --dry-run
```

### 5. Restart Nginx

```bash
sudo systemctl restart nginx
```

### 6. Test It

```bash
curl https://dev.gifalot.com/gif-j/
```

### 7. Update Netlify

Change `REACT_APP_API_URL` to:
```
https://dev.gifalot.com/gif-j/
```

**Done!** ✅

## Your Setup

- Domain: `dev.gifalot.com`
- Server: Ubuntu (use apt commands)
- Web Server: Nginx (use certbot-nginx)
- Backend: Port 3001

## The Only Challenge

**Getting VPS access to run these commands!**

Once you have access (SSH/VNC/Console), it's just these 4 commands!




