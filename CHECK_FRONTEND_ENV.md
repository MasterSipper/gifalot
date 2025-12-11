# Check Frontend Environment Variables

## Problem
Looking for `.env.production` in the wrong directory (backend instead of frontend).

## Solution

### Step 1: Navigate to Frontend Directory
**Command:**
```bash
cd /path/to/gif-j-react
```

**Or if it's in a different location:**
```bash
# Find the frontend directory
find /home -name "gif-j-react" -type d 2>/dev/null
```

### Step 2: Check for .env.production
**Command:**
```bash
cat .env.production | grep REACT_APP_PUBLIC_URL
```

**Or check if file exists:**
```bash
ls -la .env.production
```

**Expected Result:**
- If file exists: Shows the REACT_APP_PUBLIC_URL value (or nothing if not set)
- If file doesn't exist: "No such file or directory"

### Step 3: Check All Environment Files
**Command:**
```bash
ls -la .env*
```

**Expected Result:**
- Lists all .env files (.env, .env.production, .env.local, etc.)

### Step 4: If .env.production Doesn't Exist
**Create it:**
```bash
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production
echo "REACT_APP_PUBLIC_URL=https://dev.gifalot.com" >> .env.production
```

**Or leave REACT_APP_PUBLIC_URL unset** (it will use `window.location.origin` as fallback):
```bash
echo "REACT_APP_API_URL=https://dev.gifalot.com/gif-j/" > .env.production
```

### Step 5: Rebuild Frontend
**Command:**
```bash
rm -rf build node_modules/.cache
npm run build
```

## Common Frontend Locations

The frontend might be in:
- `/home/ansible/services/dev/gif-j-react`
- `/var/www/gif-j-react`
- `/opt/gif-j-react`
- Or wherever you deployed it

## Quick Check

```bash
# Find frontend directory
find /home -name "package.json" -path "*/gif-j-react/*" 2>/dev/null | head -1

# Then navigate there and check
cd $(dirname $(find /home -name "package.json" -path "*/gif-j-react/*" 2>/dev/null | head -1))
cat .env.production 2>/dev/null || echo "No .env.production file found"
```


