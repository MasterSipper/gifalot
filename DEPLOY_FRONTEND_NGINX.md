# Deploy Frontend to Nginx

## Important: Frontend is NOT in Docker

The frontend is served directly by **Nginx**, not Docker. You don't use `docker compose` for the frontend.

## Deployment Steps

### Step 1: Pull Latest Code
```bash
cd /home/ansible/services/dev/gifalot/gif-j-react
git pull origin dev
```

### Step 2: Set Environment Variables
```bash
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production
echo "REACT_APP_VERSION=1.0.7" >> .env.production
```

### Step 3: Build Frontend
```bash
rm -rf build node_modules/.cache
npm run build
```

**Expected Result:**
- Build completes successfully
- `build/` directory created with static files

### Step 4: Deploy to Nginx
```bash
# Remove old files
rm -rf /var/www/html/*

# Copy new build
cp -r build/* /var/www/html/

# Set proper permissions
chown -R www-data:www-data /var/www/html/
chmod -R 755 /var/www/html/
```

### Step 5: Verify Deployment
```bash
# Check files are there
ls -la /var/www/html/

# Should see: index.html, static/, etc.
```

### Step 6: Clear Browser Cache
On your browser:
- Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or open DevTools → Right-click refresh → "Empty Cache and Hard Reload"

## Quick One-Liner

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react && \
git pull origin dev && \
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production && \
echo "REACT_APP_VERSION=1.0.7" >> .env.production && \
rm -rf build node_modules/.cache && \
npm run build && \
rm -rf /var/www/html/* && \
cp -r build/* /var/www/html/ && \
chown -R www-data:www-data /var/www/html/ && \
chmod -R 755 /var/www/html/
```

## Troubleshooting Version Not Showing

If version still shows old value:

1. **Check .env.production:**
   ```bash
   cat .env.production
   ```
   Should show:
   ```
   REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
   REACT_APP_VERSION=1.0.7
   ```

2. **Verify build includes version:**
   ```bash
   grep -r "1.0.7" build/static/js/*.js
   ```
   Should find the version in the built files

3. **Clear browser cache completely:**
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content

4. **Check browser console:**
   - Open DevTools (F12)
   - Check Console for any errors
   - Check if version.js is loaded

## Note

- Frontend uses **Nginx** (not Docker)
- Backend uses **Docker Compose**
- Version is set via `REACT_APP_VERSION` in `.env.production`



