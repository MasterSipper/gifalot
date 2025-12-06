# Deploy Backend to Simply Hosting

## Overview

Simply Hosting typically offers shared hosting or managed hosting. For a NestJS backend, you'll need:
- Node.js support
- MySQL database
- Redis (may not be available on shared hosting)
- SSH access (for deployment)

**Important:** Simply Hosting may not support all requirements. Check with Simply support first.

## Requirements Check

Before proceeding, verify with Simply Hosting support:

1. ✅ Do they support Node.js? (What version?)
2. ✅ Do they provide MySQL database?
3. ✅ Do they provide Redis? (If not, you may need to use an external Redis service)
4. ✅ Do they provide SSH access?
5. ✅ Can you run long-running processes (PM2)?
6. ✅ What are the resource limits (RAM, CPU)?

## Alternative: Use Simply for Database Only

If Simply doesn't support Node.js/Redis, consider:
- **Simply**: Use for MySQL database only
- **Contabo VPS**: Run the Node.js backend
- **External Redis**: Use Redis Cloud (free tier available) or Upstash

## Step 1: Set Up MySQL Database on Simply

1. Log into your Simply hosting control panel
2. Create a MySQL database
3. Note down:
   - Database name
   - Database user
   - Database password
   - Database host (usually `localhost` or provided hostname)
   - Database port (usually `3306`)

## Step 2: Set Up External Redis (If Simply Doesn't Provide)

### Option A: Redis Cloud (Recommended)

1. Sign up at https://redis.com/try-free/
2. Create a free database
3. Note down:
   - Redis host
   - Redis port
   - Redis password

### Option B: Upstash Redis

1. Sign up at https://upstash.com/
2. Create a Redis database
3. Note down connection details

## Step 3: Deploy Backend to Contabo VPS

Since Simply may not support Node.js, deploy the backend to Contabo VPS instead:

**Follow the guide:** [DEPLOY_BACKEND_CONTABO.md](./DEPLOY_BACKEND_CONTABO.md)

**But use Simply's MySQL database:**

Update your `.env`:

```env
# Use Simply's MySQL
MYSQL_HOST=your-simply-mysql-host
MYSQL_PORT=3306
MYSQL_USER=your-simply-db-user
MYSQL_PASSWORD=your-simply-db-password
MYSQL_DB=your-simply-db-name

# Use External Redis
REDIS_HOST=your-redis-cloud-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password
```

## Step 4: Hybrid Setup (Simply + Contabo)

If Simply only provides MySQL:

1. **Simply Hosting**: MySQL database
2. **Contabo VPS**: Node.js backend + Redis (or external Redis)
3. **Contabo Object Storage**: File storage (already set up)

This is actually a good setup:
- Simply's managed MySQL (backups, maintenance handled)
- Contabo VPS for full control over Node.js
- Contabo Object Storage for files

## If Simply Supports Node.js

If Simply confirms they support Node.js, follow these steps:

### Step 1: Access Your Simply Account

1. Log into Simply control panel
2. Navigate to Node.js applications (if available)
3. Or use SSH access

### Step 2: Upload Your Backend

```bash
# Via SSH
ssh your-username@your-simply-host

# Or via FTP/SFTP
# Upload the gif-j-backend folder
```

### Step 3: Install Dependencies

```bash
cd gif-j-backend
npm install --production
```

### Step 4: Configure Environment Variables

Create `.env` file with Simply's database credentials and external Redis.

### Step 5: Build and Start

```bash
npm run build
npm run start:prod
```

### Step 6: Use Process Manager

If Simply allows, install PM2:

```bash
npm install -g pm2
pm2 start npm --name "gifalot-backend" -- run start:prod
pm2 save
```

## Recommendation

**Best Setup:**
- **Contabo VPS**: Backend application (full control)
- **Simply Hosting**: MySQL database (managed, reliable)
- **Contabo Object Storage**: File storage (already set up)
- **Redis Cloud/Upstash**: Redis (free tier available)

This gives you:
- ✅ Full control over backend
- ✅ Managed database (backups, maintenance)
- ✅ Cost-effective
- ✅ Scalable

## Next Steps

1. Contact Simply support to confirm Node.js support
2. If yes → Follow Simply-specific steps above
3. If no → Use hybrid setup (Simply MySQL + Contabo VPS)
4. Follow [DEPLOY_BACKEND_CONTABO.md](./DEPLOY_BACKEND_CONTABO.md) for VPS setup


