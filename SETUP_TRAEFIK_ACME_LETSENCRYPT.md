# Setup Traefik ACME/Let's Encrypt

## Problem
Browser blocks requests due to invalid certificate. Need proper Let's Encrypt certificates.

## Solution: Configure ACME/Let's Encrypt in Traefik

### Step 1: Update docker-compose.yml

Add ACME configuration to Traefik command:

```yaml
command:
  - '--providers.docker=true'
  - '--providers.docker.exposedbydefault=false'
  - '--providers.file.directory=/etc/traefik/dynamic'
  - '--providers.file.watch=true'
  - '--entrypoints.web.address=:80'
  - '--entrypoints.websecure.address=:443'
  - '--entrypoints.web.http.redirections.entryPoint.to=websecure'
  - '--entrypoints.web.http.redirections.entryPoint.scheme=https'
  - '--entrypoints.web.http.redirections.entrypoint.permanent=true'
  - '--certificatesresolvers.letsencrypt.acme.tlschallenge=true'
  - '--certificatesresolvers.letsencrypt.acme.email=your-email@example.com'
  - '--certificatesresolvers.letsencrypt.acme.storage=/letsencrypt/acme.json'
```

### Step 2: Add Volume for ACME Storage

```yaml
volumes:
  - '/var/run/docker.sock:/var/run/docker.sock:ro'
  - '/etc/traefik/traefik.yml:/etc/traefik/traefik.yml:ro'
  - '/etc/traefik/dynamic:/etc/traefik/dynamic:ro'
  - '/letsencrypt:/letsencrypt'  # ADD THIS
```

### Step 3: Update Dynamic Config to Use CertResolver

```yaml
http:
  routers:
    backend-dev:
      rule: "PathPrefix(`/gif-j`)"
      service: backend-service-dev
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
```

### Step 4: Create ACME Storage Directory

```bash
mkdir -p /letsencrypt
chmod 600 /letsencrypt
```




