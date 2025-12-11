# Test MySQL Connection from Server

## Step 1: Test Direct Connection

SSH into your server and test the MySQL connection directly:

```bash
# Install MySQL client if not already installed
apt-get update
apt-get install -y mysql-client

# Test connection
mysql -h mysql96.unoeuro.com -u gifalot_com -p -e "SELECT 1;"
# Enter password: z6paFtf9D5Eryh4cdwgb
```

This will tell us:
- If credentials are correct
- What authentication method Simply MySQL uses
- If there are any connection issues

## Step 2: Check mysql2 Version

```bash
# Inside the container
docker exec services-gif-j-backend-dev-app-1 npm list mysql2
```

mysql2 v3.x should support `caching_sha2_password`, but we might need v3.6.0+.

## Step 3: Alternative Connection Options

If direct connection works but TypeORM doesn't, we might need to:

1. **Update mysql2 package** to latest version
2. **Use different connection options**
3. **Contact Simply support** for specific connection requirements


