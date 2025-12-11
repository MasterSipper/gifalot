# Fix reCAPTCHA Login Issue - Exact Commands

## Your Container Name
`services-gif-j-backend-dev-app-1`

## Step 1: Check Current Status

```bash
docker exec services-gif-j-backend-dev-app-1 grep -A 2 "@Post('login')" /app/src/modules/auth/auth.controller.ts
```

This will show you if the `@Recaptcha` decorator is commented out or not.

## Step 2: If reCAPTCHA is NOT Commented Out

Edit the file to comment it out:

```bash
# Option A: Use sed to automatically comment it out
docker exec services-gif-j-backend-dev-app-1 sed -i 's/^[[:space:]]*@Recaptcha({ action: '\''login'\'' })/  \/\/ @Recaptcha({ action: '\''login'\'' }) \/\/ Temporarily disabled for debugging/' /app/src/modules/auth/auth.controller.ts

# Verify the change
docker exec services-gif-j-backend-dev-app-1 grep -A 2 "@Post('login')" /app/src/modules/auth/auth.controller.ts
```

## Step 3: Restart the Container

```bash
docker restart services-gif-j-backend-dev-app-1
```

## Step 4: Check Logs

```bash
docker logs services-gif-j-backend-dev-app-1 --tail 30
```

## Alternative: Manual Edit (if sed doesn't work)

```bash
# Enter the container
docker exec -it services-gif-j-backend-dev-app-1 sh

# Edit the file
nano /app/src/modules/auth/auth.controller.ts
# OR
vi /app/src/modules/auth/auth.controller.ts

# Find line 21, make sure it looks like:
#   // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging

# Save and exit (Ctrl+X, Y, Enter for nano, or :wq for vi)

# Exit container
exit

# Restart
docker restart services-gif-j-backend-dev-app-1
```

## What You Should See

After running Step 1, you should see:

```
  // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
  @Post('login')
```

If you see `@Recaptcha` without `//` in front, it needs to be commented out.

## Quick Test After Fix

1. Try logging in from https://gifalot.netlify.app
2. Should work now!





