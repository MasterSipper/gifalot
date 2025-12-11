# Setup GitHub Actions for Test Environment

## ✅ Workflow File Created

The workflow file has been created at:
- `gif-j-backend/.github/workflows/deploy-test.yml`

---

## Step 1: Verify Workflow File Exists

On your local machine:

```powershell
# Check if file exists
Test-Path gif-j-backend\.github\workflows\deploy-test.yml

# View the file
Get-Content gif-j-backend\.github\workflows\deploy-test.yml
```

---

## Step 2: Commit and Push the Workflow File

```powershell
cd C:\Projects\Gifalot

# Add the workflow file
git add gif-j-backend/.github/workflows/deploy-test.yml

# Commit
git commit -m "Add GitHub Actions workflow for test environment deployment"

# Push to main (or your current branch)
git push origin main
```

**Note:** The workflow file needs to be in the repository for GitHub Actions to use it.

---

## Step 3: Verify GitHub Secrets Exist

The workflow uses the same secrets as your `deploy-dev.yml` workflow. Verify they exist:

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Verify these secrets exist:
   - `ANSIBLE_PRIVATE_SSH_KEY_DEV`
   - `ANSIBLE_HOST_VPS1_DEV`
   - `ANSIBLE_PORT_DEV`
   - `ANSIBLE_PASSWORD_DEV`
   - `AWS_ACCESS_KEY_ID_DEV`
   - `AWS_SECRET_ACCESS_KEY_SECRET_DEV`
   - `GOOGLE_RECAPTCHA_SECRET_KEY_DEV`
   - `GIPHY_API_KEY_DEV`
   - `MAIL_USER_DEV`
   - `MAIL_PASSWORD_DEV`
   - `REDIS_HOST_DEV`
   - `REDIS_PASSWORD_DEV`
   - `POSTGRES_HOST_DEV`
   - `POSTGRES_DB_DEV`
   - `POSTGRES_USER_DEV`
   - `POSTGRES_PASSWORD_DEV`
   - `JWT_ACCESS_TOKEN_SECRET_DEV`
   - `JWT_REFRESH_TOKEN_SECRET_DEV`

**If any secrets are missing:**
- Add them in GitHub Settings → Secrets and variables → Actions
- Use the same values as your dev environment (or create test-specific ones)

---

## Step 4: Test the Workflow

Create a test branch and push it:

```powershell
# Create test branch
git checkout -b test-deployment

# Make a small change
echo "# Test deployment" >> README.md

# Commit and push
git add .
git commit -m "Test: Trigger test environment deployment"
git push origin test-deployment
```

---

## Step 5: Monitor GitHub Actions

1. Go to your GitHub repository
2. Click **Actions** tab
3. You should see "Deploy TEST" workflow running
4. Click on it to see progress
5. Wait for both jobs to complete:
   - ✅ `deploy-backend` - Deploys backend to port 3334
   - ✅ `deploy-frontend` - Builds and deploys frontend

---

## Step 6: Verify Deployment

Once GitHub Actions completes, test on the server:

```bash
# SSH into server
ssh root@38.242.204.63

# Check backend container is running
docker ps | grep gif-j-backend-test

# Test backend
curl -k -I https://test.gifalot.com/gif-j/

# Should return 200 OK (not 404)

# Test frontend
curl -k -I https://test.gifalot.com/

# Should return 200 OK with HTML
```

---

## Troubleshooting

### Issue: Workflow doesn't trigger

**Check:**
- Is the workflow file in the repository? (committed and pushed)
- Did you push to a branch other than `main`?
- Check GitHub Actions tab for any errors

### Issue: Workflow fails on "Deploy Frontend"

**Possible causes:**
- SCP action might need different configuration
- Check if `appleboy/scp-action` is the right action
- Verify SSH key has write access to `/var/www/gifalot-frontend-test/`

**Alternative:** If SCP doesn't work, we can use rsync via SSH instead.

### Issue: Backend deployment fails

**Check:**
- Verify all secrets are set correctly
- Check Ansible playbook logs in GitHub Actions
- Verify server is accessible via SSH

---

## Workflow Behavior

- **Triggers on:** Any branch push (except `main`)
- **Deploys to:** Test environment (`STAGE=test`, port 3334)
- **Frontend:** Builds with `REACT_APP_API_URL=https://test.gifalot.com/gif-j/`
- **Backend:** Deploys to `/home/ansible/services/test/gif-j-backend`
- **Frontend files:** Deploys to `/var/www/gifalot-frontend-test/`

---

## Next Steps

1. ✅ Commit and push the workflow file
2. ✅ Verify secrets exist in GitHub
3. ✅ Create and push a test branch
4. ✅ Monitor GitHub Actions
5. ✅ Verify deployment on server

Once this is set up, every time you push to a branch (except `main`), it will automatically deploy to `test.gifalot.com`!


