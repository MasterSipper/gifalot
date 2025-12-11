# Check MySQL Port Conflict

## Error
```
Bind for 0.0.0.0:*** failed: port is already allocated
```

## Quick Check on Server

Run these commands on your server to see what's using the MySQL port:

```bash
# Check what's using port 3306 (default MySQL port)
sudo netstat -tlnp | grep 3306
# or
sudo ss -tlnp | grep 3306

# Check running MySQL containers
docker ps | grep mysql

# Check all containers
docker ps -a | grep mysql
```

## Solution: Stop Conflicting Container

If the dev environment MySQL container is running and using the port:

```bash
# Stop and remove dev MySQL container
docker stop services-gif-j-backend-dev-mysql-1 2>/dev/null
docker rm services-gif-j-backend-dev-mysql-1 2>/dev/null

# Or stop all MySQL containers
docker stop $(docker ps -q --filter "name=mysql") 2>/dev/null
```

## Alternative: Use Different Port for Test

If you need both dev and test MySQL containers running, use different ports. But since you're using external MySQL (mysql96.unoeuro.com), you probably don't need the container.

## After Fixing

Re-run the workflow and the backend deployment should succeed.

