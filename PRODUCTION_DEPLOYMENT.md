# Production Deployment Guide

## Overview

This guide covers deploying Gifalot to production. The application consists of:
- **Frontend**: React app (can deploy to Netlify, Vercel, etc.)
- **Backend**: NestJS API (needs server hosting: AWS, Heroku, Railway, etc.)
- **Database**: MySQL/PostgreSQL (managed service or Docker)
- **File Storage**: AWS S3 (required for file uploads)

## Before Deploying

### 1. Code Status Check

**✅ Safe to Push:**
- All code changes we've made (upload fixes, error handling, etc.)
- Configuration templates (`env.template`, `package.json`, etc.)

**❌ DO NOT Push:**
- `.env` files (already in `.gitignore`)
- `node_modules/` (already in `.gitignore`)
- Local database files
- Build artifacts

### 2. Review Changes

Check what you're about to commit:
```bash
git status
git diff
```

## File Upload Requirements for Production

### Required: AWS S3 Configuration

For file uploads to work in production, you **must** configure AWS S3:

#### Step 1: Create AWS Account & S3 Bucket

1. **Sign up for AWS** (if you don't have an account): https://aws.amazon.com/
2. **Create an S3 Bucket:**
   - Go to AWS Console → S3
   - Click "Create bucket"
   - Choose a unique name (e.g., `gifalot-production`)
   - Select a region (e.g., `eu-central-1`)
   - Keep default settings or configure as needed
   - **Enable CORS** (for file uploads from frontend)

#### Step 2: Create IAM User for S3 Access

1. **Go to IAM Console** → Users → Create User
2. **Create Access Keys:**
   - Programmatic access
   - Attach policy: `AmazonS3FullAccess` (or create custom policy)
3. **Save the credentials:**
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - ⚠️ **Keep these secret!**

#### Step 3: Configure S3 CORS

Add CORS configuration to your S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["https://your-frontend-domain.netlify.app"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Replace `your-frontend-domain.netlify.app` with your actual frontend URL.

## Deployment Steps

### Frontend Deployment (Netlify)

#### 1. Prepare Frontend for Production

1. **Build the frontend:**
   ```bash
   cd gif-j-react
   npm run build
   ```

2. **Check the build folder** - it should contain optimized production files

#### 2. Deploy to Netlify

**Option A: Via Netlify Dashboard**
1. Go to https://app.netlify.com/
2. Click "Add new site" → "Deploy manually"
3. Drag and drop the `build` folder
4. Configure environment variables (see below)

**Option B: Via Git (Recommended)**
1. Push your code to GitHub
2. Connect Netlify to your GitHub repo
3. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`
   - **Base directory:** `gif-j-react`

#### 3. Configure Frontend Environment Variables in Netlify

In Netlify Dashboard → Site Settings → Environment Variables, add:

```env
REACT_APP_API_URL=https://your-backend-domain.com/gif-j/
```

Replace `your-backend-domain.com` with your actual backend URL.

### Backend Deployment

#### Option 1: AWS EC2 / VPS

1. **Set up server** (Ubuntu/Debian recommended)
2. **Install Node.js, MySQL, Redis**
3. **Clone repository**
4. **Configure environment variables** (see below)
5. **Run migrations**
6. **Start with PM2** or systemd

#### Option 2: Railway / Render / Heroku

1. **Connect your GitHub repository**
2. **Configure environment variables** (see below)
3. **Deploy automatically** (they handle the rest)

#### Option 3: Docker

Use the existing `docker-compose.yml` with production modifications.

### Backend Environment Variables for Production

Create `.env` file on your backend server with:

```env
# Application
STAGE=production
PORT=3000
SERVICE_NAME_STAGE=gif-j-backend-production

# Database (use managed service in production!)
MYSQL_HOST=your-production-db-host
MYSQL_PORT=3306
MYSQL_USER=your-db-user
MYSQL_PASSWORD=your-secure-db-password
MYSQL_DB=gifalot

# Redis (use managed service or Docker)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password

# JWT (use strong random strings!)
JWT_ACCESS_TOKEN_SECRET=generate-strong-random-string-here
JWT_REFRESH_TOKEN_SECRET=generate-another-strong-random-string-here

# AWS S3 (REQUIRED for file uploads!)
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=eu-central-1
S3_BUCKET_NAME=gifalot-production

# Google reCAPTCHA (REQUIRED for production)
GOOGLE_RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key

# GIPHY API (optional but recommended)
GIPHY_API_KEY=your-giphy-api-key

# Email (for password reset)
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
```

## What Gets Pushed to GitHub

### ✅ Safe to Commit

```bash
# All source code
src/
public/
package.json
package-lock.json
tsconfig.json
README.md
env.template  # Template, not actual secrets
.gitignore
```

### ❌ Never Commit

- `.env` files (already in `.gitignore`)
- `node_modules/`
- `build/` or `dist/` (unless using GitHub Pages)
- Database files
- Logs
- Private keys

## Pre-Deployment Checklist

### Frontend
- [ ] Build succeeds: `npm run build`
- [ ] No console errors in production build
- [ ] Environment variables configured
- [ ] API URL points to production backend
- [ ] Test on local production build

### Backend
- [ ] All migrations run successfully
- [ ] Environment variables configured
- [ ] AWS S3 credentials set up
- [ ] Database connection works
- [ ] Redis connection works
- [ ] JWT secrets are strong random strings
- [ ] CORS configured for frontend domain
- [ ] Test all API endpoints

### File Uploads
- [ ] AWS S3 bucket created
- [ ] IAM user created with S3 access
- [ ] S3 CORS configured for frontend domain
- [ ] Backend has AWS credentials
- [ ] Test file upload end-to-end

## Production Testing

After deployment:

1. **Test login/registration**
2. **Test file upload** (drag & drop)
3. **Test creating compilations**
4. **Test viewing compilations**
5. **Test player functionality**

## Security Checklist

- [ ] Strong JWT secrets (use: `openssl rand -base64 32`)
- [ ] Secure database passwords
- [ ] AWS credentials kept secret
- [ ] CORS restricted to your domains only
- [ ] HTTPS enabled (SSL certificates)
- [ ] Rate limiting configured (if needed)
- [ ] Environment variables not exposed in frontend code

## Cost Estimates

- **Frontend (Netlify)**: Free tier usually sufficient
- **Backend Hosting**: $5-20/month (Railway, Render free tiers available)
- **Database**: $5-15/month (managed service) or free (self-hosted)
- **Redis**: $5-10/month (managed) or free (self-hosted)
- **AWS S3**: Very cheap (~$0.023 per GB stored, ~$0.005 per 1000 requests)
- **Total**: ~$15-50/month for small to medium usage

## Quick Deploy Commands

### Frontend (Netlify CLI)
```bash
cd gif-j-react
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### Backend (via Git)
```bash
# On your server
cd /path/to/backend
git pull origin main
npm install
npm run build
npm run migration:run  # If needed
pm2 restart gifalot-backend  # Or your process manager
```

## Troubleshooting

### File Uploads Not Working in Production

1. **Check S3 credentials** are correct in backend `.env`
2. **Check S3 bucket CORS** allows your frontend domain
3. **Check S3 bucket policy** allows uploads
4. **Check backend logs** for S3 errors
5. **Verify AWS region** matches bucket region

### Frontend Can't Connect to Backend

1. **Check CORS** on backend allows frontend domain
2. **Check API URL** in frontend environment variables
3. **Check backend is running** and accessible
4. **Check firewall/security groups** allow connections

## Need Help?

- Check backend logs for errors
- Check browser console for frontend errors
- Verify all environment variables are set
- Test API endpoints directly with Postman/curl







