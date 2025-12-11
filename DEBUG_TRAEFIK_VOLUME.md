# Debug Traefik Volume Mount Issue

## Problem
Volume mount is in docker-compose.yml but file still not visible in container.

## Step 1: Verify Volume Mount Actually Works

```bash
# Check what's actually mounted
docker inspect infrastructure-traefik_traefik_1 | grep -A 30 "Mounts"

# Check if the directory exists in container
docker exec infrastructure-traefik_traefik_1 ls -la /etc/traefik/

# Check if dynamic directory exists
docker exec infrastructure-traefik_traefik_1 ls -la /etc/traefik/dynamic/ 2>&1
```

## Step 2: Check File Permissions

```bash
# Check file permissions on host
ls -la /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml

# File is owned by root, might need to be readable
chmod 644 /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml
```

## Step 3: Test Volume Mount with a Simple File

```bash
# Create a test file
echo "test" > /home/ansible/infrastructure/traefik/dynamic/test.txt

# Check if it's visible in container
docker exec infrastructure-traefik_traefik_1 cat /etc/traefik/dynamic/test.txt
```

If test.txt is visible but backend-dev.yml isn't, it's a file-specific issue.

## Step 4: Check docker-compose.yml Syntax

```bash
# Verify the volume mount syntax is correct
cat docker-compose.yml | grep -A 10 "volumes:"
```

Make sure there are no YAML syntax errors.

## Step 5: Check Container Logs for Mount Errors

```bash
docker logs infrastructure-traefik_traefik_1 2>&1 | grep -i "mount\|volume\|error"
```

## Step 6: Try Absolute Path

If relative path doesn't work, try using absolute path or checking if the path is correct.

## Alternative: Copy File Directly to Test

```bash
# Copy file directly into container (temporary test)
docker cp /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml infrastructure-traefik_traefik_1:/etc/traefik/dynamic/

# Check if it's there
docker exec infrastructure-traefik_traefik_1 cat /etc/traefik/dynamic/backend-dev.yml
```

If this works, the volume mount isn't working properly.




