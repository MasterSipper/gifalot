# Deploy Test Branch - Step by Step

## Quick Steps to Push and Deploy

---

## Step 1: Make Sure You're on the Test Branch

```powershell
# Check current branch
git branch

# If not on test branch, switch to it
git checkout test-deployment
# OR whatever you named your test branch
```

---

## Step 2: Make a Small Change (Optional but Recommended)

This ensures there's something to deploy:

```powershell
# Add a small change
echo "# Test deployment - $(Get-Date)" >> README.md

# OR just touch a file
New-Item -ItemType File -Path "test-deploy.txt" -Force
echo "Test deployment" | Out-File -FilePath "test-deploy.txt"
```

---

## Step 3: Stage and Commit Changes

```powershell
# Stage all changes
git add .

# Commit
git commit -m "Test: Trigger test environment deployment"
```

---

## Step 4: Push the Branch

```powershell
# Push to GitHub (replace 'test-deployment' with your branch name)
git push origin test-deployment

# If it's the first push of this branch, use:
git push -u origin test-deployment
```

**Expected output:**
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/YourUsername/gifalot.git
 * [new branch]      test-deployment -> test-deployment
```

---

## Step 5: Monitor GitHub Actions

1. **Go to your GitHub repository** in your browser
2. **Click the "Actions" tab** (top menu)
3. **You should see:**
   - A new workflow run: "Deploy TEST"
   - Status: Yellow circle (running) or green checkmark (completed)
4. **Click on the workflow run** to see details
5. **Wait for both jobs to complete:**
   - ✅ `deploy-backend` - Deploys backend to port 3334
   - ✅ `deploy-frontend` - Builds and deploys frontend

---

## Step 6: Check Deployment Status

### In GitHub Actions:
- **Green checkmark** = Success ✅
- **Red X** = Failed ❌ (click to see error logs)
- **Yellow circle** = Running ⏳

### If Failed:
- Click on the failed job
- Check the logs for errors
- Common issues:
  - SSH connection failed → Check SSH key secret
  - Ansible playbook error → Check server access
  - Build error → Check frontend dependencies

---

## Step 7: Verify Deployment on Server

After GitHub Actions completes successfully:

```bash
# SSH into server
ssh root@38.242.204.63 -p 2049

# Check backend container is running
docker ps | grep gif-j-backend-test

# Test backend
curl -k -I https://test.gifalot.com/gif-j/

# Should return: HTTP/2 200 (not 404)

# Test frontend
curl -k -I https://test.gifalot.com/

# Should return: HTTP/2 200
```

---

## Quick Command Reference

### On Your Local Machine (PowerShell):

```powershell
# 1. Make sure you're on test branch
git checkout test-deployment

# 2. Make a small change
echo "# Test $(Get-Date)" >> README.md

# 3. Commit and push
git add .
git commit -m "Test: Deploy to test environment"
git push origin test-deployment
```

### Then:
1. Go to GitHub → Actions tab
2. Watch the "Deploy TEST" workflow run
3. Wait for it to complete
4. Test `https://test.gifalot.com/`

---

## Troubleshooting

### Issue: "Branch not found" or "No upstream branch"

**Solution:**
```powershell
# Set upstream branch
git push -u origin test-deployment
```

### Issue: Workflow doesn't trigger

**Check:**
- Is the workflow file committed? `git status`
- Did you push to a branch other than `main`? (Workflow only triggers on non-main branches)
- Check GitHub Actions → Workflows → "Deploy TEST" → See if it's enabled

### Issue: Workflow fails

**Check the logs:**
- Click on the failed workflow run
- Click on the failed job
- Read the error message
- Common fixes:
  - SSH key issue → Verify `ANSIBLE_PRIVATE_SSH_KEY_DEV` secret
  - Server connection → Verify `ANSIBLE_HOST_VPS1_DEV` and port
  - Missing secret → Check all secrets are added

---

## Expected Timeline

- **Push branch:** ~10 seconds
- **GitHub Actions starts:** Immediately
- **Backend deployment:** ~2-5 minutes
- **Frontend deployment:** ~3-5 minutes
- **Total:** ~5-10 minutes

---

## Success Indicators

✅ **GitHub Actions:**
- Both jobs show green checkmarks
- No errors in logs

✅ **Server:**
- Backend container running: `docker ps | grep gif-j-backend-test`
- Backend responds: `curl -k -I https://test.gifalot.com/gif-j/` → `200 OK`
- Frontend responds: `curl -k -I https://test.gifalot.com/` → `200 OK`

---

## Next Steps After Successful Deployment

1. ✅ Test the application at `https://test.gifalot.com/`
2. ✅ Make changes on your test branch
3. ✅ Push changes → Auto-deploys to test environment
4. ✅ When ready, merge to `main` → Deploys to `dev.gifalot.com`

---

## Summary

1. **Push branch:** `git push origin test-deployment`
2. **Monitor:** GitHub → Actions tab
3. **Wait:** ~5-10 minutes for deployment
4. **Test:** `https://test.gifalot.com/`

You're all set! Push the branch and watch it deploy! 🚀

