# Fixing 401 Unauthorized Error with Contabo

## Problem

Getting `401 (Unauthorized)` when trying to upload files to Contabo Object Storage.

## Root Cause

The error occurs because:
1. **CORS is not configured** on your Contabo bucket for browser uploads
2. OR the presigned POST URL signature is not being accepted by Contabo

## Solution 1: Configure CORS on Contabo Bucket

Contabo Object Storage needs CORS configured to allow browser uploads.

### Steps:

1. Log in to **Contabo Customer Control Panel**
2. Go to **Object Storage** → Your bucket (`gifalot-alot`)
3. Find **CORS Configuration** settings
4. Add this CORS policy:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": ["http://localhost:3000", "http://localhost:3001"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

**For Production**, add your frontend domain:
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

### Solution 2: Check Backend Logs

Check your backend terminal for errors when creating the presigned POST URL. You should see logs like:

```
Creating presigned POST for: { bucket: 'gifalot-alot', ... }
Presigned POST created: { url: '...', fieldsCount: ... }
```

If you see errors here, the credentials or bucket configuration might be wrong.

### Solution 3: Verify Credentials

1. Double-check your credentials in `.env` file
2. Ensure bucket name is exactly `gifalot-alot` (no quotes, no typos)
3. Verify bucket exists in your Contabo account

### Solution 4: Test with Direct S3 API

You can test if credentials work by using AWS CLI or a tool like Postman to directly access the bucket.

## Next Steps

1. **Configure CORS** on your Contabo bucket (most likely fix)
2. **Restart backend** after making changes
3. **Try uploading again**
4. **Check backend logs** for any errors

## Common Issues

- **Bucket name mismatch**: Ensure bucket name matches exactly
- **Region mismatch**: Ensure endpoint matches your bucket region
- **Missing CORS**: Browser uploads require CORS to be configured
- **Invalid credentials**: Double-check Access Key ID and Secret Key




