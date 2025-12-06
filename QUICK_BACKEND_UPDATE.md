# Quick Backend Update - Fix Template Persistence

## The Problem
The backend server at `dev.gifalot.com` is rejecting template updates with error: "property template should not exist"

This is because the running backend doesn't have the latest code that includes the `template` field in the FileUpdateDto.

## Solution: Update Backend on Server

You're already logged in as root on the VPS. Follow these steps:

### Step 1: Navigate to Backend Directory

```bash
cd /opt/gifalot/gif-j-backend
```

### Step 2: Pull Latest Code from Dev Branch

```bash
# Fetch latest changes
git fetch origin

# Switch to dev branch (if not already on it)
git checkout dev

# Pull latest code
git pull origin dev
```

### Step 3: Install Dependencies (if any new ones were added)

```bash
npm install
```

### Step 4: Rebuild the Application

```bash
npm run build
```

### Step 5: Restart the Backend with PM2

```bash
pm2 restart gifalot-backend
```

### Step 6: Verify the Update

Check that the backend restarted successfully:

```bash
# Check PM2 status
pm2 status

# View recent logs to ensure no errors
pm2 logs gifalot-backend --lines 50
```

You should see the backend restart and start serving requests. The template field should now be accepted.

## Alternative: Manual File Update (If Git Pull Fails)

If for some reason you can't pull from git, you can manually update the DTO file:

```bash
# Navigate to backend directory
cd /opt/gifalot/gif-j-backend

# Edit the DTO file
nano src/modules/file/dto/update.ts
```

Make sure these lines exist (after line 28, after the rotation field):

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

