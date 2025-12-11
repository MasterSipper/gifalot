# Fix SSL Certificate for test.gifalot.com

## Issue

Getting SSL certificate errors when accessing `https://test.gifalot.com/`. This is normal - Let's Encrypt needs to generate the certificate first.

---

## Step 1: Verify DNS is Working

First, check if DNS is resolving correctly:

```bash
# Check DNS resolution
nslookup test.gifalot.com
# OR
dig test.gifalot.com

# Should resolve to: 38.242.204.63
```

**If DNS isn't resolving yet:**
- Wait 5-15 minutes for DNS propagation
- Verify DNS record was added correctly

---

## Step 2: Test HTTP (Not HTTPS)

Test if the site works over HTTP first:

```bash
# Test HTTP (should work even without SSL)
curl -I http://test.gifalot.com/
curl -I http://test.gifalot.com/gif-j/
```

**Expected:**
- Should return `200 OK` or `404` (not SSL errors)
- This confirms Traefik routing is working

---

## Step 3: Verify Traefik Configuration

Check if Traefik config was created correctly:

```bash
# Check if test.yml exists
cat /home/ansible/infrastructure/traefik/dynamic/test.yml

# Verify Traefik is reading it
docker logs traefik-traefik-1 | tail -20 | grep -i test
```

**Expected:**
- Config file should exist
- Traefik logs should show it's reading the config

---

## Step 4: Check Traefik SSL Configuration

Verify Traefik has Let's Encrypt configured:

```bash
# Check Traefik container configuration
docker inspect traefik-traefik-1 | grep -A 10 "Cmd"

# Look for:
# - '--certificatesresolvers.le.acme...'
# - '--entrypoints.websecure.address=:443'
```

**If Let's Encrypt is NOT configured:**
- You may need to configure it first
- Or use HTTP instead of HTTPS for testing

---

## Step 5: Wait for Let's Encrypt Certificate

Let's Encrypt needs to:
1. Verify domain ownership
2. Generate certificate
3. This can take 1-5 minutes

**Check certificate status:**

```bash
# Check if certificate is being requested
docker logs traefik-traefik-1 | grep -i "test.gifalot.com\|acme\|certificate"

# Check Let's Encrypt directory (if mounted)
ls -la /home/ansible/infrastructure/traefik/letsencrypt/ 2>/dev/null || echo "Let's Encrypt directory not found"
```

---

## Step 6: Test with -k Flag (Bypass SSL Verification)

For testing purposes, you can bypass SSL verification:

```bash
# Test with SSL verification bypassed
curl -k -I https://test.gifalot.com/
curl -k -I https://test.gifalot.com/gif-j/
```

**Expected:**
- Should return `200 OK` or `404` (not SSL errors)
- The `-k` flag tells curl to ignore certificate errors

---

## Step 7: Verify Traefik Entrypoints

Check if Traefik has the `websecure` entrypoint configured:

```bash
# Check Traefik configuration
docker exec traefik-traefik-1 cat /etc/traefik/traefik.yml 2>/dev/null || \
docker inspect traefik-traefik-1 | grep -A 20 "Cmd" | grep websecure
```

**If websecure is NOT configured:**

You have two options:

### Option A: Use HTTP Entrypoint (Simpler for Testing)

Update the Traefik config to use `web` instead of `websecure`:

```bash
# Edit the test.yml config
cat > /home/ansible/infrastructure/traefik/dynamic/test.yml << 'EOF'
http:
  routers:
    test-frontend:
      rule: "Host(`test.gifalot.com`) && !PathPrefix(`/gif-j`)"
      service: test-frontend-service
      entryPoints:
        - web
      priority: 1
    test-backend:
      rule: "Host(`test.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: test-backend-service
      entryPoints:
        - web
      priority: 10
  services:
    test-frontend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:8081"
    test-backend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3334"
EOF

# Restart Traefik
docker restart traefik-traefik-1
sleep 3

# Test HTTP (not HTTPS)
curl -I http://test.gifalot.com/
```

### Option B: Configure Let's Encrypt in Traefik

If you want HTTPS, you need to configure Let's Encrypt in Traefik. Check your existing dev setup to see how it's configured.

---

## Quick Test Commands

```bash
# 1. Test DNS
nslookup test.gifalot.com

# 2. Test HTTP (should work)
curl -I http://test.gifalot.com/

# 3. Test HTTPS with verification bypass (for testing)
curl -k -I https://test.gifalot.com/

# 4. Check Traefik logs
docker logs traefik-traefik-1 | tail -30
```

---

## Expected Results

**If everything is working:**
- HTTP should work: `curl -I http://test.gifalot.com/` → `200 OK` or `404`
- HTTPS with `-k` should work: `curl -k -I https://test.gifalot.com/` → `200 OK` or `404`
- HTTPS without `-k` will fail until Let's Encrypt certificate is generated

**Once Let's Encrypt certificate is generated (1-5 minutes):**
- HTTPS without `-k` will work: `curl -I https://test.gifalot.com/` → `200 OK`

---

## Troubleshooting

### Issue: HTTP doesn't work either

**Solution:** Check Traefik routing:
```bash
docker logs traefik-traefik-1 | grep -i "test.gifalot.com"
# Should show routing rules
```

### Issue: Let's Encrypt certificate never generates

**Possible causes:**
- DNS not fully propagated
- Traefik Let's Encrypt not configured
- Port 443 not accessible
- Domain verification failing

**Check:**
```bash
# Check if port 443 is open
netstat -tuln | grep 443

# Check Traefik Let's Encrypt config
docker logs traefik-traefik-1 | grep -i acme
```

---

## Next Steps

1. ✅ Verify DNS is working
2. ✅ Test HTTP (should work)
3. ✅ Use `-k` flag for HTTPS testing until certificate is ready
4. ⏳ Wait 1-5 minutes for Let's Encrypt certificate
5. ✅ Test HTTPS without `-k` once certificate is ready

The SSL certificate will be automatically generated by Traefik/Let's Encrypt once everything is configured correctly!


