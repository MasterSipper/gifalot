# Netlify API URL Setup - CRITICAL

## Problem

If you see `ERR_NAME_NOT_RESOLVED` errors in the browser console when accessing public compilation links, it means `REACT_APP_API_URL` is not set in Netlify.

**Error symptoms:**
- `Failed to load resource: net::ERR_NAME_NOT_RESOLVED`
- `collection/2/6:1 Failed to load resource`
- `file/2/6:1 Failed to load resource`

This happens because the frontend doesn't know where your backend API is located.

## Solution: Set REACT_APP_API_URL in Netlify

### Step 1: Go to Netlify Dashboard

1. Visit https://app.netlify.com
2. Select your site: **gifalot**
3. Go to **Site settings** → **Environment variables**

### Step 2: Add REACT_APP_API_URL

1. Click **Add a variable**
2. Set:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `http://38.242.204.63/gif-j/`
     - ⚠️ **Important:** Include the trailing slash `/`
     - This is your Contabo VPS backend URL
   - **Scopes:** ✅ All scopes (Production, Branch deploys, Deploy previews)
3. Click **Save variable**

### Step 3: Trigger New Deploy

**CRITICAL:** Environment variables are only available at build time, so you MUST trigger a new deploy:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Wait for deployment to complete (usually 2-5 minutes)

## Verify It's Working

After the new deploy completes:

1. Visit `https://gifalot.netlify.app`
2. Open browser console (F12)
3. Try to access a public compilation link
4. Check the console - you should see:
   - ✅ API calls to `http://38.242.204.63/gif-j/collection/...`
   - ❌ No more `ERR_NAME_NOT_RESOLVED` errors

## Current Backend URL

Based on your setup:
- **Backend URL:** `http://38.242.204.63/gif-j/`
- **Backend IP:** `38.242.204.63` (Contabo VPS)
- **Backend Port:** Default (likely 80 or 3000)

## Troubleshooting

### Still Getting ERR_NAME_NOT_RESOLVED

1. **Check environment variable is set:**
   - Go to Netlify → Site settings → Environment variables
   - Verify `REACT_APP_API_URL` exists and has the correct value
   - Make sure it includes the trailing slash: `http://38.242.204.63/gif-j/`

2. **Check you triggered a new deploy:**
   - Environment variables only work in NEW builds
   - Old builds won't have the variable
   - Go to Deploys tab and trigger a new deploy

3. **Check backend is accessible:**
   ```bash
   curl http://38.242.204.63/gif-j/collection/2/6
   ```
   Should return compilation data (or 403 if private, but not connection error)

4. **Check CORS settings:**
   - Backend must allow requests from `https://gifalot.netlify.app`
   - Check backend CORS configuration

### Backend Not Accessible

If `curl` fails or times out:
1. Check backend is running on Contabo VPS
2. Check firewall allows incoming connections on port 80/3000
3. Check backend is listening on `0.0.0.0` not just `localhost`

## Required Environment Variables for Netlify

For full functionality, you need these environment variables in Netlify:

1. **REACT_APP_API_URL** (REQUIRED)
   - Value: `http://38.242.204.63/gif-j/`
   - Purpose: Tells frontend where to find the backend API

2. **REACT_APP_PUBLIC_URL** (Optional but recommended)
   - Value: `https://gifalot.netlify.app`
   - Purpose: Used for generating shareable links that work on other computers

## Quick Checklist

- [ ] `REACT_APP_API_URL` is set in Netlify environment variables
- [ ] Value is `http://38.242.204.63/gif-j/` (with trailing slash)
- [ ] Variable is enabled for all scopes
- [ ] New deploy has been triggered after setting the variable
- [ ] Backend is accessible from internet (test with curl)
- [ ] CORS is configured on backend to allow Netlify domain

## After Setup

Once `REACT_APP_API_URL` is set and deployed:
- ✅ Public compilation links will work
- ✅ API calls will go to your Contabo backend
- ✅ No more `ERR_NAME_NOT_RESOLVED` errors
- ✅ Compilations will load correctly


