# Verify File Provider is Enabled

## Step 1: Check if File Provider is in Command

```bash
# Check current Traefik command
docker inspect infrastructure-traefik_traefik_1 | grep -A 30 "Cmd"
```

Look for:
- `--providers.file.directory=/etc/traefik/dynamic`
- `--providers.file.watch=true`

## Step 2: Check docker-compose.yml

```bash
cd /home/ansible/infrastructure/traefik
grep -A 10 "command:" docker-compose.yml | grep "file"
```

## Step 3: If File Provider is Missing

If it's not there, add it:

```bash
nano docker-compose.yml
```

Add after `--providers.docker.exposedbydefault=false`:
```yaml
      - '--providers.file.directory=/etc/traefik/dynamic'
      - '--providers.file.watch=true'
```

## Step 4: Recreate Container (Important!)

```bash
# Must use down/up, not just restart
docker compose down
docker compose up -d

# Wait
sleep 5

# Check logs
docker logs infrastructure-traefik_traefik_1 --tail 30
```

Should see messages about loading dynamic config.

## Step 5: Test

```bash
curl -I https://dev.gifalot.com/gif-j/
```





