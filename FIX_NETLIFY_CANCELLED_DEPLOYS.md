# Fix Netlify Cancelled Deploys

## Common Causes

1. **Build Timeout** - Build takes too long (default is 15 minutes)
2. **Build Errors** - Compilation fails
3. **Manual Cancellation** - Someone cancelled the deploy
4. **Configuration Issues** - Wrong build settings

## Step 1: Check Build Logs

1. Go to Netlify Dashboard → Your Site → Deploys
2. Click on the cancelled deploy
3. Check the "Build log" tab
4. Look for:
   - Error messages
   - Timeout messages
   - Build failures

## Step 2: Add Build Timeout (if needed)

Update `netlify.toml`:

```toml
[build]
  base = "gif-j-react"
  publish = "gif-j-react/build"
  command = "npm install && npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"

# Increase build timeout (in seconds, max 900 = 15 minutes)
[build.processing]
  skip_processing = false

# Production context (main branch)
[context.production]
  command = "npm install && npm run build"

# Branch deploys (all branches except main)
[context.branch-deploy]
  command = "npm install && npm run build"
  # Add timeout for branch deploys
  [context.branch-deploy.processing]
    skip_processing = false

# Deploy previews (pull requests)
[context.deploy-preview]
  command = "npm install && npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Step 3: Optimize Build Performance

If builds are timing out, optimize:

### Option A: Use npm ci instead of npm install

Update `netlify.toml`:

```toml
[build]
  command = "npm ci && npm run build"
```

### Option B: Cache node_modules

Netlify automatically caches `node_modules` between builds, but you can ensure it's working:

1. Go to Netlify Dashboard → Site settings → Build & deploy
2. Under "Build settings", check "Clear cache and deploy site" is NOT checked
3. Netlify will cache dependencies automatically

### Option C: Reduce Build Time

If the build is still slow:

1. Check for large dependencies
2. Use `npm ci` instead of `npm install` (faster, more reliable)
3. Consider splitting the build into smaller steps

## Step 4: Check for Build Errors

Common React build errors:

1. **Syntax Errors** - Check console for compilation errors
2. **Missing Dependencies** - Ensure all packages are in package.json
3. **Environment Variables** - Make sure required env vars are set in Netlify

## Step 5: Manual Deploy Test

Try triggering a manual deploy:

1. Go to Netlify Dashboard → Deploys
2. Click "Trigger deploy" → "Clear cache and deploy site"
3. Watch the build log in real-time
4. See where it fails or gets cancelled

## Step 6: Check Netlify Settings

1. Go to Netlify Dashboard → Site settings → Build & deploy
2. Check:
   - Build command is correct
   - Publish directory is `gif-j-react/build`
   - Base directory is `gif-j-react`
   - Node version matches (should be 18)

## Quick Fix: Update netlify.toml

If builds are consistently timing out, try this optimized version:

```toml
[build]
  base = "gif-j-react"
  publish = "gif-j-react/build"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
  NPM_FLAGS = "--prefer-offline --no-audit"

[context.production]
  command = "npm ci && npm run build"

[context.branch-deploy]
  command = "npm ci && npm run build"

[context.deploy-preview]
  command = "npm ci && npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## If Still Cancelled

1. **Check Netlify Status** - https://www.netlifystatus.com/
2. **Check Build Logs** - Look for specific error messages
3. **Try Manual Deploy** - See if it's automatic vs manual
4. **Contact Netlify Support** - If it's a platform issue

## Most Likely Issue

If you're seeing "cancelled" without errors, it's likely:
- **Build timeout** - Build takes longer than 15 minutes
- **Manual cancellation** - Someone cancelled it in the dashboard
- **Auto-cancellation** - Netlify cancels if a new commit is pushed during build

## Next Steps

1. Check the build logs for the cancelled deploy
2. Share any error messages you see
3. Try the optimized `netlify.toml` above
4. Trigger a manual deploy and watch it




