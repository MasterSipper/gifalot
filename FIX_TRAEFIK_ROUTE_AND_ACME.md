# Fix Traefik Route and ACME Certificate

## Step 1: Check if Route is Registered

```bash
# Check if Traefik sees the router
docker logs traefik-traefik-1 2>&1 | grep -i "backend-dev\|router\|dynamic" | tail -20

# Check full recent logs
docker logs traefik-traefik-1 --tail 50
```

**Expected Result:**
- Should see messages about loading configuration from file
- Should see router registration messages (if Traefik logs them)
- No errors about missing routes

## Step 2: Verify Dynamic Config is Loaded

```bash
# Check if file is visible in container
docker exec traefik-traefik-1 cat /etc/traefik/dynamic/backend-dev.yml

# Check if file provider is watching
docker logs traefik-traefik-1 2>&1 | grep -i "file\|dynamic\|watch"
```

**Expected Result:**
- Should see the backend-dev.yml content
- Should see file provider messages in logs (if Traefik logs them)

## Step 3: Test HTTP Route

```bash
# Test HTTP (should redirect to HTTPS)
curl -I http://dev.gifalot.com/gif-j/

# Test HTTPS with full path
curl -k -I https://dev.gifalot.com/gif-j/
curl -k -I https://dev.gifalot.com/gif-j/auth/login
```

**Expected Result:**
- HTTP should return `308 Permanent Redirect` to HTTPS
- HTTPS should return `200 OK` (not 404)
- Should see backend response headers

## Step 4: Update Router with Host Rule

If Step 3 returns 404, the router needs a Host rule:

```bash
cat > /etc/traefik/dynamic/backend-dev.yml << 'EOF'
http:
  routers:
    backend-dev:
      rule: "Host(`dev.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: backend-service-dev
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
  
  services:
    backend-service-dev:
      loadBalancer:
        servers:
          - url: "http://localhost:3333"
EOF

# Restart Traefik
docker restart traefik-traefik-1
sleep 5
```

**Expected Result:**
- File updated successfully
- Traefik restarts without errors

## Step 5: Test Route Again

```bash
# Test HTTPS
curl -k -I https://dev.gifalot.com/gif-j/

# Wait for ACME (if route works)
sleep 30

# Check if acme.json was created
ls -la /letsencrypt/
cat /letsencrypt/acme.json 2>/dev/null | head -30
```

**Expected Result:**
- HTTPS should return `200 OK`
- After 30 seconds, `acme.json` should exist and contain JSON data
- Certificate should be generated automatically

## Step 6: Verify Certificate

```bash
# Test certificate
openssl s_client -connect dev.gifalot.com:443 -servername dev.gifalot.com < /dev/null 2>/dev/null | openssl x509 -noout -subject -issuer -dates
```

**Expected Result:**
- Subject should show `CN = dev.gifalot.com` (or similar)
- Issuer should show `Let's Encrypt` (not "TRAEFIK DEFAULT CERT")
- Dates should be valid (notBefore/notAfter in the future)




