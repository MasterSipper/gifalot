# Configure Traefik for test.gifalot.com

## Problem
Getting 404 on `test.gifalot.com` - Traefik routing not configured.

## Solution: Create Traefik Dynamic Config

**On your server, run these commands:**

```bash
# Check if Traefik dynamic config directory exists
ls -la /home/ansible/infrastructure/traefik/dynamic/

# Check what dev config looks like (for reference)
cat /home/ansible/infrastructure/traefik/dynamic/*.yml 2>/dev/null | head -30

# Create test environment Traefik config
cat > /home/ansible/infrastructure/traefik/dynamic/test.yml << 'EOF'
http:
  routers:
    test-frontend:
      rule: "Host(`test.gifalot.com`) && !PathPrefix(`/gif-j`)"
      service: test-frontend-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 1
    
    test-backend:
      rule: "Host(`test.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: test-backend-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 10
  
  services:
    test-frontend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:8081"
    
    test-backend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3334"
EOF

# Set permissions
chown ansible:ansible /home/ansible/infrastructure/traefik/dynamic/test.yml
chmod 644 /home/ansible/infrastructure/traefik/dynamic/test.yml

# Restart Traefik to pick up new config
docker restart infrastructure-traefik-traefik-1

# Or if container has different name:
docker ps | grep traefik
# Then restart the correct container name
```

## Alternative: If Traefik Uses 'web' Entrypoint (HTTP only)

If your Traefik doesn't have HTTPS configured, use this config instead:

```bash
cat > /home/ansible/infrastructure/traefik/dynamic/test.yml << 'EOF'
http:
  routers:
    test-frontend:
      rule: "Host(`test.gifalot.com`) && !PathPrefix(`/gif-j`)"
      service: test-frontend-service
      entryPoints:
        - web
      priority: 1
    
    test-backend:
      rule: "Host(`test.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: test-backend-service
      entryPoints:
        - web
      priority: 10
  
  services:
    test-frontend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:8081"
    
    test-backend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3334"
EOF
```

## Verify Configuration

```bash
# Check Traefik logs for errors
docker logs infrastructure-traefik-traefik-1 | tail -50

# Check if config file is loaded
docker exec infrastructure-traefik-traefik-1 cat /etc/traefik/dynamic/test.yml

# Test routing
curl -I http://test.gifalot.com/
curl -I http://test.gifalot.com/gif-j/
```

## After Configuration

1. Wait 10-30 seconds for Traefik to reload
2. Test: `curl -I https://test.gifalot.com/`
3. Should return 200 OK (or 404 if frontend files aren't there yet, but not a Traefik 404)


