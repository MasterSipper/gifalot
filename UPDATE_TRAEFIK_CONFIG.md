# Update Traefik Configuration on Server

## Current Issue
Traefik's docker-compose.yml doesn't have:
1. File provider enabled
2. Volume mount for dynamic directory

## Solution: Update Traefik docker-compose.yml

On your server, run:

```bash
cd /home/ansible/infrastructure/traefik

# Backup current config
cp docker-compose.yml docker-compose.yml.backup

# Edit the file
nano docker-compose.yml
```

Add to the `command` section (after `--providers.docker.exposedbydefault=false`):
```yaml
      - '--providers.file.directory=/etc/traefik/dynamic'
      - '--providers.file.watch=true'
```

Add to the `volumes` section (after the docker.sock line):
```yaml
      - '/home/ansible/infrastructure/traefik/dynamic:/etc/traefik/dynamic:ro'
```

The complete `command` section should look like:
```yaml
    command:
      - '--providers.docker=true'
      - '--providers.docker.exposedbydefault=false'
      - '--providers.file.directory=/etc/traefik/dynamic'
      - '--providers.file.watch=true'
      - '--entrypoints.web.address=:80'
      - '--entrypoints.websecure.address=:443'
      - '--entrypoints.web.http.redirections.entryPoint.to=websecure'
      - '--entrypoints.web.http.redirections.entryPoint.scheme=https'
      - '--entrypoints.web.http.redirections.entrypoint.permanent=true'
```

The complete `volumes` section should look like:
```yaml
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock:ro'
      - '/home/ansible/infrastructure/traefik/dynamic:/etc/traefik/dynamic:ro'
      - '/etc/letsencrypt/live/dev.gifalot.com/fullchain.pem:/certs/fullchain.pem:ro'
      - '/etc/letsencrypt/live/dev.gifalot.com/privkey.pem:/certs/privkey.pem:ro'
```

Save and exit (Ctrl+X, Y, Enter).

Then restart Traefik:
```bash
docker compose restart traefik
```

## Create Backend Dynamic Config

```bash
# Create the backend config file
cat > /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml << 'EOF'
http:
  routers:
    backend-dev:
      rule: "PathPrefix(`/gif-j`)"
      service: backend-service-dev
      entryPoints:
        - websecure
      tls: {}
  
  services:
    backend-service-dev:
      loadBalancer:
        servers:
          - url: "http://38.242.204.63:3333"
EOF

# Verify
cat /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml
```

Note: Using `websecure` entrypoint since Traefik redirects HTTP to HTTPS.

## Restart and Verify

```bash
docker compose restart traefik
sleep 5
docker logs infrastructure-traefik_traefik_1 --tail 30
```

Should see:
- "Configuration loaded from file: /etc/traefik/dynamic/backend-dev.yml"
- No more "port is missing" errors





