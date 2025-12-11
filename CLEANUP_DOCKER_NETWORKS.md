# Clean Up Duplicate Docker Networks

## Error
```
network services-gif-j-backend-test_gif-j is ambiguous (2 matches found on name)
```

## Quick Fix: Clean Up on Server

Run these commands on your server:

```bash
# List all networks to see the duplicates
docker network ls | grep gif-j-backend-test

# Inspect the network to see what's using it
docker network inspect services-gif-j-backend-test_gif-j

# Remove the duplicate network(s)
# First, stop any containers using it
docker ps -a | grep gif-j-backend-test

# Remove containers if needed
docker stop $(docker ps -aq --filter "name=gif-j-backend-test")
docker rm $(docker ps -aq --filter "name=gif-j-backend-test")

# Remove the duplicate network
docker network rm services-gif-j-backend-test_gif-j

# If there are still duplicates, remove all with that pattern
docker network ls | grep "services-gif-j-backend-test_gif-j" | awk '{print $1}' | xargs -r docker network rm

# Or prune unused networks (be careful - this removes ALL unused networks)
docker network prune -f
```

## Safer Approach: Remove Only Test Environment Networks

```bash
# List test environment networks
docker network ls | grep "gif-j-backend-test"

# Remove them one by one (replace NETWORK_ID with actual ID)
docker network rm NETWORK_ID

# Or remove by name pattern
docker network rm services-gif-j-backend-test_gif-j
```

## After Cleanup

Re-run the workflow and the backend deployment should succeed.

