# Manual Backend Update - Fix reCAPTCHA Login Error

Since you can't use git pull, here's how to manually update the backend to fix the login error.

## The Problem
The backend is trying to validate reCAPTCHA for login, but login has reCAPTCHA disabled. This causes a 400 error.

## Solution: Edit the File Directly on Server

### Step 1: SSH into Your VPS

```bash
ssh root@38.242.204.63
```

### Step 2: Navigate to Backend Directory

```bash
cd /home/ansible/services/dev/gif-j-backend
```

### Step 3: Find the Docker Container

```bash
# Find the container name
docker ps | grep backend
# Or
docker ps | grep app
```

The container name will be something like `services-gif-j-backend-dev-app-1`

### Step 4: Edit the Auth Controller File

You have two options:

#### Option A: Edit Inside the Container (Recommended)

```bash
# Get into the container
docker exec -it <container-name> sh
# Or if sh doesn't work:
docker exec -it <container-name> bash

# Navigate to the source directory
cd /app/src/modules/auth

# Edit the file (if nano is available)
nano auth.controller.ts

# Or use vi
vi auth.controller.ts
```

#### Option B: Edit on Host, Then Copy to Container

```bash
# Edit the file on the host
nano src/modules/auth/auth.controller.ts

# Copy the file into the container
docker cp src/modules/auth/auth.controller.ts <container-name>:/app/src/modules/auth/auth.controller.ts
```

### Step 5: Make the Change

Find this line (around line 21):

```typescript
  // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
  @Post('login')
```

Make sure it looks EXACTLY like this (the decorator must be commented out):

```typescript
  // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
  @Post('login')
  public async login(@Body() body: AuthLoginDto) {
```

**Important:** The `@Recaptcha` decorator MUST be commented out (with `//`).

### Step 6: Restart the Container

After editing:

```bash
# Exit the container if you're inside it
exit

# Restart the container to apply changes
docker restart <container-name>

# Or if using docker-compose
docker compose restart app
```

### Step 7: Verify It's Working

```bash
# Check logs to see if it started correctly
docker logs <container-name> --tail 50
```

You should see the backend restart without errors.

## Alternative: Use VNC/Remote Desktop

If you have VNC access:

1. Connect via VNC
2. Open a terminal
3. Follow steps 2-7 above

## Alternative: Use File Manager (if available)

If your VPS has a file manager or web-based editor:

1. Navigate to `/home/ansible/services/dev/gif-j-backend/src/modules/auth/`
2. Edit `auth.controller.ts`
3. Make sure line 21 has the `@Recaptcha` decorator commented out
4. Restart the container

## Quick Verification Command

After updating, verify the change:

```bash
# Check if the decorator is commented out
docker exec <container-name> grep -A 2 "login" /app/src/modules/auth/auth.controller.ts
```

You should see:
```
  // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
  @Post('login')
```

## If You Can't Edit Files Directly

If you can't edit files on the server, you can:

1. **Download the file, edit locally, upload back:**
   ```bash
   # On your local machine
   scp root@38.242.204.63:/home/ansible/services/dev/gif-j-backend/src/modules/auth/auth.controller.ts ./auth.controller.ts
   
   # Edit the file locally
   # Then upload it back
   scp ./auth.controller.ts root@38.242.204.63:/home/ansible/services/dev/gif-j-backend/src/modules/auth/auth.controller.ts
   
   # Copy into container
   ssh root@38.242.204.63 "docker cp /home/ansible/services/dev/gif-j-backend/src/modules/auth/auth.controller.ts <container-name>:/app/src/modules/auth/auth.controller.ts"
   
   # Restart container
   ssh root@38.242.204.63 "docker restart <container-name>"
   ```

2. **Or use a text editor over SSH:**
   - Use VS Code with Remote SSH extension
   - Use WinSCP (Windows) or FileZilla to edit files
   - Use nano/vi directly over SSH

## After Updating

1. Try logging in again from the frontend
2. The error should be gone
3. If it still fails, check the backend logs:
   ```bash
   docker logs <container-name> --tail 100
   ```




