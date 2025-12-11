# Quick Start: Deploy to Your Contabo VPS

## Your VPS Details

- **IP Address:** `38.242.204.63`
- **IPv6:** `2a02:c206:2130:1963:0000:0000:0000:0001/64`
- **Username:** `root`
- **VNC Access:** Available (207.180.255.187:63341)
- **Disk Space:** 200 GB
- **Region:** EU

## Your Database Details (Simply MySQL)

- **Host:** `mysql96.unoeuro.com`
- **Database:** `gifalot_com_db`
- **Username:** `gifalot_com`
- **Password:** `z6paFtf9D5Eryh4cdwgb`
- **Port:** `3306`

## Step 1: Connect to Your VPS

### Option A: SSH (Recommended)

```bash
ssh root@38.242.204.63
```

If you don't have SSH keys set up, you'll be prompted for a password (check your Contabo control panel for the root password).

### Option B: VNC (If SSH doesn't work)

Use the VNC details:
- **Host:** `207.180.255.187:63341`
- Use a VNC client to connect

## Step 2: Initial Server Setup

Once connected, update the system:

```bash
# Update system packages
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential
```

## Step 3: Install Node.js

```bash
# Install Node.js 18 (LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version  # Should show v18.x.x
npm --version
```

## Step 4: Install Redis

Since you're using Simply's MySQL, you only need Redis on the VPS:

```bash
# Install Redis
apt install -y redis-server

# Configure Redis password
nano /etc/redis/redis.conf
```

Find and uncomment/modify:
```
requirepass your-secure-redis-password
```

Generate a secure password:
```bash
openssl rand -base64 32
```

Save the file (Ctrl+X, Y, Enter) and restart Redis:

```bash
systemctl restart redis-server
systemctl enable redis-server

# Test Redis
redis-cli -a your-secure-redis-password ping
# Should return: PONG
```

## Step 5: Clone Your Repository

```bash
# Create app directory
mkdir -p /opt/gifalot
cd /opt/gifalot

# Clone your repository
git clone https://github.com/MasterSipper/gifalot.git .

# Navigate to backend
cd gif-j-backend
```

## Step 6: Install Dependencies

```bash
# Install Node.js dependencies
npm install
```

## Step 7: Configure Environment Variables

```bash
# Copy template
cp env.template .env

# Edit .env file
nano .env
```

Update your `.env` file with these values:

```env
STAGE=production
PORT=3001
SERVICE_NAME_STAGE=gif-j-backend-production

# Database Configuration (Simply MySQL)
MYSQL_HOST=mysql96.unoeuro.com
MYSQL_PORT=3306
MYSQL_USER=gifalot_com
MYSQL_PASSWORD=z6paFtf9D5Eryh4cdwgb
MYSQL_DB=gifalot_com_db

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-secure-redis-password  # Use the password you set in Step 4

# JWT Configuration (GENERATE NEW SECURE SECRETS!)
JWT_ACCESS_TOKEN_SECRET=your-super-secret-access-token-key-change-this-in-production
JWT_REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key-change-this-in-production

# Generate secure JWT secrets:
openssl rand -base64 32
openssl rand -base64 32

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

# CORS Configuration
CORS_ORIGINS=https://gifalot.netlify.app,http://localhost:3000
```

Save the file (Ctrl+X, Y, Enter).

## Step 8: Test Database Connection

Before building, test if you can connect to Simply's MySQL:

```bash
# Install MySQL client
apt install -y mysql-client

# Test connection
mysql -h mysql96.unoeuro.com -u gifalot_com -p gifalot_com_db
# Enter password: z6paFtf9D5Eryh4cdwgb

# If connection works, type:
exit
```

If connection fails, you may need to:
- Contact Simply support to whitelist your VPS IP: `38.242.204.63`
- Verify the database credentials

## Step 9: Build the Application

```bash
# Build the NestJS application
npm run build
```

## Step 10: Run Migrations

Migrations will run automatically on startup, but you can run them manually:

```bash
npm run migration:run
```

## Step 11: Install PM2 (Process Manager)

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
# Follow the instructions it provides (usually: sudo env PATH=... pm2 startup systemd -u root --hp /root)
```

## Step 12: Verify Application is Running

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs gifalot-backend

# Check if app is listening
netstat -tulpn | grep 3001
```

You should see your app running on port 3001.

## Step 13: Set Up Nginx Reverse Proxy

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
    server_name 38.242.204.63;  # Your VPS IP, or your domain if you have one

    # Increase body size for file uploads (20MB)
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
rm /etc/nginx/sites-enabled/default  # Remove default site
nginx -t  # Test configuration
systemctl restart nginx
```

## Step 14: Configure Firewall

```bash
# Install UFW
apt install -y ufw

# Allow SSH (important!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable
```

## Step 15: Test Your API

Test if your backend is accessible:

```bash
# From your local machine or VPS
curl http://38.242.204.63/gif-j/collection
```

Or test in browser:
```
http://38.242.204.63/gif-j/collection
```

## Step 16: Update Netlify Environment Variable

In your Netlify dashboard:

1. Go to **Site settings** → **Environment variables**
2. Update or add:
   - **Key:** `REACT_APP_API_URL`
   - **Value:** `http://38.242.204.63/gif-j/` (or `https://` if you set up SSL)

3. **Trigger a new deploy** to apply the changes

## Step 17: Set Up SSL (Optional but Recommended)

For production, you should set up SSL. You can use Let's Encrypt:

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# If you have a domain pointing to your VPS:
certbot --nginx -d your-domain.com

# Or if using IP only, you can use a service like:
# - Cloudflare Tunnel (free)
# - ngrok (for testing)
```

## Troubleshooting

### Can't connect to Simply MySQL

```bash
# Test connection
mysql -h mysql96.unoeuro.com -u gifalot_com -p

# If it fails, contact Simply support with:
# - Your VPS IP: 38.242.204.63
# - Request to whitelist for MySQL access
```

### Application won't start

```bash
# Check PM2 logs
pm2 logs gifalot-backend

# Check if port is in use
netstat -tulpn | grep 3001

# Restart application
pm2 restart gifalot-backend
```

### Redis connection issues

```bash
# Test Redis
redis-cli -a your-redis-password ping

# Check Redis status
systemctl status redis-server
```

### Nginx 502 Bad Gateway

```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs gifalot-backend

# Test backend directly
curl http://localhost:3001/gif-j/collection
```

## Quick Commands Reference

```bash
# View application logs
pm2 logs gifalot-backend

# Restart application
pm2 restart gifalot-backend

# Stop application
pm2 stop gifalot-backend

# Update application
cd /opt/gifalot/gif-j-backend
git pull
npm install
npm run build
pm2 restart gifalot-backend

# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# View Nginx error logs
tail -f /var/log/nginx/error.log
```

## Next Steps

1. ✅ Test your API: `http://38.242.204.63/gif-j/collection`
2. ✅ Update Netlify `REACT_APP_API_URL`
3. ✅ Test full application flow
4. ✅ Set up domain name (optional)
5. ✅ Set up SSL certificate (optional)

## Your Complete Setup

- ✅ **Contabo VPS:** Backend + Redis (€9/month)
- ✅ **Simply MySQL:** Database (included in your hosting)
- ✅ **Contabo Object Storage:** File storage (already set up)
- ✅ **Netlify:** Frontend (free)

**Total Cost:** ~€9/month + Simply hosting

Perfect for your prototype! 🚀




