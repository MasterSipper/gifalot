# Fix Both Backend and Frontend Issues

## Issue 1: Backend - Docker Compose Build Parameter ✅ FIXED

**Error:**
```
value of build must be one of: always, never, policy, got: True
```

**Fix Applied:**
Changed `build: true` to `build: 'always'` in the Ansible playbook.

This has been committed and pushed.

## Issue 2: Frontend - Permission Denied ⚠️ NEEDS SERVER FIX

**Error:**
```
tar: build: Cannot mkdir: Permission denied
```

**Fix Required on Server:**

Run these commands on your server:

```bash
# Give ansible user ownership of the directory
sudo chown -R ansible:ansible /var/www/gifalot-frontend-test
sudo chmod -R 755 /var/www/gifalot-frontend-test

# Verify permissions
ls -la /var/www/ | grep gifalot-frontend-test
```

**Expected output:**
```
drwxr-xr-x  ansible ansible  gifalot-frontend-test
```

## After Fixing Permissions

1. **Backend fix is already pushed** - will work on next run
2. **Frontend fix** - run the `chown` command on server, then re-run workflow

## Re-run Workflow

After fixing permissions on the server:

1. Go to: `https://github.com/MasterSipper/gifalot/actions`
2. Click "Deploy TEST" → "Run workflow"
3. Select branch: `test-deployment`
4. Click "Run workflow"

Both jobs should now succeed!

