# Complete Production .env File

## Full .env Configuration for Server

Copy this to your `.env` file on the server:

```env
# Application Configuration
STAGE=dev
PORT=3333
SERVICE_NAME_STAGE=gif-j-backend-dev

# Database Configuration (MySQL) - Your Simply MySQL server
MYSQL_HOST=mysql96.unoeuro.com
MYSQL_PORT=3306
MYSQL_USER=gifalot_com
MYSQL_PASSWORD=z6paFtf9D5Eryh4cdwgb
MYSQL_DB=gifalot_com_db

# Redis Configuration - Docker service name
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=mystic-cheese-swindler-moto

# JWT Configuration
JWT_ACCESS_TOKEN_SECRET=wIBDdxoiR4WXQ86DWSMk9NTMDZScCIKIss5EN300qmI=
JWT_REFRESH_TOKEN_SECRET=wrtyTrasBj2yfLxqBXHKwGe1i1Tr76byYC2qv9nHt+I=

# AWS S3 Configuration (Contabo Object Storage)
AWS_ACCESS_KEY_ID=4b2d2c88ee716e93979600d46b195a40
AWS_SECRET_ACCESS_KEY=ad213eb1c1ef8d67835522dff7cf2a16
AWS_REGION=eu-central-1
S3_BUCKET_NAME=gifalot-alot
S3_ENDPOINT=https://eu2.contabostorage.com

# Google reCAPTCHA
GOOGLE_RECAPTCHA_SECRET_KEY=your-google-recaptcha-secret-key

# GIPHY API
GIPHY_API_KEY=s3k2WSBRVKYkCsTL60x7ow79geR9aCSq

# Email Configuration (for password reset, etc.)
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-email-password

# CORS Configuration (comma-separated list of allowed origins)
CORS_ORIGINS=https://gifalot.netlify.app,https://dev.gifalot.com
```

## Quick Setup on Server

```bash
# Navigate to backend directory
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend

# Edit .env file
nano .env

# Paste the configuration above, then save (Ctrl+X, Y, Enter)

# Restart containers
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app

# Check logs
docker logs services-gif-j-backend-dev-app-1 --tail 50
```





