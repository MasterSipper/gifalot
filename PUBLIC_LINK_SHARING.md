# Public Link Sharing Setup

## Current Situation

You're creating compilations on **localhost**, but they're stored on your **Contabo VPS with MySQL**. To share links that work on other computers, you need to use your **Netlify frontend URL** instead of localhost.

## How Public Links Work

1. **Public Player Route**: `/:userId/:folderId/carousel`
2. **Link Format**: `https://gifalot.netlify.app/#/{userId}/{folderId}/carousel`
3. **Backend API**: Links fetch data from `http://38.242.204.63/gif-j/` (your Contabo VPS)

## Setup for Sharing Links

### Option 1: Use Netlify URL for All Links (Recommended)

Even when developing on localhost, generate links using the Netlify URL so they work on other computers.

**Add to `gif-j-react/.env`:**
```env
REACT_APP_PUBLIC_URL=https://gifalot.netlify.app
```

This way:
- You develop on `http://localhost:3000`
- But shared links use `https://gifalot.netlify.app`
- Links work on any computer

### Option 2: Use Current Origin (Development Only)

If you don't set `REACT_APP_PUBLIC_URL`, it will use `window.location.origin`:
- On localhost: `http://localhost:3000/#/userId/folderId/carousel` (only works on your computer)
- On Netlify: `https://gifalot.netlify.app/#/userId/folderId/carousel` (works everywhere)

## Requirements for Public Links to Work

1. **Compilation must be public**:
   - Click "Share compilation" in the dashboard
   - If it's private, click "Make public"
   - Only public compilations can be viewed without login

2. **Backend must be accessible**:
   - Your backend at `http://38.242.204.63/gif-j/` must be running
   - Backend must allow CORS from Netlify domain
   - Backend must be accessible from the internet

3. **Frontend must be deployed**:
   - Your Netlify site at `https://gifalot.netlify.app` must be deployed
   - Frontend must have `REACT_APP_API_URL` pointing to your backend

## Testing Public Links

1. **Create a compilation** on localhost (or Netlify)
2. **Make it public** (click "Share compilation" → "Make public")
3. **Copy the link** from the share modal
4. **Test on another computer**:
   - Open the link in a browser
   - Should load the carousel without requiring login
   - Should fetch data from your Contabo backend

## Link Format

The link format is:
```
https://gifalot.netlify.app/#/{userId}/{folderId}/carousel
```

Where:
- `{userId}` = Your user ID (number)
- `{folderId}` = The compilation/folder ID (number)

Example:
```
https://gifalot.netlify.app/#/1/123/carousel
```

## Backend Endpoints Used

When someone opens a public link, the frontend calls:

1. **Get Collection**: `GET /gif-j/collection/{userId}/{folderId}`
   - Returns compilation metadata
   - Checks if compilation is public
   - Returns 403 if private and user is not the owner

2. **Get Files**: `GET /gif-j/file/{userId}/{folderId}`
   - Returns all files/images in the compilation
   - Works for public compilations

## Troubleshooting

### Link doesn't work on another computer

1. **Check compilation is public**:
   - Go to dashboard
   - Click "Share compilation"
   - Make sure it says "public" or click "Make public"

2. **Check backend is running**:
   ```bash
   curl http://38.242.204.63/gif-j/collection/1/123
   ```
   Should return compilation data (not 404 or 401)

3. **Check CORS settings**:
   - Backend must allow requests from `https://gifalot.netlify.app`
   - Check `CORS_ORIGINS` in backend `.env`

4. **Check frontend is deployed**:
   - Visit `https://gifalot.netlify.app` directly
   - Should load the login page or app

### Link shows "Private compilation" error

- The compilation is marked as private
- Solution: Make it public in the dashboard

### Link shows 404 or "Not found"

- Check the userId and folderId are correct
- Check the compilation exists in the database
- Check the backend is running and accessible

## Quick Setup

1. **Add to `gif-j-react/.env`:**
   ```env
   REACT_APP_PUBLIC_URL=https://gifalot.netlify.app
   ```

2. **Restart frontend dev server** (if running)

3. **Create a compilation** and make it public

4. **Share the link** - it will use the Netlify URL and work on any computer!


