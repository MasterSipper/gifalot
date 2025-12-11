# Fix Traefik Routing with Host Networking

## Problem
Backend works on `localhost:3333` with correct CORS, but Traefik can't route to it via `https://dev.gifalot.com` because host networking breaks Docker service discovery.

## Solution Options

### Option 1: Configure Traefik to Route to localhost:3333

Traefik needs to be configured to route to `localhost:3333` instead of using Docker service discovery.

Check Traefik configuration file or update docker-compose labels to use `http://host.docker.internal:3333` or configure a file provider.

### Option 2: Use Traefik File Provider

Create a Traefik dynamic configuration file:

```yaml
# traefik-dynamic.yml
http:
  routers:
    backend:
      rule: "Host(`dev.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: backend-service
      entryPoints:
        - web
      # tls:
      #   certResolver: le
  
  services:
    backend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3333"
```

### Option 3: Test Direct Access

Test if the backend is accessible via the public IP:

```bash
# From your local machine or another server
curl -I http://38.242.204.63:3333/gif-j/

# If that works, Traefik just needs to route to localhost:3333
```

### Option 4: Revert Host Networking (Recommended Long-term)

1. Remove `network_mode: "host"` from docker-compose.yml
2. Contact Simply support to whitelist Docker network IPs
3. Use normal Docker networking with Traefik

## Quick Test

Test if backend is accessible from outside:

```bash
# On server, check if port 3333 is accessible
netstat -tlnp | grep 3333

# Test from external (if firewall allows)
curl -I http://38.242.204.63:3333/gif-j/
```




