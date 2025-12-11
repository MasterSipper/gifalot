# Quick Start: Configure CORS for Contabo

## Easiest Option: Use Node.js Script

I've created a script that configures CORS automatically. Just run:

```powershell
cd C:\Projects\Gifalot\gif-j-backend
node ../configure-contabo-cors.js
```

This will configure CORS for your Contabo bucket automatically.

## What the Script Does

- Connects to Contabo Object Storage
- Configures CORS to allow uploads from `localhost:3000` and `localhost:3001`
- Allows all necessary HTTP methods (GET, POST, PUT, DELETE, etc.)
- Verifies the configuration was applied

## After Running the Script

1. **Restart your backend** (if it's running)
2. **Try uploading a file again**
3. The 401 error should be gone!

## Alternative: Use AWS CLI

If you prefer using AWS CLI, see `CONFIGURE_CONTABO_CORS.md` for detailed instructions.

## Troubleshooting

If the script fails:
- Check that your bucket name is correct: `gifalot-alot`
- Verify your credentials are correct
- Make sure the backend's `node_modules` has `@aws-sdk/client-s3` installed

Let me know if you need help running the script!




