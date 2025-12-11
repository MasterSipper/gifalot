# Complete Frontend Deployment

## Problem
- Version not showing in dashboard
- Still showing 1.0.6 in player
- Hardcoded URL in sharing modal

## Solution: Full Rebuild and Deploy

### Step 1: Pull Latest Code
```bash
cd /home/ansible/services/dev/gifalot/gif-j-react
git pull origin dev
```

### Step 2: Verify Code is Updated
```bash
# Check if getVersion is imported
grep -r "getVersion" src/ | head -3

# Check if sharing modal uses window.location.origin
grep -r "window.location.origin" src/pages/dashboard/catalog/components/accessModal/
```

### Step 3: Set Environment Variables
```bash
cat > .env.production << 'EOF'
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
REACT_APP_VERSION=1.0.7
EOF
```

### Step 4: Clean Build
```bash
# Remove old build and cache
rm -rf build node_modules/.cache

# Clear npm cache
npm cache clean --force
```

### Step 5: Rebuild
```bash
# Build with environment variables
npm run build
```

### Step 6: Verify Build Contains Updates
```bash
# Check version is in build
grep -o "1\.0\.7\|v1\.0\.7" build/static/js/*.js | head -1

# Check sharing URL code
grep -o "window\.location\.origin" build/static/js/*.js | head -1
```

### Step 7: Deploy
```bash
# Remove old files
rm -rf /var/www/html/*

# Copy new build
cp -r build/* /var/www/html/

# Set permissions
chown -R www-data:www-data /var/www/html/
chmod -R 755 /var/www/html/
```

### Step 8: Restart Nginx (if needed)
```bash
systemctl restart nginx
```

## Quick One-Liner

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react && \
git pull origin dev && \
cat > .env.production << 'EOF'
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
REACT_APP_VERSION=1.0.7
EOF
rm -rf build node_modules/.cache && \
npm cache clean --force && \
npm run build && \
grep -o "1\.0\.7" build/static/js/*.js | head -1 && \
rm -rf /var/www/html/* && \
cp -r build/* /var/www/html/ && \
chown -R www-data:www-data /var/www/html/ && \
echo "Deployment complete! Clear browser cache (Ctrl+Shift+R)"
```

## After Deployment

**Clear browser cache completely:**
1. Open DevTools (F12)
2. Right-click refresh button → "Empty Cache and Hard Reload"
3. Or use incognito window

**Verify:**
- Sidebar shows "v1.0.7"
- Player shows "v1.0.7" (not 1.0.6)
- Sharing modal uses `dev.gifalot.com` (not netlify)



