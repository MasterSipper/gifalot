# Fix Netlify Deploying Main Instead of Dev

## Problem
When triggering a deploy in Netlify, it deploys `main` branch instead of `dev`.

## Solution: Change Production Branch in Netlify

### Option 1: Change Production Branch to Dev (Recommended)

1. **Go to Netlify Dashboard**:
   - https://app.netlify.com/sites/gifalot/settings/deploys

2. **Under "Production branch"**:
   - Change from `main` to `dev`
   - Click "Save"

3. **Under "Branch deploys"**:
   - Make sure "Deploy only the production branch" is **unchecked**
   - Or set it to deploy all branches

4. **Trigger a new deploy**:
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"
   - It should now deploy from `dev` branch

### Option 2: Deploy Specific Branch Manually

1. **Go to Netlify Dashboard** → Deploys
2. **Click "Trigger deploy"**
3. **Select "Deploy branch"**
4. **Choose `dev` branch**
5. **Click "Deploy"**

### Option 3: Configure Branch Deploys in netlify.toml

Update `netlify.toml` to explicitly configure branch deploys:

```toml
[build]
  base = "gif-j-react"
  publish = "gif-j-react/build"
  command = "npm ci && npm run build"

[build.environment]
  NODE_VERSION = "18"
  NPM_VERSION = "9"
  NPM_FLAGS = "--prefer-offline --no-audit"

# Production context (main branch)
[context.production]
  command = "npm ci && npm run build"

# Branch deploys (dev branch)
[context.branch-deploy]
  command = "npm ci && npm run build"

# Deploy previews (pull requests)
[context.deploy-preview]
  command = "npm ci && npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## Recommended: Change Production Branch to Dev

Since you're actively working on `dev` branch, the easiest solution is:

1. **Netlify Dashboard** → Site settings → Build & deploy
2. **Production branch**: Change `main` → `dev`
3. **Save**
4. **Trigger deploy** - it will now deploy from `dev`

## Verify Branch Deploys Are Enabled

1. **Netlify Dashboard** → Site settings → Build & deploy
2. **Branch deploys** section:
   - Make sure "Deploy only the production branch" is **unchecked**
   - Or enable "Deploy all branches"

This way, both `main` and `dev` will deploy, but `dev` will be the production branch.





