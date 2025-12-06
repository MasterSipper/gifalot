# Netlify Environment Variable Setup - Step by Step

## Configuration to Apply

- **Variable Name:** `REACT_APP_API_URL`
- **Variable Value:** `http://38.242.204.63/gif-j/`
- **Scope:** All scopes (Same value in all deploy contexts)

## Step-by-Step Instructions

### Step 1: Open Netlify Dashboard

1. Go to https://app.netlify.com
2. Log in to your account
3. Select your site (gifalot)

### Step 2: Navigate to Environment Variables

1. Click on **Site settings** (top menu bar, or from site overview)
2. In the left sidebar, click on **Environment variables**
3. You'll see the environment variables page

### Step 3: Add the Environment Variable

1. Click the **Add a variable** button (top right)
2. Fill in the form:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `http://38.242.204.63/gif-j/`
   - **Scopes:** 
     - ✅ Check **Production**
     - ✅ Check **Branch deploys**
     - ✅ Check **Deploy previews**
     - ✅ Check **All scopes** (this will automatically check all three above)
3. Click **Save variable**

### Step 4: Verify the Variable

After saving, you should see:
- Variable name: `REACT_APP_API_URL`
- Value: `http://38.242.204.63/gif-j/`
- Scopes: Production, Branch deploys, Deploy previews (all checked)

### Step 5: Trigger a New Deploy

Since environment variables are only available at build time, you need to trigger a new deploy:

1. Go to the **Deploys** tab (top menu)
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for the deploy to complete
4. Verify the deployment works correctly

## Verification

### Check Environment Variable is Set

1. Go to **Site settings** → **Environment variables**
2. Verify `REACT_APP_API_URL` is listed with value `http://38.242.204.63/gif-j/`
3. Verify all scopes are checked

### Check Build Logs

1. Go to **Deploys** tab
2. Click on the latest deploy
3. Click **Build log**
4. The environment variable should be available during build (though it won't be shown in logs for security)

### Test the Application

1. Visit your production site: `https://gifalot.netlify.app`
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Check for any API connection errors
5. Try using the app - it should connect to `http://38.242.204.63/gif-j/`

## Important Notes

### Environment Variables are Build-Time Only

- Environment variables starting with `REACT_APP_` are embedded into your React build
- They are only available at **build time**, not runtime
- You must **trigger a new deploy** after adding/changing environment variables
- Changes won't apply to existing deployments

### CORS Configuration Required

Make sure your backend allows requests from Netlify. Update your backend CORS configuration:

**Option 1: Environment Variable (Recommended)**

In your backend `.env` file on the VPS:
```env
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,https://gifalot.netlify.app,https://*.netlify.app
```

**Option 2: Code Update**

Update `gif-j-backend/src/main.ts` to support wildcard Netlify domains.

### Security Note

- The backend URL is visible in the built JavaScript bundle
- This is normal for frontend applications
- Consider setting up HTTPS for production use

## Troubleshooting

### Environment Variable Not Working

1. **Did you trigger a new deploy?** 
   - Environment variables only apply to new builds
   - Go to Deploys → Trigger deploy → Clear cache and deploy site

2. **Is the variable name correct?**
   - Must be exactly: `REACT_APP_API_URL`
   - Case-sensitive
   - Must start with `REACT_APP_` for React apps

3. **Check the build logs**
   - Go to Deploys → Latest deploy → Build log
   - Look for any errors

### API Calls Failing

1. **Check CORS errors in browser console**
   - Open DevTools (F12) → Console
   - Look for CORS errors
   - Update backend CORS configuration if needed

2. **Verify backend is accessible**
   ```bash
   curl http://38.242.204.63/gif-j/
   ```
   Should return a response (even if it's an error, it means the backend is reachable)

3. **Check network tab**
   - Open DevTools (F12) → Network tab
   - Look for failed requests to `http://38.242.204.63/gif-j/`
   - Check the error message

## Next Steps

After setting up the environment variable:

1. ✅ Trigger a new deploy
2. ✅ Test the production site
3. ✅ Update backend CORS to allow Netlify domains
4. ✅ Consider setting up HTTPS for your backend
5. ✅ Test branch deploys and deploy previews

## Quick Reference

**Variable to Add:**
- Key: `REACT_APP_API_URL`
- Value: `http://38.242.204.63/gif-j/`
- Scopes: All (Production, Branch deploys, Deploy previews)

**Backend URL:**
- `http://38.242.204.63/gif-j/`

**Frontend URL:**
- Production: `https://gifalot.netlify.app`
- Branch deploys: `https://branch-name--gifalot.netlify.app`
- Deploy previews: `https://deploy-preview-123--gifalot.netlify.app`


