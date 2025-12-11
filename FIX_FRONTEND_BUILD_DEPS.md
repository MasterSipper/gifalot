# Fix Frontend Build - Missing Dependencies

## Problem
`react-scripts: not found` - `node_modules` is missing.

## Solution

### Step 1: Install Dependencies
```bash
cd /home/ansible/services/dev/gifalot/gif-j-react
npm install
```

**Expected Result:**
- Dependencies installed
- `node_modules` directory created
- May take several minutes

### Step 2: Create .env.production
```bash
cat > .env.production << 'EOF'
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
EOF
```

### Step 3: Build Frontend
```bash
rm -rf build node_modules/.cache
npm run build
```

**Expected Result:**
- Build completes successfully
- `build/` directory created

### Step 4: Deploy to Nginx
```bash
# Find nginx root directory
nginx -T 2>/dev/null | grep "root " | head -1

# Copy build files (adjust path as needed)
rm -rf /var/www/html/*
cp -r build/* /var/www/html/
```

## Quick One-Liner

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react && \
npm install && \
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production && \
rm -rf build node_modules/.cache && \
npm run build
```

## Note

If `npm install` fails or takes too long, you might want to:
1. Check Node.js version: `node --version` (should be 14+)
2. Clear npm cache: `npm cache clean --force`
3. Use `npm ci` instead of `npm install` for faster, reliable installs (requires package-lock.json)



