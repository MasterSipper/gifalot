# Test Traefik Routing to Backend

## Current Status
- Backend works on `localhost:3333` with correct CORS ✅
- Traefik can't route to backend via `https://dev.gifalot.com` ❌
- CORS preflight (OPTIONS) fails when accessed through Traefik

## Test Steps

### 1. Test Backend via Traefik

On your server, test if Traefik can reach the backend:

```bash
# Test via Traefik (from server)
curl -I https://dev.gifalot.com/gif-j/

# Test CORS preflight via Traefik
curl -X OPTIONS https://dev.gifalot.com/gif-j/auth/login \
  -H "Origin: https://gifalot.netlify.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

### 2. Check Traefik Logs

```bash
docker logs infrastructure-traefik_traefik_1 --tail 50
```

Look for:
- Routing errors
- Connection refused errors
- Service discovery issues

### 3. Check if Traefik Can Reach Backend

The issue is likely that Traefik (running in a container) can't reach `172.17.0.1:3333`.

Try these alternatives:

#### Option A: Use Host's Public IP
```yaml
- 'traefik.http.services.${SERVICE_NAME_STAGE}.loadbalancer.server.url=http://38.242.204.63:3333'
```

#### Option B: Configure Traefik with Extra Hosts
Add to Traefik docker-compose.yml:
```yaml
extra_hosts:
  - "host.docker.internal:172.17.0.1"
```

#### Option C: Use Host Network for Traefik (Not Recommended)
This would require Traefik to also use host networking.

### 4. Check Docker Gateway IP

```bash
# Find the actual Docker gateway IP
ip route | grep default
# Or
docker network inspect bridge | grep Gateway
```

The gateway might not be `172.17.0.1` on your system.

### 5. Verify Backend is Listening on 0.0.0.0

```bash
# Check if backend is listening on all interfaces
netstat -tlnp | grep 3333
# Should show: 0.0.0.0:3333 (not 127.0.0.1:3333)
```

## Most Likely Fix

Since Traefik is in a container and backend uses host networking, we need to use the host's public IP or configure Traefik to access the host network.

Try updating docker-compose.yml to use the public IP:

```yaml
- 'traefik.http.services.${SERVICE_NAME_STAGE}.loadbalancer.server.url=http://38.242.204.63:3333'
```




