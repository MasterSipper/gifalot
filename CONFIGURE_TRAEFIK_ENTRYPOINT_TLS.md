# Configure Traefik Entrypoint TLS

## Problem
TLS certificate needs to be configured at the entrypoint level, not just in the router.

## Solution: Configure Default Certificate in Static Config

Traefik needs the default certificate configured for the entrypoint. Since we're using command-line flags for entrypoints, we need to either:
1. Add certificate config to command flags
2. Or configure it in static traefik.yml

## Step 1: Check Static Config

```bash
cat /etc/traefik/traefik.yml
```

## Step 2: Update Static Config or Command

We need to configure the default certificate for the websecure entrypoint. This can be done via:
- Command line flags: `--entrypoints.websecure.tls.certificates[0].certFile=/certs/fullchain.pem`
- Or in static traefik.yml

Let me update the docker-compose.yml to add the certificate to the command.





