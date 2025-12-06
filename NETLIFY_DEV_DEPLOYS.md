# Netlify Dev Deploys Setup Guide

This guide explains how to set up automatic dev deployments (branch deploys and deploy previews) on Netlify.

## What are Dev Deploys?

Netlify supports three types of automatic deployments:

1. **Production Deploys** - Deploys from your production branch (usually `main` or `master`)
2. **Branch Deploys** - Automatically deploys other branches (like `dev`, `staging`, feature branches)
3. **Deploy Previews** - Automatically creates preview deployments for pull requests

## Prerequisites

- Your site is already connected to Netlify
- Your repository is linked in Netlify dashboard
- Basic Netlify deployment is working

## Configuration Steps

### 1. Enable Branch Deploys in Netlify Dashboard

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
4. Under **Branch deploys**, configure:

   **Option A: Deploy all branches**
   - Set **Branch deploys** to "All branches"
   - This will create preview deployments for every branch

   **Option B: Deploy specific branches (Recommended)**
   - Set **Branch deploys** to "Let me add individual branches"
   - Add branches you want to deploy (e.g., `dev`, `staging`)
   - Or use patterns like `dev/*` to deploy all branches starting with `dev/`

5. Under **Deploy previews**, ensure:
   - **Deploy previews** is enabled
   - This automatically creates preview deployments for pull requests

6. Click **Save**

### 2. Configure Environment Variables for Different Contexts

Environment variables can be set per deployment context (production, branch deploys, deploy previews).

1. Go to **Site settings** → **Environment variables**
2. Add environment variables for each context:

#### Production Context
- Click **Add a variable**
- Set **Scope** to **Production**
- Add variables like:
  - `REACT_APP_API_URL` = `https://your-production-backend.com/gif-j/`

#### Branch Deploys Context
- Click **Add a variable**
- Set **Scope** to **Branch deploys**
- Add variables like:
  - `REACT_APP_API_URL` = `https://your-dev-backend.com/gif-j/`

#### Deploy Previews Context
- Click **Add a variable**
- Set **Scope** to **Deploy previews**
- Add variables like:
  - `REACT_APP_API_URL` = `https://your-dev-backend.com/gif-j/`
  - Or use the same as branch deploys

#### All Contexts
- To apply a variable to all contexts, set **Scope** to **All contexts**
- Useful for variables that don't change (e.g., `NODE_VERSION`)

### 3. Configure Branch Deploy Settings (Optional)

You can configure which branches trigger deployments:

1. Go to **Site settings** → **Build & deploy** → **Continuous Deployment**
2. Under **Deploy contexts**, you can:

   - **Production branch**: Set which branch is your production branch (default: `main`)
   - **Branch deploys**: Configure which branches get deployed
   - **Deploy previews**: Enable/disable PR previews

3. **Ignored builds**: Add branch patterns to ignore (e.g., `dependabot/*`)

### 4. Configure Build Settings

The `netlify.toml` file has been updated to support different build contexts. The build configuration is already set up:

- **Production**: Uses production build settings
- **Branch deploys**: Uses same build settings as production
- **Deploy previews**: Uses same build settings as production

If you need different build commands or settings for different contexts, you can modify the `netlify.toml` file.

## Example Configuration

### Scenario: Dev and Staging Environments

**Branch Structure:**
- `main` → Production
- `develop` → Development environment
- `staging` → Staging environment
- Feature branches → Deploy previews

**Environment Variables:**

| Variable | Production | Branch Deploys | Deploy Previews |
|----------|-----------|----------------|-----------------|
| `REACT_APP_API_URL` | `https://api.gifalot.com/gif-j/` | `https://dev-api.gifalot.com/gif-j/` | `https://dev-api.gifalot.com/gif-j/` |
| `NODE_VERSION` | `18` | `18` (All contexts) | `18` (All contexts) |

**Netlify Dashboard Settings:**

1. **Production branch**: `main`
2. **Branch deploys**: Let me add individual branches
   - Add `develop`
   - Add `staging`
3. **Deploy previews**: Enabled

## How It Works

### Branch Deploys

1. When you push to a configured branch (e.g., `develop`):
   - Netlify automatically triggers a build
   - Uses environment variables scoped to "Branch deploys"
   - Creates a deployment with a URL like: `https://develop--your-site.netlify.app`
   - The branch name becomes part of the subdomain

### Deploy Previews

1. When you open a Pull Request:
   - Netlify automatically creates a deploy preview
   - Uses environment variables scoped to "Deploy previews"
   - Creates a unique URL like: `https://deploy-preview-123--your-site.netlify.app`
   - The PR number is included in the URL
   - The preview is automatically updated when you push new commits to the PR

### Production Deploys

1. When you merge to `main` (or your production branch):
   - Netlify creates a production deployment
   - Uses environment variables scoped to "Production"
   - Deploys to your main domain (e.g., `https://gifalot.netlify.app`)

## Testing Your Setup

1. **Test Branch Deploy:**
   ```bash
   git checkout -b test-branch
   git push origin test-branch
   ```
   - Check Netlify dashboard for the new deployment
   - Visit the branch deploy URL to verify it works

2. **Test Deploy Preview:**
   - Create a new branch and make some changes
   - Open a Pull Request
   - Check Netlify dashboard for the deploy preview
   - The preview URL will be shown in the PR comments (if GitHub integration is enabled)

3. **Test Production:**
   - Merge a PR to `main`
   - Verify the production deployment works correctly

## Best Practices

1. **Environment Variables:**
   - Use different backend URLs for dev/staging vs production
   - Keep sensitive keys out of code; use Netlify environment variables
   - Use the same environment variables for deploy previews and branch deploys if they should point to the same backend

2. **Branch Strategy:**
   - Use descriptive branch names for branch deploys
   - Consider using prefixes like `dev/`, `feature/`, `fix/`
   - Configure ignored builds for branches you don't want to deploy

3. **Build Optimization:**
   - Branch deploys and deploy previews use the same build process as production
   - This ensures they work the same way as production
   - If builds are slow, consider using build caching

4. **CORS Configuration:**
   - Make sure your backend CORS settings allow requests from:
     - Production domain: `https://gifalot.netlify.app`
     - Branch deploy domains: `https://*.netlify.app` (or specific subdomains)
     - Deploy preview domains: `https://deploy-preview-*.netlify.app`

## Troubleshooting

### Branch Deploy Not Triggering

1. Check that branch deploys are enabled in Netlify dashboard
2. Verify the branch name matches your configuration
3. Check the branch is not in the ignored builds list
4. Look at the Netlify build logs for errors

### Environment Variables Not Working

1. Verify the variable is set for the correct scope (Production/Branch deploys/Deploy previews)
2. Check the variable name matches exactly (case-sensitive)
3. Redeploy after changing environment variables (or trigger a new deploy)
4. Environment variables are only available at build time, not runtime

### Deploy Preview Not Creating

1. Ensure deploy previews are enabled
2. Check that the PR is from the same repository (forks may have limitations)
3. Verify your Netlify-GitHub integration is properly configured
4. Check for build errors that might prevent deployment

### Wrong Backend URL in Dev Deploy

1. Verify environment variables are set correctly for "Branch deploys" scope
2. Check that you're using the branch deploy URL, not production
3. Clear browser cache if you see cached production values
4. Rebuild the deployment after changing environment variables

## Additional Resources

- [Netlify Branch Deploys Documentation](https://docs.netlify.com/site-deploys/create-deploys/#branch-deploys)
- [Netlify Deploy Previews Documentation](https://docs.netlify.com/site-deploys/deploy-previews/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Netlify Build Contexts](https://docs.netlify.com/configure-builds/file-based-configuration/#deploy-contexts)

## Quick Reference

**Enable Branch Deploys:**
- Site settings → Build & deploy → Continuous Deployment → Branch deploys

**Set Environment Variables:**
- Site settings → Environment variables → Add variable → Choose scope

**View Deployments:**
- Deploys tab → See all deployments (production, branch, preview)

**Deployment URLs:**
- Production: `https://your-site.netlify.app`
- Branch: `https://branch-name--your-site.netlify.app`
- Preview: `https://deploy-preview-123--your-site.netlify.app`



