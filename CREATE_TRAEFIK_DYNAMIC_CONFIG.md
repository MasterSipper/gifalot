# Create Traefik Dynamic Config File

## Problem
The heredoc command didn't work when pasted as a single line.

## Solution: Create File Step by Step

On your server, run these commands one at a time:

```bash
# 1. Create directory (if not exists)
mkdir -p /home/ansible/infrastructure/traefik/dynamic

# 2. Create the file using echo (simpler method)
cat > /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml << 'ENDOFFILE'
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
ENDOFFILE

# 3. Verify the file was created
cat /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml

# 4. Check file permissions
ls -la /home/ansible/infrastructure/traefik/dynamic/
```

## Alternative: Use nano or vi

If the heredoc still doesn't work:

```bash
nano /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml
```

Then paste this content:
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

Save with Ctrl+X, then Y, then Enter.

## Or Use printf

```bash
printf 'http:\n  routers:\n    backend-dev:\n      rule: "PathPrefix(`/gif-j`)"\n      service: backend-service-dev\n      entryPoints:\n        - web\n\n  services:\n    backend-service-dev:\n      loadBalancer:\n        servers:\n          - url: "http://38.242.204.63:3333"\n' > /home/ansible/infrastructure/traefik/dynamic/backend-dev.yml
```




