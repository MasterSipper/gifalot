# Quick Backend Update - Fix Template Persistence

## The Problem
The backend server at `dev.gifalot.com` is rejecting template updates with error: "property template should not exist"

This is because the running backend doesn't have the latest code that includes the `template` field in the FileUpdateDto.

## Solution: Update Backend on Server

### Option 1: SSH into Contabo VPS and Update

```bash
# 1. SSH into your server
ssh root@your-server-ip

# 2. Navigate to backend directory
cd /path/to/gif-j-backend

# 3. Pull latest code from dev branch
git fetch origin
git checkout dev
git pull origin dev

# 4. Install any new dependencies
npm install

# 5. Rebuild the application
npm run build

# 6. Restart the backend (if using PM2)
pm2 restart gifalot-backend

# Or if using systemd/docker, restart the service
```

### Option 2: If Using Docker

```bash
# SSH into server
ssh root@your-server-ip

# Navigate to backend directory
cd /path/to/gif-j-backend

# Pull latest code
git pull origin dev

# Rebuild and restart Docker container
docker-compose down
docker-compose up -d --build
```

### Option 3: Manual File Update (Quick Fix)

If you can't do a full deployment right now, you can manually update the DTO file on the server:

```bash
# SSH into server
ssh root@your-server-ip

# Edit the DTO file
nano /path/to/gif-j-backend/src/modules/file/dto/update.ts
```

Add these lines after line 28 (after the rotation field):

```typescript
  @IsOptional()
  @IsString()
  @Length(1, 50)
  public template?: string;
```

Then rebuild and restart:
```bash
npm run build
pm2 restart gifalot-backend
```

## Verify the Fix

After updating, test by:
1. Opening the compilation editor
2. Setting a template
3. Checking the browser console - should no longer see 400 errors

## Note

The code in the repository is already correct. This is just a matter of deploying the latest code to your server.

