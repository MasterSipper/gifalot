# Netlify Deployment Guide

## Issue: Empty Page on Netlify

If you're seeing an empty page on Netlify, it's likely due to missing environment variables or incorrect API configuration.

## Required Steps

### 1. Set Environment Variables in Netlify

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (gifalot)
3. Go to **Site settings** → **Environment variables**
4. Add the following environment variable:

```
REACT_APP_API_URL = https://your-backend-domain.com/gif-j/
```

**Important:** Replace `https://your-backend-domain.com/gif-j/` with your actual backend URL.

### 2. Verify Build Settings

In Netlify dashboard → **Site settings** → **Build & deploy**:

- **Base directory:** `gif-j-react` (or leave empty if root is `gif-j-react`)
- **Build command:** `npm install && npm run build`
- **Publish directory:** `gif-j-react/build` (or `build` if base directory is `gif-j-react`)

### 3. Redeploy

After setting environment variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**

## Troubleshooting

### Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors. Common issues:

1. **CORS errors:** Backend needs to allow requests from `https://gifalot.netlify.app`
2. **404 errors:** API URL is incorrect
3. **Network errors:** Backend is not accessible

### Verify Build Output

1. In Netlify dashboard, go to **Deploys**
2. Click on the latest deploy
3. Check the **Build log** for any errors
4. Check the **Deploy log** for any issues

### Common Issues

#### Issue: "Failed to fetch" or CORS errors
**Solution:** Update your backend CORS configuration to include `https://gifalot.netlify.app`

#### Issue: API calls going to localhost
**Solution:** Make sure `REACT_APP_API_URL` is set correctly in Netlify environment variables

#### Issue: Build succeeds but page is blank
**Solution:** 
- Check browser console for JavaScript errors
- Verify `index.html` is being served correctly
- Check that all assets are loading (Network tab in DevTools)

## Testing Locally with Production Build

To test the production build locally:

```bash
cd gif-j-react
npm run build
npx serve -s build
```

Then visit `http://localhost:3000` and check the console for errors.

## Next Steps

1. Set up your backend on a production server (e.g., Railway, Render, DigitalOcean)
2. Update `REACT_APP_API_URL` in Netlify to point to your production backend
3. Ensure your backend CORS settings allow requests from `https://gifalot.netlify.app`
4. Redeploy the frontend


