# Deploy Backend to Contabo VPS

## Overview

This guide will help you deploy your NestJS backend to a Contabo VPS. Contabo is recommended because:
- You already have Contabo Object Storage set up
- Full control over the server
- Can run Docker containers
- Cost-effective

## Requirements

- Contabo VPS (minimum 2GB RAM recommended)
- SSH access to your VPS
- Domain name (optional, for custom domain)
- Contabo Object Storage credentials (already set up)

## Step 1: Set Up Your Contabo VPS

### 1.1 Order a VPS

1. Go to Contabo and order a VPS
2. Choose a location close to your users (EU recommended if using EU Object Storage)
3. Minimum specs:
   - 2GB RAM
   - 2 vCPU cores
   - 50GB SSD
   - Ubuntu 22.04 LTS

### 1.2 Initial Server Setup

SSH into your server:

```bash
ssh root@your-server-ip
```

Update the system:

```bash
apt update && apt upgrade -y
```

Install essential tools:

```bash
apt install -y curl wget git build-essential
```

## Step 2: Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install -y docker-compose-plugin

# Verify installation
docker --version
docker compose version
```

## Step 3: Install Node.js (Alternative to Docker)

If you prefer running Node.js directly instead of Docker:

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify
node --version
npm --version
```

## Step 4: Set Up MySQL and Redis

### Option A: Using Docker (Recommended)

Create a `docker-compose-services.yml` file:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: gifalot-mysql
    environment:
      MYSQL_ROOT_PASSWORD: your-secure-mysql-password
      MYSQL_DATABASE: gifalot
    ports:
      - "127.0.0.1:3306:3306"  # Only accessible from localhost
    volumes:
      - mysql_data:/var/lib/mysql
    restart: always
    command: --default-authentication-plugin=mysql_native_password

  redis:
    image: redis:7.0.10-alpine
    container_name: gifalot-redis
    command: redis-server --requirepass your-secure-redis-password --maxmemory 512mb --maxmemory-policy allkeys-lru
    ports:
      - "127.0.0.1:6379:6379"  # Only accessible from localhost
    volumes:
      - redis_data:/data
    restart: always

volumes:
  mysql_data:
  redis_data:
```

Start the services:

```bash
docker compose -f docker-compose-services.yml up -d
```

### Option B: Install Directly

```bash
# Install MySQL
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Secure MySQL
mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE gifalot;
CREATE USER 'gifalot'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON gifalot.* TO 'gifalot'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Install Redis
apt install -y redis-server
systemctl start redis-server
systemctl enable redis-server

# Set Redis password
nano /etc/redis/redis.conf
# Find and set: requirepass your-secure-redis-password
systemctl restart redis-server
```

## Step 5: Clone and Set Up Your Backend

```bash
# Create app directory
mkdir -p /opt/gifalot
cd /opt/gifalot

# Clone your repository
git clone https://github.com/MasterSipper/gifalot.git .

# Navigate to backend
cd gif-j-backend
```

## Step 6: Configure Environment Variables

```bash
# Copy template
cp env.template .env

# Edit .env file
nano .env
```

Update your `.env` file with production values:

```env
STAGE=production
PORT=3001
SERVICE_NAME_STAGE=gif-j-backend-production

# Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=gifalot
MYSQL_PASSWORD=your-secure-mysql-password
MYSQL_DB=gifalot

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password

# JWT Configuration (GENERATE NEW SECURE SECRETS!)
JWT_ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production

# Contabo Object Storage (S3-compatible)
AWS_ACCESS_KEY_ID=your-contabo-access-key
AWS_SECRET_ACCESS_KEY=your-contabo-secret-key
AWS_REGION=eu-central-1
S3_BUCKET_NAME=gifalot-alot
S3_ENDPOINT=https://eu2.contabostorage.com

# Google reCAPTCHA
GOOGLE_RECAPTCHA_SECRET_KEY=your-google-recaptcha-secret-key

# GIPHY API (optional)
GIPHY_API_KEY=your-giphy-api-key

# Email Configuration (optional)
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-email-password
```

**Important:** Generate secure random strings for JWT secrets:

```bash
# Generate secure random strings
openssl rand -base64 32
```

## Step 7: Install Dependencies and Build

```bash
# Install dependencies
npm install

# Build the application
npm run build
```

## Step 8: Run Database Migrations

```bash
# Migrations run automatically on startup, but you can run manually:
npm run migration:run
```

## Step 9: Set Up Process Manager (PM2)

PM2 keeps your app running and restarts it if it crashes:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start npm --name "gifalot-backend" -- run start:prod

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the instructions it provides
```

## Step 10: Set Up Nginx Reverse Proxy

Install Nginx:

```bash
apt install -y nginx
```

Create Nginx configuration:

```bash
nano /etc/nginx/sites-available/gifalot-backend
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    # Increase body size for file uploads
    client_max_body_size 20M;

    location /gif-j/ {
        proxy_pass http://localhost:3001/gif-j/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/gifalot-backend /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

## Step 11: Set Up SSL with Let's Encrypt (Optional but Recommended)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d your-domain.com

# Certbot will automatically configure Nginx and set up auto-renewal
```

## Step 12: Configure Firewall

```bash
# Install UFW
apt install -y ufw

# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
```

## Step 13: Update Frontend Environment Variable

In Netlify, update `REACT_APP_API_URL` to:

```
https://your-domain.com/gif-j/
```

Or if using IP:

```
http://your-server-ip/gif-j/
```

## Step 14: Configure CORS

Update your backend to allow requests from Netlify. You'll need to modify the CORS configuration in `main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://gifalot.netlify.app',
    'http://localhost:3000',  // For local development
  ],
  credentials: true,
});
```

## Monitoring and Maintenance

### Check Application Status

```bash
# PM2 status
pm2 status

# View logs
pm2 logs gifalot-backend

# Restart application
pm2 restart gifalot-backend
```

### Update Application

```bash
cd /opt/gifalot/gif-j-backend
git pull
npm install
npm run build
pm2 restart gifalot-backend
```

### Database Backup

```bash
# Create backup script
nano /opt/gifalot/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u gifalot -p gifalot > /opt/gifalot/backups/db_backup_$DATE.sql
```

```bash
chmod +x /opt/gifalot/backup-db.sh
mkdir -p /opt/gifalot/backups

# Add to crontab for daily backups
crontab -e
# Add: 0 2 * * * /opt/gifalot/backup-db.sh
```

## Troubleshooting

### Application won't start

```bash
# Check PM2 logs
pm2 logs gifalot-backend

# Check if port is in use
netstat -tulpn | grep 3001

# Check environment variables
pm2 env gifalot-backend
```

### Database connection issues

```bash
# Test MySQL connection
mysql -u gifalot -p -h localhost gifalot

# Check MySQL status
systemctl status mysql
```

### Redis connection issues

```bash
# Test Redis connection
redis-cli -a your-redis-password ping

# Check Redis status
systemctl status redis-server
```

## Next Steps

1. Test your API: `curl http://your-domain.com/gif-j/collection`
2. Update Netlify environment variable
3. Test the full application flow
4. Set up monitoring (optional: use PM2 Plus or similar)




