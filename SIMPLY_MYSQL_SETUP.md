# Setup with Simply MySQL Database

## Your Database Details

- **Host:** `mysql96.unoeuro.com`
- **Database:** `gifalot_com_db`
- **Username:** `gifalot_com`
- **Password:** `z6paFtf9D5Eryh4cdwgb`
- **Port:** `3306` (default MySQL port)

## Step 1: Update Your Backend .env File

In your `gif-j-backend/.env` file, update the MySQL configuration:

```env
# Database Configuration (MySQL)
MYSQL_HOST=mysql96.unoeuro.com
MYSQL_PORT=3306
MYSQL_USER=gifalot_com
MYSQL_PASSWORD=z6paFtf9D5Eryh4cdwgb
MYSQL_DB=gifalot_com_db
```

## Step 2: Test Connection Locally (Optional)

Before deploying, you can test the connection from your local machine:

```bash
# Install MySQL client (if not installed)
# On Windows, you can use MySQL Workbench or command line

# Test connection
mysql -h mysql96.unoeuro.com -u gifalot_com -p gifalot_com_db
# Enter password: z6paFtf9D5Eryh4cdwgb
```

Or test from your backend:

```bash
cd gif-j-backend
npm run start:dev
```

Check the logs - you should see:
```
[Nest] INFO [InstanceLoader] TypeOrmModule dependencies initialized
```

## Step 3: Deploy Backend to Contabo VPS

When you deploy your backend to Contabo VPS, use the same `.env` configuration:

```env
# Database Configuration (MySQL from Simply)
MYSQL_HOST=mysql96.unoeuro.com
MYSQL_PORT=3306
MYSQL_USER=gifalot_com
MYSQL_PASSWORD=z6paFtf9D5Eryh4cdwgb
MYSQL_DB=gifalot_com_db
```

**Important:** Make sure your Contabo VPS can connect to Simply's MySQL server:
- Check if Simply allows remote connections (they usually do)
- Verify firewall rules allow outbound connections on port 3306
- Test connection from VPS: `mysql -h mysql96.unoeuro.com -u gifalot_com -p`

## Step 4: Run Migrations

When you first connect, the backend will automatically run migrations to create the tables:

```bash
# On your VPS
cd /opt/gifalot/gif-j-backend
npm run migration:run
```

Or migrations run automatically on startup if `migrationsRun: true` is set (which it is).

## Step 5: Verify Connection

After starting your backend, check the logs:

```bash
pm2 logs gifalot-backend
```

You should see:
- ✅ Database connection successful
- ✅ Migrations completed
- ✅ Application started

## Troubleshooting

### "Access denied" error

- Double-check username and password
- Verify the database name is correct
- Check if Simply requires IP whitelisting (contact their support)

### "Can't connect to MySQL server"

- Verify the hostname is correct: `mysql96.unoeuro.com`
- Check if port 3306 is accessible from your VPS
- Test connection: `telnet mysql96.unoeuro.com 3306`

### "Unknown database"

- Verify database name: `gifalot_com_db`
- Check if the database exists in Simply's control panel
- Contact Simply support if database doesn't exist

### Connection timeout from VPS

Simply might require IP whitelisting. Contact Simply support and provide:
- Your Contabo VPS IP address
- Request to allow connections from that IP to MySQL

## Security Notes

⚠️ **Important:** 
- Never commit your `.env` file to Git (it's already in `.gitignore`)
- Keep your database password secure
- Consider using environment variables on your VPS instead of `.env` file
- Regularly backup your database

## Next Steps

1. ✅ Update `.env` with Simply's MySQL credentials
2. ✅ Test connection locally (optional)
3. ✅ Deploy backend to Contabo VPS
4. ✅ Update `.env` on VPS with same credentials
5. ✅ Start backend and verify migrations run
6. ✅ Test API endpoints

## Recommended Setup for Prototype

**Simple & Cheap:**
- ✅ **Simply MySQL**: Database (you have this!)
- ✅ **Contabo VPS**: Backend + Redis (~€4-5/month)
- ✅ **Contabo Object Storage**: File storage (already set up)
- ✅ **Netlify**: Frontend (free)

**Total Cost:** ~€5-7/month

Perfect for a prototype! 🚀







