# Fix 504 Gateway Timeout

## Problem
Traefik is routing (504 not 404), but can't reach backend at `http://38.242.204.63:3333`.

## Step 1: Verify Backend is Running and Accessible

```bash
# Check if backend is running
docker ps | grep backend

# Check if backend is listening on port 3333
netstat -tlnp | grep 3333
# Or
ss -tlnp | grep 3333

# Test backend directly from host
curl -I http://localhost:3333/gif-j/
curl -I http://38.242.204.63:3333/gif-j/
```

## Step 2: Check if Backend is Listening on All Interfaces

```bash
# Check backend logs
docker logs services-gif-j-backend-dev-app-1 --tail 20

# Should see: "Application is running on: http://0.0.0.0:3333/gif-j"
```

## Step 3: Test from Traefik Container

```bash
# Test if Traefik container can reach backend
docker exec $TRAEFIK_CONTAINER wget -O- --timeout=5 http://38.242.204.63:3333/gif-j/ 2>&1 | head -20

# Or try localhost (if on same host)
docker exec $TRAEFIK_CONTAINER wget -O- --timeout=5 http://localhost:3333/gif-j/ 2>&1 | head -20
```

## Step 4: Check Firewall

```bash
# Check if firewall is blocking
iptables -L -n | grep 3333
ufw status | grep 3333
```

## Step 5: Alternative - Use Host Gateway IP

If public IP doesn't work from container, try using Docker host gateway:

```bash
# Find Docker gateway IP
ip route | grep default
# Or
docker network inspect bridge | grep Gateway

# Update dynamic config to use gateway IP instead
nano /etc/traefik/dynamic/backend-dev.yml
```

Change URL to use gateway IP (usually 172.17.0.1) or use `host.docker.internal` if supported.

## Step 6: Or Use Host Network for Traefik

If nothing works, we could put Traefik on host network too, but that's more complex.




