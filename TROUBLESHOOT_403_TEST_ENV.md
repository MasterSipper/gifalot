# Troubleshooting 403 Error on test.gifalot.com

## Why You're Getting 403

A 403 Forbidden error on `test.gifalot.com` typically means:

1. **Frontend files haven't been deployed yet** - The GitHub Actions workflow may still be running
2. **Empty directory** - The `/var/www/gifalot-frontend-test/` directory exists but has no files
3. **File permissions issue** - Nginx can't read the files

## Check Workflow Status

1. Go to your GitHub repository
2. Click on the **Actions** tab
3. Find the **Deploy TEST** workflow run
4. Check if it's:
   - ✅ **Completed** (green checkmark)
   - 🟡 **In progress** (yellow circle)
   - ❌ **Failed** (red X)

## If Workflow is Still Running

Wait for it to complete. The workflow has two jobs:
- `deploy-backend` - Deploys the backend API
- `deploy-frontend` - Builds and deploys the React frontend

The frontend deployment happens in the `deploy-frontend` job.

## If Workflow Completed Successfully

SSH into your server and check:

```bash
# Check if files exist
ls -la /var/www/gifalot-frontend-test/

# Check file permissions
ls -la /var/www/gifalot-frontend-test/ | head -20

# Check Nginx container status
docker ps | grep gifalot-frontend-test

# Check Nginx logs
docker logs gifalot-frontend-test

# Test local access
curl -I http://localhost:8081/
```

## If Directory is Empty

The workflow may have failed during the frontend deployment step. Check:

1. **GitHub Actions logs** - Look for errors in the `deploy-frontend` job
2. **SCP deployment step** - Check if files were copied successfully
3. **Secrets** - Verify all required secrets are set (especially SSH keys)

## If Files Exist But Still 403

Fix permissions:

```bash
# Set correct ownership (nginx runs as user 101 in container)
chown -R 101:101 /var/www/gifalot-frontend-test/

# Set correct permissions
chmod -R 755 /var/www/gifalot-frontend-test/

# Ensure index.html is readable
chmod 644 /var/www/gifalot-frontend-test/index.html
```

## Quick Test

Create a test file to verify Nginx is working:

```bash
echo '<h1>Test Environment</h1>' > /var/www/gifalot-frontend-test/index.html
chown 101:101 /var/www/gifalot-frontend-test/index.html
chmod 644 /var/www/gifalot-frontend-test/index.html
curl http://localhost:8081/
```

If this works, the issue is that the GitHub Actions workflow hasn't deployed files yet.

## Automatic Deployment Behavior

- **Deploy TEST** runs automatically when you push to any branch except `main`
- **Deploy DEV** runs automatically when you push to `main`
- You can also trigger manually using "Run workflow" button

## Next Steps

1. Check the GitHub Actions workflow status
2. If it failed, review the error logs
3. If it succeeded but files aren't there, check the SCP step logs
4. Verify all secrets are configured correctly

