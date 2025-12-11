# Fix Traefik Docker Discovery with Host Networking

## Problem
Traefik is still trying to discover the backend container via Docker provider, but with `network_mode: "host"`, the container has no Docker network IP, causing errors.

## Solution: Completely Disable Docker Discovery

### Step 1: Ensure Backend Has No Traefik Labels

The backend container should have `traefik.enable=false` or no Traefik labels at all.

### Step 2: Create Dynamic Config File Properly

On your server:

```bash
# Create directory
mkdir -p /home/ansible/infrastructure/traefik/dynamic

# Create the config file (make sure YAML is correct)
cat > /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml << 'EOF'
http:
  routers:
    backend-dev:
      rule: "PathPrefix(`/gif-j`)"
      service: backend-service-dev
      entryPoints:
        - web
  
  services:
    backend-service-dev:
      loadBalancer:
        servers:
          - url: "http://38.242.204.63:3333"
EOF

# Verify the file was created correctly
cat /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml
```

### Step 3: Verify Traefik Configuration

Check that Traefik has the file provider enabled:

```bash
# Check Traefik docker-compose.yml
cat /home/ansible/infrastructure/traefik/docker-compose.yml | grep -A 5 "providers.file"
```

Should show:
```yaml
- '--providers.file.directory=/etc/traefik/dynamic'
- '--providers.file.watch=true'
```

And the volume mount:
```yaml
- '/home/ansible/infrastructure/traefik/dynamic:/etc/traefik/dynamic:ro'
```

### Step 4: Restart Traefik

```bash
docker restart infrastructure-traefik_traefik_1
```

### Step 5: Check Traefik Logs

```bash
docker logs infrastructure-traefik_traefik_1 --tail 30
```

Should see:
- "Configuration loaded from file: /etc/traefik/dynamic/..."
- No more "unable to find the IP address" errors
- No more "port is missing" errors

### Step 6: Test

```bash
curl -I https://dev.gifalot.com/gif-j/
curl -X OPTIONS https://dev.gifalot.com/gif-j/auth/login \
  -H "Origin: https://gifalot.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## If Still Not Working

1. Check file permissions:
```bash
ls -la /home/ansible/infrastructure/traefik/dynamic/
```

2. Check Traefik can read the file:
```bash
docker exec infrastructure-traefik_traefik_1 ls -la /etc/traefik/dynamic/
```

3. Check YAML syntax:
```bash
docker exec infrastructure-traefik_traefik_1 cat /etc/traefik/dynamic/backend-dev.yml
```




