# Check Traefik File Provider

## Problem
Traefik restarted but no message about loading dynamic config file.

## Step 1: Verify File Provider is Enabled

```bash
# Check Traefik command arguments
docker inspect infrastructure-traefik_traefik_1 | grep -A 30 "Cmd" | grep "file"
```

Should see:
- `--providers.file.directory=/etc/traefik/dynamic`
- `--providers.file.watch=true`

## Step 2: Check if File Provider is Actually Loading

```bash
# Look for file provider messages in logs
docker logs infrastructure-traefik_traefik_1 2>&1 | grep -i "file\|dynamic\|provider"

# Check all recent logs
docker logs infrastructure-traefik_traefik_1 --tail 50
```

## Step 3: Verify File is Correct Format

```bash
# Check file content
cat /etc/traefik/dynamic/backend-dev.yml

# Check YAML syntax (if yq is available)
# yq eval . /etc/traefik/dynamic/backend-dev.yml
```

## Step 4: Test Route

```bash
# Test if route works now
curl -I https://dev.gifalot.com/gif-j/

# If still 404, check Traefik API (if enabled)
curl http://localhost:8080/api/http/routers 2>/dev/null | grep backend-dev || echo "API not enabled or route not found"
```

## Step 5: Check Traefik docker-compose.yml

```bash
# Verify file provider is in command
cd /home/ansible/infrastructure/traefik
grep -A 10 "command:" docker-compose.yml | grep "file"
```

If file provider isn't enabled, we need to add it and recreate the container.





