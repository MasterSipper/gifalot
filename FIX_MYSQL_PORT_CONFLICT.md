# Fix MySQL Port Conflict

## Error
```
Bind for 0.0.0.0:*** failed: port is already allocated
```

## Problem
The test environment MySQL container is trying to bind to a port that's already in use (likely by the dev environment MySQL container).

## Solution Options

### Option 1: Stop Dev MySQL Container (If Not Needed)

If you're using external MySQL (mysql96.unoeuro.com), you might not need the MySQL container running:

```bash
# On your server, check what's using the port
docker ps | grep mysql

# Stop dev MySQL container if it exists
docker stop services-gif-j-backend-dev-mysql-1
docker rm services-gif-j-backend-dev-mysql-1
```

### Option 2: Use Different MySQL Port for Test

The test environment should use a different MySQL port. Check what port is configured:

```bash
# Check what MySQL port is set in secrets
# MYSQL_PORT_DEV is probably 3306

# For test, we could use 3307 or another port
```

### Option 3: Don't Run MySQL Container for Test

Since you're using external MySQL (mysql96.unoeuro.com), the test environment might not need a MySQL container at all. But this would require modifying docker-compose.yml.

## Quick Fix: Check What's Using the Port

Run on your server:

```bash
# Find what's using the MySQL port
sudo netstat -tlnp | grep 3306
# or
sudo ss -tlnp | grep 3306

# Check running MySQL containers
docker ps | grep mysql

# Stop conflicting containers
docker stop $(docker ps -q --filter "name=mysql")
```

## Recommended: Use External MySQL Only

Since you're using mysql96.unoeuro.com, you might want to:
1. Not run MySQL container in test environment
2. Or use a different port for the test MySQL container (e.g., 3307)

Let me know which approach you prefer!
