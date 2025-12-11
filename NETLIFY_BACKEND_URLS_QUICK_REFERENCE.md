# Quick Reference: Backend URLs for Netlify

## Your Backend URL

```
http://38.242.204.63/gif-j/
```

## Netlify Environment Variables Setup

In Netlify Dashboard → Site settings → Environment variables:

### Add these 3 variables (all with the same URL for now):

1. **Production**
   - Key: `REACT_APP_API_URL`
   - Value: `http://38.242.204.63/gif-j/`
   - Scope: **Production**

2. **Branch Deploys**
   - Key: `REACT_APP_API_URL`
   - Value: `http://38.242.204.63/gif-j/`
   - Scope: **Branch deploys**

3. **Deploy Previews**
   - Key: `REACT_APP_API_URL`
   - Value: `http://38.242.204.63/gif-j/`
   - Scope: **Deploy previews**

## Important: CORS Configuration

Make sure your backend allows requests from Netlify domains. Update your backend `.env` file:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Or update `gif-j-backend/src/main.ts` to support wildcard Netlify domains.

## Test Your Backend

```bash
curl http://38.242.204.63/gif-j/
```

If you get a response, your backend is ready!

## After Setting Up HTTPS

Once you configure SSL/HTTPS on your VPS, update all URLs to:
- `https://your-domain.com/gif-j/` (if you have a domain)
- Or `https://38.242.204.63/gif-j/` (if SSL is configured for IP)







