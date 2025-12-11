# Find Redis Container

Run these commands to find the correct Redis container name:

```bash
# List all running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Find Redis container
docker ps | grep redis

# Or find by image
docker ps --filter "ancestor=redis:7.0.10-alpine"
```

Once you find the correct container name, get its IP:

```bash
docker inspect <container-name> | grep -i ipaddress
```

Or get it directly:
```bash
docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container-name>
```





