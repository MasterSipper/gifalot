# Fix Traefik Volume Mount

## Problem
File exists on host but Traefik container can't see it - volume mount issue.

## Step 1: Verify Volume Mount in docker-compose.yml

```bash
cd /home/ansible/infrastructure/traefik

# Check if volume mount is in docker-compose.yml
grep -A 10 "volumes:" docker-compose.yml
```

Should include:
```yaml
      - '/home/ansible/infrastructure/traefik/dynamic:/etc/traefik/dynamic:ro'
```

## Step 2: Check Current Volume Mounts

```bash
# Check what volumes are currently mounted
docker inspect infrastructure-traefik_traefik_1 | grep -A 20 "Mounts" | grep "dynamic"
```

If nothing shows up, the volume isn't mounted.

## Step 3: Add Volume Mount if Missing

If the volume mount isn't in docker-compose.yml:

```bash
nano docker-compose.yml
```

Add to volumes section:
```yaml
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
      - '/home/ansible/infrastructure/traefik/dynamic:/etc/traefik/dynamic:ro'  # ADD THIS LINE
      - '/etc/letsencrypt/live/dev.gifalot.com/fullchain.pem:/certs/fullchain.pem:ro'
      - '/etc/letsencrypt/live/dev.gifalot.com/privkey.pem:/certs/privkey.pem:ro'
```

Save and exit.

## Step 4: Recreate Traefik Container

```bash
cd /home/ansible/infrastructure/traefik

# Recreate container to pick up volume mount
docker compose down
docker compose up -d

# Wait a few seconds
sleep 5

# Verify file is now visible
docker exec infrastructure-traefik_traefik_1 ls -la /etc/traefik/dynamic/
docker exec infrastructure-traefik_traefik_1 cat /etc/traefik/dynamic/backend-dev.yml
```

## Step 5: Check Traefik Logs

```bash
docker logs infrastructure-traefik_traefik_1 --tail 30
```

Should see:
- "Configuration loaded from file: /etc/traefik/dynamic/backend-dev.yml"
- No more errors about missing IP or port

## Step 6: Test

```bash
curl -I https://dev.gifalot.com/gif-j/
curl -X OPTIONS https://dev.gifalot.com/gif-j/auth/login \
  -H "Origin: https://gifalot.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```




