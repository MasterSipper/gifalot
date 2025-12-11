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

Once you find the directory, navigate to it. Common locations:
- `/home/ansible/services/dev/gif-j-backend` (Ansible deployment - **this is your location**)
- `/opt/gifalot/gif-j-backend`
- `/var/www/gifalot/gif-j-backend`

### Step 2: Navigate to Backend Directory

```bash
# Navigate to the backend directory
cd /home/ansible/services/dev/gif-j-backend
```

### Step 3: Find the Docker Container and Working Directory

```bash
# List running Docker containers to find the backend
docker ps

# Get more details about the backend container (replace with actual container name)
docker inspect <container-name> | grep -i "workingdir\|source"

# Or check docker-compose location
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
```

### Step 4: Fix Git Ownership Issue (if needed)

If you get "dubious ownership" errors because the directory is owned by a different user:

```bash
# Add the directory as a safe directory for git
git config --global --add safe.directory /home/ansible/services/dev/gif-j-backend
```

### Step 5: Pull Latest Code from Dev Branch

If git asks for credentials, you have a few options:

**Option A: Check and Fix the Remote URL**

The remote might be pointing to the wrong repository. First check:

```bash
# Check current remote URL
git remote -v
```

If it shows the wrong repository (like `Perlzx/gif-j-backend`), update it:

```bash
# Update to the correct repository
git remote set-url origin https://github.com/MasterSipper/gifalot.git

# Verify it's correct
git remote -v
```

**Note:** If the repository is public, you might not need authentication. If it's private, you'll need a Personal Access Token or SSH keys.

**Option B: If using HTTPS and need credentials**

GitHub no longer accepts passwords. You'll need a Personal Access Token:
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate a new token with `repo` permissions
3. Use the token as the password when prompted

**Option C: Troubleshoot Authentication Issues**

If you're still getting authentication errors after using a token:

```bash
# 1. Clear any cached credentials
git credential-cache exit
git config --global --unset credential.helper

# 2. Verify the remote URL is correct
git remote -v

# 3. Try using the token directly in the URL (replace YOUR_TOKEN with actual token)
git pull https://YOUR_TOKEN@github.com/MasterSipper/gifalot.git dev

# 4. Or set up credential helper to store the token
git config credential.helper store
# Then when prompted, username: MasterSipper, password: YOUR_TOKEN

# 5. Alternative: Use SSH if you have SSH keys set up
git remote set-url origin git@github.com:MasterSipper/gifalot.git
git pull origin dev
```

**Important:** Make sure your Personal Access Token has the `repo` scope enabled.

**Option D: If you have SSH keys set up, switch to SSH remote**

```bash
# Change remote to SSH (if you have SSH keys configured)
git remote set-url origin git@github.com:MasterSipper/gifalot.git

# Then pull
git pull origin dev
```

### Step 6: Rebuild and Restart Docker Container

Try these commands in order (use whichever works):

```bash
# Option 1: Try docker-compose (with hyphen) - most common
docker-compose up -d --build app

# Option 2: If that doesn't work, try docker compose (newer syntax)
docker compose up -d --build app

# Option 3: If you need to specify the compose file explicitly
docker-compose -f docker-compose.yml up -d --build app
```

**Note:** The `-d` flag runs in detached mode (background), `--build` rebuilds the image, and `app` specifies which service to rebuild.

This will:
- Rebuild the Docker image with the latest code
- Restart the backend container
- Keep other services (MySQL, Redis) running

### Step 7: Verify the Update

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

## Add GIPHY API Key to .env File

The Giphy search modal requires a GIPHY API key. Add it to your `.env` file:

```bash
# Navigate to backend directory
cd /home/ansible/services/dev/gif-j-backend

# Edit the .env file
nano .env
```

Find the line:
```
GIPHY_API_KEY=
```

And change it to:
```
GIPHY_API_KEY=s3k2WSBRVKYkCsTL60x7ow79geR9aCSq
```

Save the file (Ctrl+X, Y, Enter), then restart the container:

```bash
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose restart app
```

Or if restart doesn't pick up the changes:

```bash
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose down
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d
```

## Fix Redis and MySQL Connection Issues

**IMPORTANT:** Your backend uses **MySQL** (hosted on Simply servers), NOT PostgreSQL!

If you see errors like:
- `getaddrinfo EAI_AGAIN redis` - Redis hostname not found
- `SASL: SCRAM-SERVER-FIRST-MESSAGE: client password must be a string` - This error appears if you have `POSTGRES_*` variables in your `.env` file, but you should be using `MYSQL_*` variables instead

### Step 1: Check Docker Service Names and Network

```bash
# Check all running containers
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"

# Check the network the containers are on
docker network ls

# Inspect the postgres container to see its actual hostname
docker inspect services-gif-j-backend-dev-postgres-1 | grep -A 5 "Hostname"

# Inspect the redis container to see its actual hostname
docker inspect services-gif-j-backend-dev-redis-1 | grep -A 5 "Hostname"

# Check what network they're on
docker inspect services-gif-j-backend-dev-postgres-1 | grep -A 10 "Networks"
docker inspect services-gif-j-backend-dev-redis-1 | grep -A 10 "Networks"
```

### Step 2: Check Docker Compose File

```bash
# View the docker-compose.yml to see service names
cat docker-compose.yml | grep -A 5 "redis:"
cat docker-compose.yml | grep -A 5 "mysql:"
```

### Step 3: Update .env File with Correct Configuration

**CRITICAL:** Your backend uses **MySQL** (hosted on Simply servers), NOT PostgreSQL!

Edit your `.env` file:

```bash
nano .env
```

**Remove any `POSTGRES_*` variables** and make sure you have these MySQL variables instead:

```env
# Redis Configuration - use the actual Docker service name
REDIS_HOST=redis
# OR if that doesn't work, try the full container name:
# REDIS_HOST=services-gif-j-backend-dev-redis-1
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password-here

# MySQL Configuration - Your Simply MySQL server (NOT PostgreSQL!)
MYSQL_HOST=mysql96.unoeuro.com
MYSQL_PORT=3306
MYSQL_USER=gifalot_com
MYSQL_PASSWORD=z6paFtf9D5Eryh4cdwgb
MYSQL_DB=gifalot_com_db
```

**Important:** 
- **DO NOT** use `POSTGRES_*` variables - your backend uses MySQL!
- The `MYSQL_HOST` should be `mysql96.unoeuro.com` (your Simply MySQL server)
- The `REDIS_PASSWORD` should match what's configured in the Redis container
- The `REDIS_HOST` should be `redis` (the Docker service name)

### Step 4: Check Redis Password

```bash
# Check what password Redis is using
docker inspect services-gif-j-backend-dev-redis-1 | grep -A 10 "Env" | grep -i password
# OR check the docker-compose.yml
cat docker-compose.yml | grep -A 10 "redis:" | grep -i password
# OR check your .env file
cat .env | grep REDIS_PASSWORD
```

### Step 5: Restart Container

After updating `.env`:

```bash
# Recreate container to pick up new environment variables
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose down
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d

# Check logs
sleep 5
docker logs services-gif-j-backend-dev-app-1 --tail 50
```

### Step 6: If Still Not Working - Check Network

If the hostnames still don't resolve, check if all containers are on the same network:

```bash
# Check network
docker network inspect services-gif-j-backend-dev_default

# Or check what network each container is on
docker inspect services-gif-j-backend-dev-app-1 | grep -A 20 "Networks"
docker inspect services-gif-j-backend-dev-postgres-1 | grep -A 20 "Networks"
docker inspect services-gif-j-backend-dev-redis-1 | grep -A 20 "Networks"
```

All containers should be on the same network. If they're not, you may need to check your `docker-compose.yml` file.

## Note

The code in the repository is already correct. This is just a matter of deploying the latest code to your server.

