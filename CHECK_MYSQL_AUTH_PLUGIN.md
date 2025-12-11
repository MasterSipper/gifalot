# Check MySQL Authentication Plugin

Run this on your server to see what authentication plugin Simply MySQL uses:

```bash
mysql -h mysql96.unoeuro.com -u gifalot_com -p -e "SELECT user, host, plugin FROM mysql.user WHERE user='gifalot_com';"
# Enter password: z6paFtf9D5Eryh4cdwgb
```

This will show if it's using:
- `caching_sha2_password` (MySQL 8.0 default)
- `mysql_native_password` (older method)

Then we can configure TypeORM accordingly.


