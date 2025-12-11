# Stop MySQL Container to Fix Port Conflict

## Problem
The test environment MySQL container can't start because the port is already allocated (likely by dev environment).

## Solution: Stop Dev MySQL Container

Since you're using external MySQL (mysql96.unoeuro.com), you don't need the MySQL container running.

**On your server, run:**

```bash
# Check what MySQL containers are running
docker ps | grep mysql

# Stop and remove dev MySQL container
docker stop services-gif-j-backend-dev-mysql-1 2>/dev/null
docker rm services-gif-j-backend-dev-mysql-1 2>/dev/null

# Or stop all MySQL containers
docker stop $(docker ps -q --filter "name=mysql") 2>/dev/null
docker rm $(docker ps -q --filter "name=mysql") 2>/dev/null

# Verify port is free
sudo netstat -tlnp | grep 3306
```

## Alternative: Use Different Port for Test

If you need both dev and test MySQL containers, use different ports. But since you're using external MySQL, this shouldn't be necessary.

## After Stopping Container

Re-run the workflow and the backend deployment should succeed.

