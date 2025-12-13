# Fix Test Routing

The Traefik configuration looks correct, but let's verify it's loaded and check for any issues:

```bash
# 1. Check if Traefik can see the test routes (via API)
curl -s http://localhost:8080/api/http/routers | grep -i test

# 2. Check Traefik API for all routers
curl -s http://localhost:8080/api/http/routers | jq '.[] | select(.name | contains("test"))'

# 3. Check if there are any errors loading the dynamic config
docker logs traefik-traefik-1 2>&1 | grep -i "test\|error" | tail -20

# 4. Verify the dynamic config file syntax (YAML)
cat /home/ansible/infrastructure/traefik/dynamic/test.yml | python3 -c "import yaml, sys; yaml.safe_load(sys.stdin)" 2>&1

# 5. Test HTTP (should redirect to HTTPS)
curl -I http://test.gifalot.com/

# 6. Test HTTPS with verbose output
curl -v -k https://test.gifalot.com/ 2>&1 | head -30

# 7. Check if the backend is actually running on port 3334
curl -I http://localhost:3334/

# 8. Check if the frontend is actually running on port 8081
curl -I http://localhost:8081/
```

The issue might be:
1. Traefik hasn't picked up the dynamic config file yet
2. The backend/frontend services aren't running on the expected ports
3. There's a YAML syntax error in the dynamic config


