# Fix Traefik SSL Certificate

## Problem
Browser shows `ERR_CERT_AUTHORITY_INVALID` because Traefik is using self-signed certificate instead of Let's Encrypt.

## Solution: Configure Router to Use Let's Encrypt Certificates

The Let's Encrypt certificates are mounted at `/certs/` but the router needs to be configured to use them.

## Update Dynamic Config

```bash
cat > /etc/traefik/dynamic/backend-dev.yml << 'EOF'
http:
  routers:
    backend-dev:
      rule: "PathPrefix(`/gif-j`)"
      service: backend-service-dev
      entryPoints:
        - websecure
      tls:
        certFile: /certs/fullchain.pem
        keyFile: /certs/privkey.pem
  
  services:
    backend-service-dev:
      loadBalancer:
        servers:
          - url: "http://localhost:3333"
EOF
```

## Restart Traefik

```bash
# Restart to reload config
docker restart traefik-traefik-1
sleep 3

# Test again
curl -k -I https://dev.gifalot.com/gif-j/
```

## Verify Certificate

```bash
# Check certificate details
openssl s_client -connect dev.gifalot.com:443 -servername dev.gifalot.com < /dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

Should show Let's Encrypt as issuer.




