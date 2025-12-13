# Check Traefik Status

Run these commands on the server to diagnose the issue:

```bash
# 1. Check if Traefik container is running
docker ps | grep traefik

# 2. Check what ports Traefik is listening on
docker port traefik-traefik-1

# 3. Check Traefik logs for errors
docker logs traefik-traefik-1 --tail 50

# 4. Check the actual Traefik configuration on the server
cat /home/ansible/infrastructure/traefik/docker-compose.yml

# 5. Check if Traefik is listening on ports 80 and 443
sudo netstat -tlnp | grep -E ":(80|443)"

# 6. Check the dynamic configuration file
cat /home/ansible/infrastructure/traefik/dynamic/test.yml
```

The issue is likely that:
1. Traefik crashed after restart (check logs)
2. Port 443 is not exposed in the Traefik container
3. The dynamic configuration file has syntax errors


