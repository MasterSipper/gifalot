# Backend URLs for Netlify Environment Variables

This document contains the backend URLs you should use when configuring Netlify environment variables for different deployment contexts.

## Your Backend URLs

### Production Backend (Contabo VPS)

**Base URL:** `http://38.242.204.63/gif-j/`

**Full API URL:** `http://38.242.204.63/gif-j/`

**Note:** 
- This is your Contabo VPS IP address
- If you set up SSL/HTTPS, use: `https://your-domain.com/gif-j/` or `https://38.242.204.63/gif-j/` (if SSL is configured for IP)
- The backend runs on port 3001 internally but is exposed via Nginx on port 80/443 with the `/gif-j/` path prefix

### Development/Staging Backend

**Option 1: Use Production Backend (Same as production)**
- `http://38.242.204.63/gif-j/`
- *Use this if you want branch deploys and previews to use the same backend*

**Option 2: Use Local Development Backend** *(Not accessible from Netlify)*
- `http://localhost:3000/gif-j/` or `http://localhost:3001/gif-j/`
- *Note: This won't work from Netlify since localhost isn't accessible externally*

**Option 3: Create Separate Dev Backend**
- If you deploy a separate dev instance, use that URL
- Example: `http://dev-backend.your-domain.com/gif-j/` or `http://38.242.204.64/gif-j/` (different IP)

### Local Development

**For local development on your machine:**
- `http://localhost:3000/gif-j/` or `http://localhost:3001/gif-j/`
- Configured in `gif-j-react/.env` file locally

## Recommended Configuration for Netlify

### Current Setup (Single Backend)

Since you have one backend deployed, use the same URL for all contexts:

| Context | Environment Variable | Value |
|---------|---------------------|-------|
| **Production** | `REACT_APP_API_URL` | `http://38.242.204.63/gif-j/` |
| **Branch deploys** | `REACT_APP_API_URL` | `http://38.242.204.63/gif-j/` |
| **Deploy previews** | `REACT_APP_API_URL` | `http://38.242.204.63/gif-j/` |

### Future Setup (Separate Dev Backend)

If you set up a separate development backend later:

| Context | Environment Variable | Value |
|---------|---------------------|-------|
| **Production** | `REACT_APP_API_URL` | `http://38.242.204.63/gif-j/` (or `https://api.gifalot.com/gif-j/`) |
| **Branch deploys** | `REACT_APP_API_URL` | `http://dev-backend-ip/gif-j/` (or separate dev URL) |
| **Deploy previews** | `REACT_APP_API_URL` | `http://dev-backend-ip/gif-j/` (same as branch deploys) |

## Setting Up in Netlify Dashboard

### Step 1: Production Environment Variable

1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable**
3. Set:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `http://38.242.204.63/gif-j/`
   - **Scope:** **Production**
4. Click **Save**

### Step 2: Branch Deploys Environment Variable

1. Click **Add a variable** again
2. Set:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `http://38.242.204.63/gif-j/` (or your dev backend URL)
   - **Scope:** **Branch deploys**
3. Click **Save**

### Step 3: Deploy Previews Environment Variable

1. Click **Add a variable** again
2. Set:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `http://38.242.204.63/gif-j/` (or your dev backend URL)
   - **Scope:** **Deploy previews**
3. Click **Save**

## Important Notes

### HTTPS vs HTTP

- Currently using **HTTP** (`http://`) 
- For production, you should set up SSL/HTTPS:
  - Use Let's Encrypt to get an SSL certificate
  - Update the URL to `https://your-domain.com/gif-j/` or `https://38.242.204.63/gif-j/`
  - HTTPS is required for production apps

### CORS Configuration

Make sure your backend CORS settings allow requests from:
- Production: `https://gifalot.netlify.app`
- Branch deploys: `https://*.netlify.app` (or specific subdomains)
- Deploy previews: `https://deploy-preview-*.netlify.app`

Current backend CORS configuration (from `gif-j-backend/src/main.ts`):
```typescript
origin: ['http://localhost:3000', 'http://localhost:3001', 'https://gifalot.netlify.app']
```

You may need to update this to allow all Netlify subdomains:
```typescript
origin: [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://gifalot.netlify.app',
  /^https:\/\/.*--gifalot\.netlify\.app$/,  // Branch deploys
  /^https:\/\/deploy-preview-\d+--gifalot\.netlify\.app$/  // Deploy previews
]
```

Or use environment variable:
```env
CORS_ORIGINS=https://gifalot.netlify.app,https://*.netlify.app,http://localhost:3000,http://localhost:3001
```

### Testing Your Backend

Test if your backend is accessible:

```bash
# Test from command line
curl http://38.242.204.63/gif-j/

# Or visit in browser
http://38.242.204.63/gif-j/collection
```

If you get a response, your backend is accessible and ready to use.

## Quick Reference

**Production Backend:**
- IP: `38.242.204.63`
- URL: `http://38.242.204.63/gif-j/`
- Port: 80 (HTTP) or 443 (HTTPS with SSL)
- Internal port: 3001

**Frontend (Netlify):**
- Production: `https://gifalot.netlify.app`
- Branch deploys: `https://branch-name--gifalot.netlify.app`
- Deploy previews: `https://deploy-preview-123--gifalot.netlify.app`

**Local Development:**
- Backend: `http://localhost:3000/gif-j/` or `http://localhost:3001/gif-j/`
- Frontend: `http://localhost:3000` (or next available port)



