# Debug Traefik 404 Error

## Problem
Traefik returns 404, meaning the route isn't registered. The dynamic config file might not be loaded.

## Step 1: Verify Dynamic Config File Exists

```bash
# Check if file exists
ls -la /home/ansible/infrastructure/traefik/dynamic/

# Check file content
cat /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml

# Check if Traefik can see it
docker exec infrastructure-traefik_traefik_1 ls -la /etc/traefik/dynamic/
docker exec infrastructure-traefik_traefik_1 cat /etc/traefik/dynamic/backend-dev.yml
```

## Step 2: Check Traefik Configuration

```bash
# Verify Traefik has file provider enabled
docker inspect infrastructure-traefik_traefik_1 | grep -A 30 "Cmd" | grep "file"

# Should show:
# --providers.file.directory=/etc/traefik/dynamic
# --providers.file.watch=true
```

## Step 3: Check Traefik Logs for File Loading

```bash
# Look for file provider messages
docker logs infrastructure-traefik_traefik_1 2>&1 | grep -i "file\|dynamic\|backend-dev"

# Should see something like:
# "Configuration loaded from file: /etc/traefik/dynamic/backend-dev.yml"
```

## Step 4: Restart Traefik Properly

If the file provider isn't enabled, restart won't help. Need to recreate:

```bash
cd /home/ansible/infrastructure/traefik
docker compose down
docker compose up -d
```

## Step 5: Check Traefik API (if enabled)

```bash
# Check if Traefik API is enabled and see registered routes
curl http://localhost:8080/api/http/routers 2>/dev/null || echo "API not enabled"
```

## Common Issues

1. **File doesn't exist** - Create it
2. **File provider not enabled** - Update docker-compose.yml and recreate container
3. **YAML syntax error** - Check file format
4. **Wrong entrypoint** - Make sure using `websecure` for HTTPS





