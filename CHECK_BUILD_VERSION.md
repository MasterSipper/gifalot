# Check Build for Version and Updates

## Verify Version is in Build

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react

# Check for version string "1.0.7" or "v1.0.7"
grep -o "v1\.0\.7\|1\.0\.7" build/static/js/*.js | head -3

# Check for sharing URL code (window.location.origin)
grep -o "window\.location\.origin" build/static/js/*.js | head -3

# Check file size and timestamp
ls -lh build/static/js/main.*.js
```

## If Version Not Found

The version might be using the default. Check what's actually in the built code:

```bash
# Search for any version pattern
grep -o "v[0-9]\+\.[0-9]\+\.[0-9]\+" build/static/js/*.js | sort -u
```

## Force Rebuild with Environment Variables

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react

# Set environment variables explicitly
export REACT_APP_VERSION=1.0.7
export REACT_APP_API_URL=https://dev.gifalot.com/gif-j/

# Clean and rebuild
rm -rf build node_modules/.cache
npm run build

# Verify version is in build
grep -o "1\.0\.7\|v1\.0\.7" build/static/js/*.js | head -1

# Deploy
rm -rf /var/www/html/*
cp -r build/* /var/www/html/
systemctl restart nginx
```

## Browser Cache Issue

If code is in build but not showing in browser:

1. **Hard refresh**: Ctrl+Shift+R or Cmd+Shift+R
2. **Clear cache**: Settings → Clear browsing data → Cached images
3. **Check DevTools Network tab**: 
   - Enable "Disable cache"
   - Check which JS file loads (should be main.3d8c4b7d.js)
   - Verify file timestamp is recent



