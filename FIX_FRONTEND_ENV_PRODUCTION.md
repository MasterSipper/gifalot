# Fix Frontend .env.production

## Frontend Directory Found
`/home/ansible/services/dev/gifalot/gif-j-react`

## Steps to Fix

### Step 1: Navigate to Frontend Directory
```bash
cd /home/ansible/services/dev/gifalot/gif-j-react
```

### Step 2: Check Current .env.production
```bash
cat .env.production
```

### Step 3: Update .env.production
**Option A: If file exists, add/update REACT_APP_PUBLIC_URL**
```bash
# Remove REACT_APP_PUBLIC_URL if it exists (to use window.location.origin fallback)
sed -i '/REACT_APP_PUBLIC_URL/d' .env.production

# Or set it to dev.gifalot.com
echo "REACT_APP_PUBLIC_URL=https://dev.gifalot.com" >> .env.production
```

**Option B: Create/Update the file**
```bash
cat > .env.production << EOF
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
# REACT_APP_PUBLIC_URL is not set - will use window.location.origin
EOF
```

### Step 4: Verify the File
```bash
cat .env.production
```

**Expected Result:**
```
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
```
(No REACT_APP_PUBLIC_URL line, or it's set to https://dev.gifalot.com)

### Step 5: Rebuild Frontend
```bash
# Clear old build and cache
rm -rf build node_modules/.cache

# Rebuild
npm run build
```

### Step 6: Deploy to Nginx
```bash
# Find where nginx serves files
# Common locations: /var/www/html, /usr/share/nginx/html, or check nginx config
nginx -T 2>/dev/null | grep root

# Copy build files
# Adjust path as needed
rm -rf /var/www/html/*
cp -r build/* /var/www/html/
```

## Quick One-Liner

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react && \
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production && \
rm -rf build node_modules/.cache && \
npm run build
```


