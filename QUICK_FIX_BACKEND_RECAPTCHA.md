# Quick Fix: Disable reCAPTCHA for Login (No Git Required)

## Simple One-Command Fix

SSH into your VPS and run:

```bash
# Find the container name first
CONTAINER=$(docker ps --format "{{.Names}}" | grep -i "backend\|app" | head -1)

# Edit the file inside the container to ensure reCAPTCHA is commented out
docker exec $CONTAINER sed -i 's/^[[:space:]]*@Recaptcha({ action: '\''login'\'' })/  \/\/ @Recaptcha({ action: '\''login'\'' }) \/\/ Temporarily disabled for debugging/' /app/src/modules/auth/auth.controller.ts

# Restart the container
docker restart $CONTAINER
```

## Or Use This Step-by-Step Method

### Step 1: SSH into VPS
```bash
ssh root@38.242.204.63
```

### Step 2: Find Container Name
```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

Look for the backend/app container (something like `services-gif-j-backend-dev-app-1`)

### Step 3: Check Current File
```bash
docker exec <container-name> cat /app/src/modules/auth/auth.controller.ts | grep -A 2 "login"
```

### Step 4: Edit the File

**Option A: Using sed (automatic)**
```bash
docker exec <container-name> sed -i 's/^[[:space:]]*@Recaptcha({ action: '\''login'\'' })/  \/\/ @Recaptcha({ action: '\''login'\'' }) \/\/ Temporarily disabled/' /app/src/modules/auth/auth.controller.ts
```

**Option B: Manual edit with nano**
```bash
docker exec -it <container-name> sh
nano /app/src/modules/auth/auth.controller.ts
# Find line 21, make sure it starts with //
# Save and exit (Ctrl+X, Y, Enter)
exit
```

### Step 5: Verify the Change
```bash
docker exec <container-name> grep -A 2 "@Post('login')" /app/src/modules/auth/auth.controller.ts
```

Should show:
```
  // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
  @Post('login')
```

### Step 6: Restart Container
```bash
docker restart <container-name>
```

### Step 7: Check Logs
```bash
docker logs <container-name> --tail 20
```

## Alternative: Edit on Host, Copy to Container

If editing inside the container doesn't work:

```bash
# 1. Copy file from container to host
docker cp <container-name>:/app/src/modules/auth/auth.controller.ts ./auth.controller.ts

# 2. Edit locally (on your computer or on the VPS)
nano auth.controller.ts
# Make sure line 21 has: // @Recaptcha({ action: 'login' })

# 3. Copy back to container
docker cp ./auth.controller.ts <container-name>:/app/src/modules/auth/auth.controller.ts

# 4. Restart
docker restart <container-name>
```

## What the File Should Look Like

The login endpoint (around line 21-22) should be:

```typescript
  // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
  @Post('login')
  public async login(@Body() body: AuthLoginDto) {
```

**Important:** The `@Recaptcha` line MUST be commented out (starts with `//`)

## Test After Fixing

1. Try logging in from https://gifalot.netlify.app
2. Should work without the 400 error
3. Check browser console - should see successful login

## If You Can't Access the Container

If you can't edit files in the container, you might need to:

1. **Rebuild the container** with the correct code
2. **Or use a different deployment method**

But the frontend fix I made should actually solve the problem - we're no longer sending the empty reCAPTCHA token, so even if the backend tries to validate it, there won't be a token to validate.

**Try logging in first** - the frontend fix might be enough!





