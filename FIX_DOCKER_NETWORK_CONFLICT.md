# Fix Docker Network Conflict

## Error
```
network services-gif-j-backend-test_gif-j is ambiguous (2 matches found on name)
```

## Problem
There are duplicate Docker networks with the same name, likely from previous deployments or both dev/test environments.

## Solution: Clean Up Duplicate Networks

Run these commands on your server to find and remove duplicate networks:

```bash
# List all networks
docker network ls | grep gif-j

# Find the duplicate network
docker network inspect services-gif-j-backend-test_gif-j

# Remove duplicate networks (be careful - only remove test environment networks)
docker network rm services-gif-j-backend-test_gif-j

# Or remove all networks with the pattern
docker network prune -f
```

## Alternative: Make Network Names Unique

We can update the docker-compose.yml to use a unique network name for the test environment. The network name should include the STAGE variable.

## Quick Fix: Clean Up on Server

The fastest fix is to clean up the duplicate networks:

```bash
# On your server
docker network ls | grep gif-j-backend-test

# Remove the duplicate network(s)
docker network rm services-gif-j-backend-test_gif-j

# Or remove all unused networks
docker network prune -f
```

## After Cleanup

Re-run the workflow and the backend deployment should succeed.

