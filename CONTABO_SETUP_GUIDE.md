# Contabo Object Storage Setup Guide

## ✅ Perfect! Contabo Object Storage Works!

**Contabo offers S3-compatible Object Storage** - this means it works with your existing code!

**Simply Hosting** does NOT offer S3-compatible storage (it's just regular web hosting).

## Quick Setup Steps

### Step 1: Create Object Storage in Contabo

1. Log in to **Contabo Customer Control Panel**
2. Go to **"Object Storage"** → **"Go to Object Storage Panel"**
3. Create a new bucket (e.g., `gifalot-files`)
4. Choose a region (EU, Singapore, or US)

### Step 2: Get Your Credentials

1. In Object Storage Panel → **"Account"** → **"Security & Access"**
2. Find:
   - **Access Key ID**
   - **Secret Access Key**

### Step 3: Find Your Endpoint

Based on your bucket region:

- **EU**: `https://eu2.contabostorage.com`
- **Singapore**: `https://sin1.contabostorage.com`
- **US**: `https://usc1.contabostorage.com`

### Step 4: Update Backend `.env`

Edit `gif-j-backend/.env`:

```env
# Contabo Object Storage (S3-compatible)
AWS_ACCESS_KEY_ID=your-contabo-access-key-id
AWS_SECRET_ACCESS_KEY=your-contabo-secret-access-key
AWS_REGION=eu-central-1
S3_BUCKET_NAME=gifalot-files
S3_ENDPOINT=https://eu2.contabostorage.com
```

**Important:** Replace `https://eu2.contabostorage.com` with your actual region's endpoint!

### Step 5: Restart Backend

The backend will automatically use Contabo's endpoint when `S3_ENDPOINT` is set.

## Testing

1. Upload a file
2. Check that it appears in your compilation
3. Verify it works in the player

## Cost Comparison

- **AWS S3**: ~$0.023/GB/month + requests
- **Contabo Object Storage**: Usually cheaper, great for EU users
- **Perfect for your use case!**

## Troubleshooting

### "Access Denied" Error
- Check credentials are correct
- Verify bucket name matches exactly
- Ensure bucket exists in the correct region

### "Endpoint not found"
- Verify `S3_ENDPOINT` matches your bucket region
- Check for typos in the endpoint URL

## Need Help?

The backend code is now updated to support Contabo! Just:
1. Set up your Contabo bucket
2. Add credentials to `.env`
3. Restart backend
4. Upload files!

