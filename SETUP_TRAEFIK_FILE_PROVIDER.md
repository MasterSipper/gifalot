# Setup Traefik File Provider for Host Networking

## Problem
Traefik Docker provider can't discover containers using `network_mode: "host"` because they don't have Docker network IPs.

## Solution: Use Traefik File Provider

### Step 1: Create Dynamic Configuration Directory

On your server:

```bash
mkdir -p /home/ansible/infrastructure/traefik/dynamic
```

### Step 2: Create Dynamic Configuration File

Create `/home/ansible/infrastructure/traefik/dynamic/backend-dev.yml`:

```yaml
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
```

### Step 3: Update Traefik Configuration

The Traefik docker-compose.yml has been updated to:
1. Enable file provider: `--providers.file.directory=/etc/traefik/dynamic`
2. Watch for changes: `--providers.file.watch=true`
3. Mount the dynamic config directory

### Step 4: Restart Traefik

```bash
cd /home/ansible/infrastructure/traefik
docker compose restart traefik
```

Or if using the ansible setup:

```bash
# The Traefik playbook will need to be re-run to apply the new configuration
```

### Step 5: Verify

```bash
# Check Traefik logs
docker logs infrastructure-traefik_traefik_1 --tail 50

# Test routing
curl -I https://dev.gifalot.com/gif-j/

# Test CORS preflight
curl -X OPTIONS https://dev.gifalot.com/gif-j/auth/login \
  -H "Origin: https://gifalot.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## Alternative: Quick Manual Setup

If you want to test immediately without updating Traefik docker-compose:

1. Create the directory and file on the server
2. Restart Traefik with the volume mount manually
3. Or update Traefik docker-compose.yml and restart

## Files Created

- `gif-j-backend/traefik-dynamic.yml` - Template for dynamic config
- Updated `gif-j-backend/ansible/playbooks/traefik/docker-compose.yml` - Added file provider
- Updated `gif-j-backend/docker-compose.yml` - Removed Traefik labels (not needed with file provider)




