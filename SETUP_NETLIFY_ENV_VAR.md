# Setup Netlify Environment Variable - Quick Guide

## What to Configure

**Single environment variable for all contexts:**
- **Key:** `REACT_APP_API_URL`
- **Value:** `http://38.242.204.63/gif-j/`
- **Scopes:** All (Production, Branch deploys, Deploy previews)

## Steps (5 minutes)

### 1. Go to Netlify Dashboard
- Visit: https://app.netlify.com
- Select your site: **gifalot**

### 2. Open Environment Variables
- Click: **Site settings** (top menu)
- Click: **Environment variables** (left sidebar)

### 3. Add Variable
- Click: **Add a variable** (top right button)

Fill in:
- **Key:** `REACT_APP_API_URL`
- **Value:** `http://38.242.204.63/gif-j/`
- **Scopes:** 
  - ✅ Production
  - ✅ Branch deploys  
  - ✅ Deploy previews
  - ✅ Or check **"All scopes"** to apply to all

- Click: **Save variable**

### 4. Trigger New Deploy
- Go to: **Deploys** tab (top menu)
- Click: **Trigger deploy** → **Clear cache and deploy site**
- Wait for deploy to complete

### 5. Verify
- Visit: `https://gifalot.netlify.app`
- Open DevTools (F12) → Console
- Check for API connection errors

## Expected Result

After setup, you should see in Environment Variables:
```
REACT_APP_API_URL = http://38.242.204.63/gif-j/
Applied to: Production, Branch deploys, Deploy previews
```

## Important: Update Backend CORS

Your backend needs to allow requests from Netlify. Update your backend `.env` file on the VPS:

```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

Then restart your backend on the VPS.

## Troubleshooting

**Variable not working?**
- ✅ Did you trigger a new deploy? (Variables only apply to new builds)
- ✅ Is the variable name exactly `REACT_APP_API_URL`? (Case-sensitive)

**API calls failing?**
- ✅ Check browser console for CORS errors
- ✅ Verify backend is running: `curl http://38.242.204.63/gif-j/`
- ✅ Update backend CORS configuration (see above)

## Done! ✅

Once deployed, your Netlify site will connect to:
- `http://38.242.204.63/gif-j/` for all deployment contexts







