# Remove Duplicate Networks by ID

## Problem
Two networks with the same name but different IDs:
- `35f518f91690` - services-gif-j-backend-test_gif-j
- `5afc0def24d8` - services-gif-j-backend-test_gif-j

## Solution: Remove by Network ID

Run these commands on your server:

```bash
# First, check if any containers are using these networks
docker network inspect 35f518f91690 | grep -A 10 "Containers"
docker network inspect 5afc0def24d8 | grep -A 10 "Containers"

# If containers are using them, stop and remove containers first
docker ps -a | grep gif-j-backend-test

# Stop and remove test containers
docker stop $(docker ps -aq --filter "name=gif-j-backend-test") 2>/dev/null
docker rm $(docker ps -aq --filter "name=gif-j-backend-test") 2>/dev/null

# Now remove networks by ID
docker network rm 35f518f91690
docker network rm 5afc0def24d8

# Verify they're gone
docker network ls | grep gif-j-backend-test
```

## Alternative: Force Remove

If the above doesn't work, you can force remove:

```bash
# Force remove by ID (disconnects containers first)
docker network rm -f 35f518f91690
docker network rm -f 5afc0def24d8
```

## After Removal

Re-run the workflow and the backend deployment should succeed.

