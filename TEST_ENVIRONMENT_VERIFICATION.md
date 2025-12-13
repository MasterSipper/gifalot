# Test Environment Verification Guide

## 1. Check Container Status

```bash
# Check all test containers are running
docker ps | grep test

# Should show:
# - services-gif-j-backend-test-app-1 (and app-2 if scaled)
# - services-gif-j-backend-test-redis-1
# - services-gif-j-backend-test-mysql-1 (if using local MySQL)
# - gifalot-frontend-test
```

## 2. Verify Environment Variables

```bash
# Check backend has correct environment variables
docker exec services-gif-j-backend-test-app-1 env | grep -E "REDIS_HOST|MYSQL_HOST|MYSQL_USER|MYSQL_DB|PORT|STAGE"

# Should show:
# REDIS_HOST=localhost  ✅ (not gif-j-backend-test-redis)
# PORT=3334
# STAGE=test
# MYSQL_HOST=<should have value>
# MYSQL_USER=<should have value>
# MYSQL_DB=<should have value>
```

## 3. Test Backend Connectivity

```bash
# Test backend is listening on port 3334
curl -I http://localhost:3334/

# Should return HTTP 200 or 404 (not connection refused)

# Test backend API endpoint
curl -I http://localhost:3334/gif-j/

# Test with specific endpoint (e.g., health check if available)
curl http://localhost:3334/gif-j/ping 2>/dev/null || echo "Endpoint not available"
```

## 4. Test Frontend Connectivity

```bash
# Test frontend is listening on port 8081
curl -I http://localhost:8081/

# Should return HTTP 200 with nginx server
```

## 5. Test via Domain (HTTPS)

```bash
# Test frontend via domain
curl -I https://test.gifalot.com/

# Should return HTTP 200

# Test backend API via domain
curl -I https://test.gifalot.com/gif-j/

# Should return HTTP 200 or appropriate status (not 502 Bad Gateway)

# Test with verbose output to see SSL certificate
curl -v https://test.gifalot.com/ 2>&1 | grep -E "HTTP|SSL|certificate"
```

## 6. Check Backend Logs

```bash
# Check for errors in backend logs
docker logs services-gif-j-backend-test-app-1 --tail 50

# Should NOT show:
# ❌ "getaddrinfo EAI_AGAIN gif-j-backend-test-redis"
# ❌ "Access denied for user ''"
# ❌ "Connection refused"

# Should show:
# ✅ Application started successfully
# ✅ Connected to database
# ✅ Connected to Redis
```

## 7. Test Traefik Routing

```bash
# Check if Traefik has loaded test routes
curl -s http://localhost:8080/api/http/routers | grep -i test

# Or check Traefik dashboard (if accessible)
# Visit: http://your-server-ip:8080 (if dashboard is enabled)
```

## 8. Test Redis Connection

```bash
# Check if Redis is accessible on the correct port (6380 for test)
docker exec services-gif-j-backend-test-app-1 sh -c 'echo "PING" | nc localhost 6380' 2>/dev/null || echo "Redis connection test failed"

# Or check Redis container logs
docker logs services-gif-j-backend-test-redis-1 --tail 20
```

## 9. Test MySQL Connection

```bash
# Check MySQL connection (if using local MySQL)
docker logs services-gif-j-backend-test-mysql-1 --tail 20

# Check backend logs for MySQL connection success
docker logs services-gif-j-backend-test-app-1 2>&1 | grep -i "database\|mysql" | tail -10
```

## 10. Functional Testing in Browser

1. **Open browser**: Visit `https://test.gifalot.com`
   - Should load the frontend
   - SSL certificate should be valid (no warnings)
   
2. **Test API calls**: Open browser DevTools → Network tab
   - Navigate the site
   - API calls to `https://test.gifalot.com/gif-j/*` should work
   - Should NOT get CORS errors
   - Should NOT get 502 Bad Gateway errors

3. **Verify it's the test environment**:
   - Check if there's any indicator it's the test environment
   - Try logging in/using features to ensure it's functional

## 11. Compare with Dev Environment

```bash
# Check dev environment is still working
curl -I https://dev.gifalot.com/

# Should still work (confirming test didn't break dev)
```

## Summary Checklist

- [ ] All test containers are running
- [ ] REDIS_HOST=localhost in backend container
- [ ] Backend responds on localhost:3334
- [ ] Frontend responds on localhost:8081
- [ ] HTTPS works for test.gifalot.com
- [ ] Backend API works via test.gifalot.com/gif-j/
- [ ] No Redis connection errors in logs
- [ ] No MySQL connection errors in logs
- [ ] Browser can access test.gifalot.com
- [ ] Dev environment still works


