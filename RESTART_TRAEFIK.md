# Restart Traefik Container

## Container Name
The Traefik container is named: `traefik-traefik-1`

## Restart Command

```bash
docker restart traefik-traefik-1
```

## Verify It's Running

```bash
# Check container status
docker ps | grep traefik

# Check Traefik logs for errors
docker logs traefik-traefik-1 | tail -50

# Verify config is loaded
docker exec traefik-traefik-1 cat /etc/traefik/dynamic/test.yml
```

## Test After Restart

Wait 10-30 seconds, then test:

```bash
curl -I https://test.gifalot.com/
curl -I https://test.gifalot.com/gif-j/
```

Both should return 200 OK (or frontend 404 if files aren't there, but not Traefik 404).


