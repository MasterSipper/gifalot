# Fix Traefik Let's Encrypt Certificate

## Problem
Traefik is still using default certificate instead of Let's Encrypt.

## Step 1: Verify Certificate Files are Accessible

```bash
# Check if cert files exist in container
docker exec traefik-traefik-1 ls -la /certs/

# Check file contents
docker exec traefik-traefik-1 head -5 /certs/fullchain.pem
docker exec traefik-traefik-1 head -5 /certs/privkey.pem
```

## Step 2: Check Traefik Logs for TLS Errors

```bash
docker logs traefik-traefik-1 2>&1 | grep -i "cert\|tls\|error"
```

## Step 3: Alternative - Use CertResolver

If file-based certs don't work, we might need to configure a certResolver in the static config, or use a different TLS configuration approach.

## Step 4: Check if Router Needs Different TLS Config

In Traefik v2.9, the TLS configuration might need to be:
- Configured at the entrypoint level (static config)
- Or use a certResolver
- Or the file paths need to be absolute

Let me check the Traefik static config to see how TLS is configured there.





