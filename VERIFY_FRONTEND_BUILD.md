# Verify Frontend Build Contains Updates

## Problem
Updates not showing after successful build and deployment.

## Verification Steps

### Step 1: Check if Version Code is in Build
```bash
cd /home/ansible/services/dev/gifalot/gif-j-react

# Check if version.js code is in the build
grep -r "getVersion\|REACT_APP_VERSION\|1.0.7" build/static/js/*.js | head -5
```

**Expected Result:**
- Should find references to version code
- Should find "1.0.7" or "v1.0.7"

### Step 2: Check if Sharing URL Code is Updated
```bash
# Check if window.location.origin is in the build (not netlify)
grep -r "window.location.origin" build/static/js/*.js | head -3
```

**Expected Result:**
- Should find "window.location.origin" references
- Should NOT find "gifalot.netlify.app" hardcoded

### Step 3: Check if Auto-advance Code is Updated
```bash
# Check if the new timer logic is in the build
grep -r "carouselRef.current.moveTo\|setTimeout.*nextIndex" build/static/js/*.js | head -3
```

**Expected Result:**
- Should find the updated auto-advance code

### Step 4: Verify Files Were Copied
```bash
# Check deployment timestamp
ls -la /var/www/html/index.html
ls -la /var/www/html/static/js/main.*.js

# Should show recent timestamps (just now)
```

### Step 5: Check Nginx is Serving New Files
```bash
# Restart nginx to ensure it's serving new files
systemctl restart nginx

# Or reload config
nginx -s reload
```

### Step 6: Verify in Browser
1. Open browser DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Hard refresh (Ctrl+Shift+R)
5. Check which JavaScript files are loaded
6. Look at the file names - should match the new build (main.3d8c4b7d.js)

### Step 7: Check Browser Console
```javascript
// In browser console, check if version function exists
// This won't work directly, but you can check the source
```

## Quick Diagnostic

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react && \
echo "=== Checking build files ===" && \
grep -r "1.0.7\|v1.0.7" build/static/js/*.js | head -3 && \
echo "=== Checking sharing URL ===" && \
grep -r "window.location.origin" build/static/js/*.js | head -3 && \
echo "=== Checking deployment ===" && \
ls -lh /var/www/html/static/js/main.*.js && \
echo "=== Restarting nginx ===" && \
systemctl restart nginx
```

## Common Issues

1. **Browser Cache**: Most common issue
   - Solution: Hard refresh (Ctrl+Shift+R) or clear cache

2. **Nginx Cache**: Nginx might be caching files
   - Solution: Restart nginx: `systemctl restart nginx`

3. **Old Build Files**: Build might not have included new code
   - Solution: Verify .env.production was set before building

4. **Service Worker**: If there's a service worker, it might cache old files
   - Solution: Unregister service worker in DevTools → Application → Service Workers


