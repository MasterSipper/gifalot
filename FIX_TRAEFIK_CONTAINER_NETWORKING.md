# Fix Traefik Container Networking

## Problem
Traefik container can't reach backend even via gateway IP 172.17.0.1:3333.

## Step 1: Check Firewall

```bash
# Check iptables rules
iptables -L -n | grep 3333

# Check if Docker is blocking
iptables -L DOCKER -n | grep 3333
```

## Step 2: Try localhost from Traefik

```bash
# Test if Traefik can reach localhost (unlikely but worth trying)
docker exec $TRAEFIK_CONTAINER wget -O- --timeout=5 http://localhost:3333/gif-j/ 2>&1 | head -20
```

## Step 3: Check Backend is Actually Listening

```bash
# Use ss instead of netstat
ss -tlnp | grep 3333

# Should show: 0.0.0.0:3333 (listening on all interfaces)
```

## Step 4: Put Traefik on Host Network (Solution)

Since backend uses host networking, put Traefik on host network too:

```bash
cd /home/ansible/infrastructure/traefik

# Edit docker-compose.yml
nano docker-compose.yml
```

Add `network_mode: "host"` to the traefik service:

```yaml
services:
  traefik:
    network_mode: "host"  # ADD THIS
    image: 'traefik:v2.9'
    ...
```

Remove the `ports:` section (not needed with host networking).

Remove the `networks:` section.

Then recreate:
```bash
docker compose down
docker compose up -d
```

Update dynamic config to use localhost:
```bash
cat > /etc/traefik/dynamic/backend-dev.yml << 'EOF'
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
          - url: "http://localhost:3333"
EOF
```

## Alternative: Use Nginx Instead

If Traefik host networking causes issues, we could use nginx as a simpler reverse proxy.




