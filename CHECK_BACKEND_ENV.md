# Check Backend Environment Variables

The backend is still using the old Redis hostname. Check and fix:

```bash
# 1. Check what environment variables the container actually has
docker exec services-gif-j-backend-test-app-1 env | grep -E "REDIS_HOST|MYSQL_|REDIS_PORT"

# 2. Check the actual docker-compose.yml file on the server
cat /home/ansible/services/test/gif-j-backend/docker-compose.yml | grep -A 40 "app:"

# 3. If the environment variables are wrong, we need to recreate the containers
# Stop and remove the test backend containers
docker stop services-gif-j-backend-test-app-1 services-gif-j-backend-test-app-2 2>/dev/null
docker rm services-gif-j-backend-test-app-1 services-gif-j-backend-test-app-2 2>/dev/null

# 4. Then redeploy via GitHub Actions or manually run docker-compose up
```


