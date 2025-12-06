# Setting Up Contabo Object Storage (S3-Compatible)

## ✅ Good News!

**Contabo Object Storage is S3-compatible!** This means it works with your existing code that uses AWS S3 SDK.

**Simply Hosting** does NOT offer S3-compatible storage (it's regular web hosting).

## Setup Steps

### 1. Create Object Storage in Contabo

1. Log in to your **Contabo Customer Control Panel**
2. Navigate to **"Object Storage"**
3. Click **"Go to Object Storage Panel"**
4. Create a new bucket for your files (e.g., `gifalot-storage`)

### 2. Get Your S3 Credentials

1. In Contabo Object Storage Panel
2. Go to **"Account"** → **"Security & Access"**
3. You'll find:
   - **Access Key ID** (similar to AWS Access Key)
   - **Secret Access Key** (similar to AWS Secret Key)

### 3. Find Your Endpoint URL

Contabo uses different endpoints based on region:

- **European Union**: `https://eu2.contabostorage.com`
- **Singapore**: `https://sin1.contabostorage.com`
- **United States**: `https://usc1.contabostorage.com`

### 4. Configure Your Backend

Add/update these variables in your `.env` file:

```env
# Contabo Object Storage Configuration
AWS_ACCESS_KEY_ID=your-contabo-access-key-id
AWS_SECRET_ACCESS_KEY=your-contabo-secret-access-key
AWS_REGION=eu-central-1
S3_BUCKET_NAME=gifalot-storage
S3_ENDPOINT=https://eu2.contabostorage.com  # Use your region's endpoint
```

### 5. Update Backend Code to Use Custom Endpoint

The backend needs to be configured to use Contabo's custom endpoint instead of AWS's default endpoints.

## Important Notes

- Contabo Object Storage is **S3-compatible** but not 100% identical
- Most features work, but some (like logging) may not be supported
- Much cheaper than AWS S3 for most use cases
- Perfect for your file storage needs!

## Next Steps

I can update the backend code to support Contabo's custom endpoint. Would you like me to:

1. Modify the S3 client configuration to use Contabo's endpoint?
2. Create a setup guide with exact steps?

Let me know and I'll implement it!



