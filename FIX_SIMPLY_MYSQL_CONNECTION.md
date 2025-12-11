# Fix Simply MySQL Connection Error

## Current Error
```
ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server
```

## Step 1: Test Direct Connection

SSH into your server and test the connection:

```bash
# Install MySQL client
apt-get update
apt-get install -y mysql-client

# Test connection
mysql -h mysql96.unoeuro.com -P 3306 -u gifalot_com -p
# Enter password: z6paFtf9D5Eryh4cdwgb

# If connection works, try:
SELECT 1;
SHOW VARIABLES LIKE 'default_authentication_plugin';
```

This will show:
- If credentials work
- What authentication plugin Simply MySQL uses

## Step 2: Check mysql2 Version

```bash
# Check mysql2 version in container
docker exec services-gif-j-backend-dev-app-1 npm list mysql2

# Should be v3.6.0+ for caching_sha2_password support
```

## Step 3: Update mysql2 if Needed

If version is old, update it:

```bash
# On your local machine
cd gif-j-backend
npm install mysql2@latest
git add package.json package-lock.json
git commit -m "Update mysql2 to latest version"
git push origin dev
```

Then rebuild on server.

## Step 4: Contact Simply Support

If direct connection works but TypeORM doesn't, contact Simply support and ask:

1. **What authentication plugin does the MySQL user use?**
   - `caching_sha2_password` (MySQL 8.0 default)
   - `mysql_native_password` (older)

2. **Do you require SSL for connections?**
   - If yes, what SSL configuration is needed?

3. **Are there any special connection requirements?**
   - Connection string format
   - Required connection options
   - IP whitelisting needed?

4. **Can you change the user's authentication plugin?**
   - If they can change it to `mysql_native_password`, that might work better

## Step 5: Alternative Connection Options

Try these configurations in `app.module.ts`:

### Option A: With SSL (if Simply requires it)
```typescript
extra: {
  ssl: {
    rejectUnauthorized: false,
  },
},
```

### Option B: Without SSL
```typescript
extra: {
  ssl: false,
},
```

### Option C: Explicit authentication
```typescript
extra: {
  authPlugins: {
    caching_sha2_password: () => () => Buffer.from(process.env.MYSQL_PASSWORD || ''),
  },
},
```

## Step 6: Check Simply MySQL Documentation

Look for Simply's MySQL connection documentation:
- Connection string format
- Required SSL settings
- Authentication requirements
- Example connection code

## Most Likely Solution

Based on the error, Simply MySQL is likely using `caching_sha2_password` and we need to:

1. **Ensure mysql2 is v3.6.0+** (supports caching_sha2_password)
2. **Use correct SSL configuration** (if Simply requires SSL)
3. **Or ask Simply to change user to mysql_native_password**

## Quick Test Commands

```bash
# On server - test connection
mysql -h mysql96.unoeuro.com -u gifalot_com -p -e "SELECT 1;"

# Check mysql2 version in container
docker exec services-gif-j-backend-dev-app-1 npm list mysql2

# Check package.json version
grep mysql2 gif-j-backend/package.json
```

## Next Steps

1. Test direct MySQL connection from server
2. Check mysql2 version
3. Contact Simply support if needed
4. Try different connection configurations





