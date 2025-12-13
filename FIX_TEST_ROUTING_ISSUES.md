# Fix Test Routing Issues

Two problems found:
1. **Backend not running on port 3334**
2. **test.yml file not in Traefik's dynamic directory**

## Fix 1: Copy test.yml to the correct location

The Traefik container mounts `/etc/traefik/dynamic` on the host, but we created the file at `/home/ansible/infrastructure/traefik/dynamic/test.yml`.

Run these commands:

```bash
# Check where Traefik is actually reading from
docker inspect traefik-traefik-1 | grep -A 5 "Mounts"

# Copy test.yml to the correct location (if different)
# Option 1: If Traefik reads from /etc/traefik/dynamic on host
sudo cp /home/ansible/infrastructure/traefik/dynamic/test.yml /etc/traefik/dynamic/test.yml
sudo chown root:root /etc/traefik/dynamic/test.yml
sudo chmod 644 /etc/traefik/dynamic/test.yml

# Option 2: If they're the same (symlink or same path)
# Verify the path
ls -la /home/ansible/infrastructure/traefik/dynamic/test.yml
ls -la /etc/traefik/dynamic/test.yml

# Restart Traefik to pick up the new file
docker restart traefik-traefik-1

# Verify it's loaded
docker exec traefik-traefik-1 ls -la /etc/traefik/dynamic/
curl -s http://localhost:8080/api/http/routers | grep -i test
```

## Fix 2: Check why backend isn't running on port 3334

```bash
# Check if test backend containers are running
docker ps | grep test

# Check backend logs
docker ps -a | grep "services-gif-j-backend-test-app"
docker logs services-gif-j-backend-test-app-1 --tail 50

# Check if port 3334 is in use
sudo netstat -tlnp | grep 3334

# Check the test backend directory
ls -la /home/ansible/services/test/gif-j-backend/
```


