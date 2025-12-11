# Install Node.js 20 LTS for Frontend Build

## Recommended: Node.js 20 LTS (for production stability)

### Step 1: Install Node.js 20 LTS
**Using NodeSource (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
```

**Or if you prefer Node.js 25 (latest):**
```bash
curl -fsSL https://deb.nodesource.com/setup_25.x | bash -
apt-get install -y nodejs
```

### Step 2: Verify Installation
```bash
node --version
npm --version
```

**Expected Result:**
- Node.js v20.x.x (LTS) or v25.x.x
- npm v10.x.x or higher

### Step 3: Clean and Reinstall Frontend Dependencies
```bash
cd /home/ansible/services/dev/gifalot/gif-j-react

# Remove old node_modules
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Step 4: Build Frontend
```bash
# Ensure .env.production is set
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production

# Build
rm -rf build node_modules/.cache
npm run build
```

### Step 5: Deploy to Nginx
```bash
rm -rf /var/www/html/*
cp -r build/* /var/www/html/
```

## Quick One-Liner (Node 20 LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
apt-get install -y nodejs && \
cd /home/ansible/services/dev/gifalot/gif-j-react && \
rm -rf node_modules package-lock.json && \
npm cache clean --force && \
npm install && \
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production && \
rm -rf build node_modules/.cache && \
npm run build && \
rm -rf /var/www/html/* && \
cp -r build/* /var/www/html/
```

## Note

- **Node.js 20 LTS** is recommended for production (supported until April 2026)
- **Node.js 25** will work but is not LTS (may have breaking changes)
- React Scripts 5.0.1 works with Node 14+, but Node 18+ or 20+ is recommended


