# Configure CORS for Contabo Object Storage

Contabo doesn't have a web UI for CORS configuration. You need to use **AWS CLI** to configure it.

## Option 1: Use AWS CLI (Recommended)

### Step 1: Install AWS CLI

**Windows:**
```powershell
# Download and install from:
# https://awscli.amazonaws.com/AWSCLIV2.msi
```

Or use Chocolatey:
```powershell
choco install awscli
```

### Step 2: Configure AWS CLI for Contabo

Run this command to configure AWS CLI with your Contabo credentials:

```powershell
aws configure --profile contabo
```

When prompted, enter:
- **AWS Access Key ID**: `4b2d2c88ee716e93979600d46b195a40`
- **AWS Secret Access Key**: `ad213eb1c1ef8d67835522dff7cf2a16`
- **Default region name**: `eu-central-1`
- **Default output format**: `json`

### Step 3: Apply CORS Configuration

I've created a `contabo-cors-config.json` file for you. Run this command:

```powershell
aws --endpoint-url=https://eu2.contabostorage.com --profile contabo s3api put-bucket-cors --bucket gifalot-alot --cors-configuration file://contabo-cors-config.json
```

### Step 4: Verify CORS Configuration

To check if CORS was set correctly:

```powershell
aws --endpoint-url=https://eu2.contabostorage.com --profile contabo s3api get-bucket-cors --bucket gifalot-alot
```

## Option 2: Use a Script (Alternative)

If AWS CLI is too complex, we can create a Node.js script to configure CORS using the AWS SDK.

## Option 3: Proxy Upload Through Backend (Alternative)

Instead of direct browser uploads, we can modify the code to upload files through your backend. This avoids CORS issues entirely.

**Which option would you like to try?**

1. **AWS CLI** - Most standard approach
2. **Node.js script** - Easier if you have Node.js installed
3. **Backend proxy** - No CORS needed, but slower uploads

Let me know which you prefer!


