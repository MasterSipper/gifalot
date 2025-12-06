# Quick Backend Update - Fix Template Persistence

## The Problem
The backend server at `dev.gifalot.com` is rejecting template updates with error: "property template should not exist"

This is because the running backend doesn't have the latest code that includes the `template` field in the FileUpdateDto.

## Solution: Update Backend on Server

You're already logged in as root on the VPS. Follow these steps:

### Step 1: Find the Backend Directory

First, let's locate where the backend is installed:

```bash
# Search for the backend directory
find / -type d -name "gif-j-backend" 2>/dev/null

# Or check common locations
ls -la /opt/
ls -la /home/root/
ls -la /var/www/

# Check if it's running as a systemd service
systemctl list-units | grep -i gif
systemctl list-units | grep -i backend

# Check if it's running in Docker
docker ps | grep -i gif
docker ps | grep -i backend

# Check running Node processes
ps aux | grep node
ps aux | grep nest
```

Once you find the directory, navigate to it. Common locations might be:
- `/opt/gifalot/gif-j-backend`
- `/home/root/services/dev/gif-j-backend` (if using Ansible deployment)
- `/var/www/gifalot/gif-j-backend`
- Or wherever you originally cloned the repository

### Step 2: Find the Docker Container and Working Directory

```bash
# List running Docker containers to find the backend
docker ps

# Get more details about the backend container (replace with actual container name)
docker inspect <container-name> | grep -i "workingdir\|source"

# Or check docker-compose location
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

### Step 3: Navigate to Backend Directory

Once you find where the docker-compose.yml file is located:

```bash
# Navigate to the directory containing docker-compose.yml
cd /path/to/gif-j-backend
```

### Step 4: Pull Latest Code from Dev Branch

```bash
# Fetch latest changes
git fetch origin

# Switch to dev branch (if not already on it)
git checkout dev

# Pull latest code
git pull origin dev
```

### Step 5: Rebuild and Restart Docker Container

```bash
# Rebuild the container with latest code and restart
docker compose up -d --build app

# Or if using docker-compose (older syntax)
docker-compose up -d --build app
```

This will:
- Rebuild the Docker image with the latest code
- Restart the backend container
- Keep other services (MySQL, Redis) running

### Step 6: Verify the Update

Check that the backend restarted successfully:

```bash
# Check container status
docker ps

# View recent logs to ensure no errors
docker logs <container-name> --tail 50

# Or if using docker-compose
docker compose logs app --tail 50
```

You should see the backend restart and start serving requests. The template field should now be accepted.

## Alternative: Manual File Update (If Git Pull Fails)

If for some reason you can't pull from git, you can manually update the DTO file:

```bash
# Navigate to backend directory (use the path you found in Step 1)
cd /path/to/gif-j-backend

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

Then rebuild and restart the Docker container:
```bash
docker compose up -d --build app
```

## Verify the Fix

After updating, test by:
1. Opening the compilation editor
2. Setting a template
3. Checking the browser console - should no longer see 400 errors

## Note

The code in the repository is already correct. This is just a matter of deploying the latest code to your server.

