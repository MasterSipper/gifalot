# Fix Sharing Link Cache Issue

## Problem
The sharing modal still shows the old Netlify URL even after rebuilding.

## Solution: Force Fresh Build

### Step 1: Pull Latest Code on Server
**Command:**
```bash
cd /path/to/gif-j-react
git pull origin dev
```

**Expected Result:**
- Latest code pulled successfully
- Should see the change in `src/pages/dashboard/catalog/components/accessModal/index.jsx`

### Step 2: Clear Build Cache
**Command:**
```bash
# Remove old build
rm -rf build

# Clear npm cache (optional but recommended)
npm cache clean --force

# Remove node_modules/.cache if it exists
rm -rf node_modules/.cache
```

**Expected Result:**
- Old build files removed
- Cache cleared

### Step 3: Rebuild from Scratch
**Command:**
```bash
# Build with no cache
npm run build
```

**Expected Result:**
- Fresh build created
- No cached files used

### Step 4: Verify the Build
**Check the built file:**
```bash
grep -r "gifalot.netlify.app" build/static/js/*.js
```

**Expected Result:**
- No matches (the old URL should not be in the build)

**Check for window.location.origin:**
```bash
grep -r "window.location.origin" build/static/js/*.js
```

**Expected Result:**
- Should find matches (the new code should be in the build)

### Step 5: Deploy the New Build
**Copy to nginx directory:**
```bash
# Remove old files
rm -rf /var/www/html/*

# Copy new build
cp -r build/* /var/www/html/
```

**Or if using a different directory:**
```bash
# Adjust path as needed
cp -r build/* /path/to/nginx/html/
```

### Step 6: Clear Browser Cache
**On the client side:**
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"
4. Or use Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

**Alternative: Clear browser cache manually:**
- Chrome: Settings → Privacy → Clear browsing data → Cached images and files
- Firefox: Settings → Privacy → Clear Data → Cached Web Content
- Safari: Develop → Empty Caches

### Step 7: Verify It Works
**Test:**
1. Open the sharing modal
2. Check the URL in the input field
3. Should show: `https://dev.gifalot.com/#/{userId}/{folderId}/carousel`
4. Should NOT show: `https://gifalot.netlify.app/...`

## Quick One-Liner (if on server)

```bash
cd /path/to/gif-j-react && \
git pull origin dev && \
rm -rf build node_modules/.cache && \
npm run build && \
rm -rf /var/www/html/* && \
cp -r build/* /var/www/html/
```

## If Still Not Working

1. **Check if code was actually updated:**
   ```bash
   grep "window.location.origin" src/pages/dashboard/catalog/components/accessModal/index.jsx
   ```
   Should show the line with `window.location.origin`

2. **Check if REACT_APP_PUBLIC_URL is set:**
   ```bash
   cat .env.production
   ```
   If `REACT_APP_PUBLIC_URL` is set to the Netlify URL, that will override the fallback. Either remove it or set it to `https://dev.gifalot.com`

3. **Check browser console:**
   - Open DevTools (F12)
   - Check Console for any errors
   - Check Network tab to see which JavaScript files are being loaded
   - Verify the file timestamps are recent

4. **Check service worker (if any):**
   ```bash
   # Check if there's a service worker
   ls -la public/sw.js public/service-worker.js
   ```
   If service worker exists, it might be caching old files. Unregister it in browser DevTools → Application → Service Workers


