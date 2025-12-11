# Apply Host Networking Fix for Simply MySQL

## Step 1: Update docker-compose.yml

Edit the `app` service to use host networking:

```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend
nano docker-compose.yml
```

Find the `app:` section and modify it:

```yaml
app:
  network_mode: "host"  # Add this line
  hostname: '${SERVICE_NAME_STAGE}'
  build: '.'
  environment:
    # ... all your env vars stay the same
  # Remove or comment out:
  # networks:
  #   - 'gif-j'
  #   - 'infrastructure-traefik'
  # Remove depends_on if it causes issues:
  # depends_on:
  #   - 'mysql'
  #   - 'redis'
  restart: 'always'
```

## Step 2: Update .env for Redis

Your `.env` should have:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=mystic-cheese-swindler-moto
```

This is correct! ✅

## Step 3: Ensure Redis Port is Exposed

Check that Redis container exposes port 6379 to the host:

```bash
# Check if Redis port is accessible
netstat -tlnp | grep 6379
# Or
ss -tlnp | grep 6379
```

If Redis port is not exposed, you may need to ensure the Redis container has:
```yaml
ports:
  - '6379:6379'
```

## Step 4: Restart Containers

```bash
# Stop everything
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose down

# Rebuild and start
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app

# Check logs
docker logs services-gif-j-backend-dev-app-1 --tail 50
```

## Step 5: Verify Connections

After restart, check logs for:
- ✅ MySQL connection successful (should show from 38.242.204.63)
- ✅ Redis connection successful
- ✅ Application started

## Important Notes

- **Host networking** makes the container use the host's network stack
- Connections will appear from `38.242.204.63` (your VPS IP)
- Redis must be accessible on `localhost:6379` from the host
- Traefik labels might need adjustment if using host networking

## If Redis Connection Fails

If Redis can't connect after switching to host networking:

1. **Check Redis is running:**
   ```bash
   docker ps | grep redis
   ```

2. **Check Redis port is exposed:**
   ```bash
   docker port services-gif-j-backend-dev-redis-1
   ```

3. **Test Redis connection from host:**
   ```bash
   redis-cli -h localhost -p 6379 -a mystic-cheese-swindler-moto ping
   ```

4. **If Redis port isn't exposed, update docker-compose.yml:**
   ```yaml
   redis:
     ports:
       - '6379:6379'  # Ensure this is present
   ```





