# Verify Traefik Setup

## Step 1: Rebuild Backend with traefik.enable=false

```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend
git pull origin dev
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app

# Verify the label is set
docker inspect services-gif-j-backend-dev-app-1 | grep -i "traefik.enable"
# Should show: "traefik.enable": "false"
```

## Step 2: Verify Dynamic Config File Exists

```bash
# Check if file exists
ls -la /home/ansible/infrastructure/traefik/dynamic/

# Check file content
cat /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml

# Check if Traefik can see it
docker exec infrastructure-traefik_traefik_1 ls -la /etc/traefik/dynamic/
docker exec infrastructure-traefik_traefik_1 cat /etc/traefik/dynamic/backend-dev.yml
```

## Step 3: Verify Traefik Has File Provider Enabled

```bash
# Check Traefik command line arguments
docker inspect infrastructure-traefik_traefik_1 | grep -A 20 "Cmd"

# Should include:
# --providers.file.directory=/etc/traefik/dynamic
# --providers.file.watch=true
```

## Step 4: Check Traefik docker-compose.yml

```bash
# Find Traefik docker-compose location
docker inspect infrastructure-traefik_traefik_1 | grep "com.docker.compose.project.working_dir"

# Or check the volume mounts
docker inspect infrastructure-traefik_traefik_1 | grep -A 5 "Mounts"

# Check the actual docker-compose.yml
cat /home/ansible/infrastructure/traefik/docker-compose.yml
```

## Step 5: If File Provider Not Enabled, Update Traefik

If Traefik doesn't have file provider enabled, you need to update its docker-compose.yml:

```bash
cd /home/ansible/infrastructure/traefik
nano docker-compose.yml
```

Add to command section:
```yaml
- '--providers.file.directory=/etc/traefik/dynamic'
- '--providers.file.watch=true'
```

Add to volumes section:
```yaml
- '/home/ansible/infrastructure/traefik/dynamic:/etc/traefik/dynamic:ro'
```

Then restart:
```bash
docker compose restart traefik
```

## Step 6: Check Traefik Logs After Restart

```bash
docker logs infrastructure-traefik_traefik_1 --tail 30
```

Should see:
- "Configuration loaded from file: /etc/traefik/dynamic/backend-dev.yml"
- No more "port is missing" errors




