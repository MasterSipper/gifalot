# How to Check Your Deployment Status

## Automatic Deployment

✅ **Deploy TEST** - Automatically runs when you:
- Push to any branch except `main`
- Example: `git push origin test-deployment` triggers it automatically

✅ **Deploy DEV** - Automatically runs when you:
- Push to the `main` branch
- Example: `git push origin main` triggers it automatically

## Check Workflow Status

1. Go to: `https://github.com/MasterSipper/gifalot/actions`
2. You'll see a list of workflow runs
3. Click on the most recent **Deploy TEST** run
4. Check the status:
   - 🟡 **Yellow circle** = In progress
   - ✅ **Green checkmark** = Success
   - ❌ **Red X** = Failed

## Check Individual Jobs

Inside a workflow run, you'll see:
- **deploy-backend** job
- **deploy-frontend** job

Click on each job to see detailed logs.

## If Workflow Failed

1. Click on the failed job
2. Expand the failed step
3. Look for error messages
4. Common issues:
   - Missing secrets
   - SSH connection failed
   - Build errors
   - Permission denied

## Verify Deployment on Server

Once the workflow completes successfully:

```bash
# SSH into your server
ssh ansible@your-server-ip -p 2049

# Check if frontend files are deployed
ls -la /var/www/gifalot-frontend-test/

# Check if backend is running
docker ps | grep gif-j-backend-test

# Test the site
curl -k https://test.gifalot.com/
```

## Manual Trigger

You can also trigger workflows manually:
1. Go to Actions tab
2. Select the workflow (e.g., "Deploy TEST")
3. Click "Run workflow"
4. Select the branch
5. Click "Run workflow" button

