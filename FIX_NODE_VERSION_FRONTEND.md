# Fix Node.js Version for Frontend Build

## Problem
`SyntaxError: Unexpected token ;` - Node.js version is too old for the dependencies.

## Solution

### Step 1: Check Node.js Version
```bash
node --version
npm --version
```

**Required:** Node.js 14+ (preferably 16+ or 18+)

### Step 2: Upgrade Node.js (if needed)

**Option A: Using nvm (Node Version Manager) - Recommended**
```bash
# Install nvm if not installed
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc

# Install and use Node.js 18
nvm install 18
nvm use 18

# Verify
node --version
```

**Option B: Using NodeSource repository**
```bash
# For Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Verify
node --version
```

**Option C: Using snap**
```bash
snap install node --classic
```

### Step 3: Clean and Reinstall Dependencies
```bash
cd /home/ansible/services/dev/gifalot/gif-j-react

# Remove old node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Reinstall with correct Node version
npm install
```

### Step 4: Build Again
```bash
rm -rf build node_modules/.cache
npm run build
```

### Step 5: Deploy to Nginx
```bash
rm -rf /var/www/html/*
cp -r build/* /var/www/html/
```

## Quick Fix (if nvm is available)

```bash
cd /home/ansible/services/dev/gifalot/gif-j-react && \
nvm install 18 && \
nvm use 18 && \
rm -rf node_modules package-lock.json && \
npm cache clean --force && \
npm install && \
rm -rf build node_modules/.cache && \
npm run build
```

## Check Current Node Version First

```bash
node --version
```

If it shows v10.x or v12.x, you need to upgrade. React Scripts 5.0.1 requires Node 14+.



