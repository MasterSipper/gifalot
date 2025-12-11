# Fix Nginx 403 - Permissions Issue

## Issue 1: Bash History Expansion

The `!` character in the HTML is being interpreted by bash. Use single quotes instead.

## Issue 2: 403 Forbidden

Even with a file, you're getting 403. This is likely a permissions issue.

---

## Fix Commands

```bash
# Fix 1: Create test file with single quotes (avoids bash history expansion)
echo '<h1>Test Environment Working!</h1>' > /var/www/gifalot-frontend-test/index.html

# Fix 2: Set proper permissions
chmod 644 /var/www/gifalot-frontend-test/index.html
chown root:root /var/www/gifalot-frontend-test/index.html

# Fix 3: Ensure directory permissions are correct
chmod 755 /var/www/gifalot-frontend-test
chown root:root /var/www/gifalot-frontend-test

# Verify file exists and has correct permissions
ls -la /var/www/gifalot-frontend-test/

# Test again
curl http://localhost:8081/
```

**Expected output:**
- Should see: `<h1>Test Environment Working!</h1>`
- Not: `403 Forbidden`

---

## If Still Getting 403

Check nginx error logs:

```bash
# Check nginx error logs
docker logs gifalot-frontend-test 2>&1 | grep -i "403\|permission\|denied"

# Check if nginx can read the file
docker exec gifalot-frontend-test ls -la /usr/share/nginx/html/

# Check nginx user permissions
docker exec gifalot-frontend-test id
```

---

## Alternative: Check SELinux (if enabled)

If SELinux is enabled, it might be blocking access:

```bash
# Check if SELinux is enabled
getenforce

# If it shows "Enforcing", you may need to set context
# (Usually not needed, but just in case)
```

---

## Quick Test

```bash
# Create file with proper permissions
echo '<h1>Test Works!</h1>' > /var/www/gifalot-frontend-test/index.html
chmod 644 /var/www/gifalot-frontend-test/index.html

# Test
curl http://localhost:8081/
```

This should work! The key is using **single quotes** to avoid bash history expansion.


