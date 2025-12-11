# Test Backend Accessibility

## Problem
CORS error suggests the backend isn't responding to preflight OPTIONS requests, or isn't accessible via Traefik.

## Test Backend Directly

On your server, test if the backend is accessible:

```bash
# Test backend on localhost
curl -I http://localhost:3333/gif-j/

# Test with CORS headers
curl -X OPTIONS https://dev.gifalot.com/gif-j/auth/login \
  -H "Origin: https://gifalot.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

## Check Traefik Routing

With host networking, Traefik might not be able to route to the backend. Check:

```bash
# Check Traefik logs
docker logs infrastructure-traefik_traefik_1 --tail 50

# Check if Traefik sees the backend service
# Traefik might need different configuration for host networking
```

## Solution: Configure Traefik for Host Networking

If using host networking, Traefik needs to route to `localhost:3333` instead of the Docker service name.

Check Traefik configuration or update docker-compose.yml labels.

## Alternative: Revert Host Networking

The cleanest solution is to:
1. Revert host networking
2. Contact Simply support to whitelist Docker network IPs
3. Use normal Docker networking





