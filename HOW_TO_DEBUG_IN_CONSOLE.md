# How to Run Debugging Scripts in Browser Console

## Step-by-Step Instructions

### 1. Open Browser Console
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
- **Safari**: Press `Cmd+Option+C` (Mac, requires enabling Developer menu first)

### 2. Navigate to Console Tab
- Click on the **"Console"** tab in the developer tools

### 3. Run the Debugging Scripts

After logging in (or when you get redirected back to login), copy and paste these commands one at a time into the console and press Enter:

#### Check for 401 Errors
```javascript
JSON.parse(sessionStorage.getItem('axios_401_errors') || '[]')
```
This will show you all API calls that got 401 Unauthorized errors.

#### Check for Missing Token Errors
```javascript
JSON.parse(sessionStorage.getItem('axios_missing_token') || '[]')
```
This will show you which API requests were made without an access token.

#### Check if User Data is Stored
```javascript
sessionStorage.getItem('user')
```
This shows if user data is in sessionStorage (returns the data or `null`).

```javascript
localStorage.getItem('user')
```
This shows if user data is in localStorage (returns the data or `null`).

#### Check if Tokens are Stored
```javascript
const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
if (userStr) {
  const user = JSON.parse(userStr);
  console.log('Access Token:', user.accessToken ? 'Present' : 'Missing');
  console.log('Refresh Token:', user.refreshToken ? 'Present' : 'Missing');
  console.log('User Data:', user.user);
} else {
  console.log('No user data found in storage');
}
```

#### View All Stored Debug Data
```javascript
console.log('=== DEBUG DATA ===');
console.log('401 Errors:', JSON.parse(sessionStorage.getItem('axios_401_errors') || '[]'));
console.log('Missing Token Errors:', JSON.parse(sessionStorage.getItem('axios_missing_token') || '[]'));
console.log('User in sessionStorage:', sessionStorage.getItem('user') ? 'Present' : 'Missing');
console.log('User in localStorage:', localStorage.getItem('user') ? 'Present' : 'Missing');
```

## Quick Copy-Paste Commands

Copy this entire block and paste it into the console to see everything at once:

```javascript
// Complete debug check
(function() {
  console.log('=== LOGIN DEBUG INFO ===');
  console.log('\n1. 401 Errors:');
  console.table(JSON.parse(sessionStorage.getItem('axios_401_errors') || '[]'));
  
  console.log('\n2. Missing Token Errors:');
  console.table(JSON.parse(sessionStorage.getItem('axios_missing_token') || '[]'));
  
  console.log('\n3. User Storage:');
  const sessionUser = sessionStorage.getItem('user');
  const localUser = localStorage.getItem('user');
  if (sessionUser) {
    const user = JSON.parse(sessionUser);
    console.log('sessionStorage:', {
      hasAccessToken: !!user.accessToken,
      hasRefreshToken: !!user.refreshToken,
      hasUser: !!user.user,
      userId: user.user?.id
    });
  } else {
    console.log('sessionStorage: No user data');
  }
  if (localUser) {
    const user = JSON.parse(localUser);
    console.log('localStorage:', {
      hasAccessToken: !!user.accessToken,
      hasRefreshToken: !!user.refreshToken,
      hasUser: !!user.user,
      userId: user.user?.id
    });
  } else {
    console.log('localStorage: No user data');
  }
})();
```

## What to Look For

1. **If you see 401 errors**: Note which API endpoint is failing (the `url` field)
2. **If you see missing token errors**: This means requests are being made before tokens are stored
3. **If user data is missing**: The login didn't store the data properly
4. **If tokens are missing**: The backend response might not include tokens, or they're not being stored

## Tips

- **Run these immediately after login** - before the redirect happens
- **Check the console logs** - Look for `[LOGIN]`, `[AXIOS]` messages
- **Take screenshots** - Capture the console output to share
- **Clear storage first** - If testing multiple times, run `sessionStorage.clear()` and `localStorage.clear()` first





