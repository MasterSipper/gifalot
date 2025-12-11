# Test Deployment Now

## SSH Key Setup Complete ✅

You've:
- ✅ Created SSH key pair
- ✅ Added public key to `ansible` user's `authorized_keys`
- ✅ Updated GitHub secret `ANSIBLE_PRIVATE_SSH_KEY_DEV` with private key

## Next Steps: Trigger Deployment

### Option 1: Manual Trigger (Recommended)

1. Go to: `https://github.com/MasterSipper/gifalot/actions`
2. Click **"Deploy TEST"** in the left sidebar
3. Click **"Run workflow"** button (top right)
4. Select branch: **`test-deployment`**
5. Click **"Run workflow"**

### Option 2: Wait for Automatic Trigger

If you just pushed code, the workflow should trigger automatically. Check the Actions tab for a new run.

## What to Expect

The workflow has two jobs:

1. **deploy-backend** (~2-5 minutes)
   - ✅ Should now connect via SSH successfully
   - Deploys backend Docker containers
   - Backend available at: `https://test.gifalot.com/gif-j/`

2. **deploy-frontend** (~3-5 minutes)
   - Builds React app (should pass linting now)
   - Deploys files to `/var/www/gifalot-frontend-test/`
   - Frontend available at: `https://test.gifalot.com/`

## Monitor Progress

1. Click on the workflow run
2. Watch both jobs:
   - 🟡 Yellow circle = Running
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed

3. Click on each job to see detailed logs

## After Successful Deployment

Once both jobs complete:

1. **Test the backend:**
   ```bash
   curl -k https://test.gifalot.com/gif-j/ping
   ```

2. **Test the frontend:**
   - Open: `https://test.gifalot.com/`
   - Should see your React app (not 403 error)

3. **Check on server:**
   ```bash
   # Check backend container
   docker ps | grep gif-j-backend-test
   
   # Check frontend files
   ls -la /var/www/gifalot-frontend-test/
   ```

## If It Still Fails

If you see SSH errors:
- Double-check the public key is in `/home/ansible/.ssh/authorized_keys`
- Verify file permissions: `chmod 600 ~/.ssh/authorized_keys` (as ansible user)
- Check the private key in GitHub includes `-----BEGIN` and `-----END` lines

If you see other errors:
- Check the workflow logs for specific error messages
- Share the error and we'll troubleshoot

