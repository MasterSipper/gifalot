# Fix MySQL Authentication Protocol Error

## Error
```
ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server
```

## Cause
The MySQL server (mysql96.unoeuro.com) is using a newer authentication method (`caching_sha2_password`) that the client needs to be configured to handle.

## Solution Applied

Updated `gif-j-backend/src/app.module.ts` to add connection options:

```typescript
extra: {
  ssl: false,
  authPlugin: 'mysql_native_password',
},
driver: require('mysql2'),
```

## Next Steps on Server

1. **Pull the latest code:**
   ```bash
   cd /home/ansible/services/dev/gif-j-backend/gif-j-backend
   git pull origin dev
   ```

2. **Rebuild the container:**
   ```bash
   COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app
   ```

3. **Check logs:**
   ```bash
   docker logs services-gif-j-backend-dev-app-1 --tail 50
   ```

## Alternative: If Still Failing

If the error persists, the MySQL user on the server might need to be updated to use `mysql_native_password`. However, since you're using a hosted MySQL service (Simply), you may not have access to change this.

In that case, we might need to:
1. Update the mysql2 package to the latest version
2. Or use different connection options

## Verify Fix

After rebuilding, the logs should show:
- ✅ Database connection successful
- ✅ No authentication errors
- ✅ Application started successfully




