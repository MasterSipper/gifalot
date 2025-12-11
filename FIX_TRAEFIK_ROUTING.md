# Fix Traefik Routing with Host Networking

## Problem
Backend works on `localhost:3333` with correct CORS, but Traefik can't route to it because:
1. Backend uses `network_mode: "host"` (not on Docker network)
2. Traefik runs in a container and can't reach `localhost:3333` from inside

## Solution Applied

Updated `docker-compose.yml` to:
1. Add `network_mode: "host"` to app service
2. Configure Traefik to route to `http://172.17.0.1:3333` (Docker host gateway IP)
3. Comment out networks/depends_on (not compatible with host networking)

## Alternative: If 172.17.0.1 doesn't work

If Traefik can't reach `172.17.0.1:3333`, try:

### Option 1: Use Host's Public IP
```yaml
- 'traefik.http.services.${SERVICE_NAME_STAGE}.loadbalancer.server.url=http://38.242.204.63:3333'
```

### Option 2: Configure Traefik with Extra Hosts
Add to Traefik docker-compose.yml:
```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

Then use:
```yaml
- 'traefik.http.services.${SERVICE_NAME_STAGE}.loadbalancer.server.url=http://host.docker.internal:3333'
```

### Option 3: Use Traefik File Provider
Create `/home/ansible/infrastructure/traefik/dynamic.yml`:
```yaml
http:
  services:
    backend-service:
      loadBalancer:
        servers:
          - url: "http://172.17.0.1:3333"
```

## Test After Update

```bash
# Pull and rebuild
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend
git pull origin dev
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app

# Test via Traefik
curl -I https://dev.gifalot.com/gif-j/

# Test CORS preflight
curl -X OPTIONS https://dev.gifalot.com/gif-j/auth/login \
  -H "Origin: https://gifalot.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```


