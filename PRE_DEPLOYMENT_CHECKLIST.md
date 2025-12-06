# Pre-Deployment Checklist

## Before Pushing to GitHub

### 1. Check What You're About to Commit

```bash
git status
git diff
```

Make sure you're not committing:
- `.env` files
- `node_modules/`
- Sensitive credentials
- Local database files

### 2. Test Everything Works Locally

- [ ] Frontend starts without errors
- [ ] Backend starts without errors
- [ ] Login works
- [ ] File upload works (even if mock URLs)
- [ ] Creating compilations works
- [ ] Compilations persist after refresh
- [ ] Player works

### 3. Code Quality

- [ ] No console errors in browser
- [ ] No TypeScript errors in backend
- [ ] No linter errors
- [ ] All tests pass (if you have tests)

## For File Uploads to Work in Production

### Critical Requirements:

1. **AWS S3 Account** ✅
   - Sign up at https://aws.amazon.com/
   - Free tier includes 5GB storage

2. **S3 Bucket Created** ⏳
   - Create bucket in AWS Console
   - Configure CORS for your frontend domain
   - Note the bucket name and region

3. **AWS IAM Credentials** ⏳
   - Create IAM user with S3 access
   - Generate Access Key ID and Secret Access Key
   - Save these securely (you'll need them)

4. **Backend Environment Variables** ⏳
   ```
   AWS_ACCESS_KEY_ID=your-key-here
   AWS_SECRET_ACCESS_KEY=your-secret-here
   AWS_REGION=eu-central-1
   S3_BUCKET_NAME=gifalot-production
   ```

5. **Frontend CORS Configuration** ⏳
   - Add your Netlify domain to S3 bucket CORS policy

## Recommended Order

1. **Set up AWS S3** first (takes ~15 minutes)
2. **Deploy backend** with S3 credentials
3. **Test file upload** on production backend
4. **Deploy frontend** pointing to production backend
5. **Test everything** end-to-end

## Quick AWS S3 Setup Guide

1. **Log in to AWS Console**
2. **Create S3 Bucket:**
   - Name: `gifalot-production` (or your choice)
   - Region: `eu-central-1` (or closest to you)
   - Uncheck "Block all public access" (or configure as needed)
   
3. **Configure CORS:**
   - Go to Bucket → Permissions → CORS
   - Add the CORS policy (see PRODUCTION_DEPLOYMENT.md)

4. **Create IAM User:**
   - IAM → Users → Create User
   - Name: `gifalot-s3-user`
   - Access type: Programmatic access
   - Attach policy: `AmazonS3FullAccess`
   - Save the Access Key ID and Secret Access Key

5. **Add to Backend .env:**
   ```
   AWS_ACCESS_KEY_ID=<from-step-4>
   AWS_SECRET_ACCESS_KEY=<from-step-4>
   AWS_REGION=eu-central-1
   S3_BUCKET_NAME=gifalot-production
   ```


