# Fixing Migrations for MySQL

The migrations are still using PostgreSQL syntax. We need to regenerate them for MySQL.

## Option 1: Delete Old Migrations and Regenerate (Recommended)

This is the cleanest approach if you don't have important data.

### Steps:

1. **Stop the backend** (if running)

2. **Delete old migrations:**
   ```powershell
   cd C:\Projects\Gifalot\gif-j-backend
   Remove-Item src\migrations\*.ts
   ```

3. **Drop existing tables** (if any were created):
   ```powershell
   docker exec gif-j-backend-mysql-1 mysql -uroot -proot -e "USE \`gif-j-dev\`; DROP DATABASE \`gif-j-dev\`; CREATE DATABASE \`gif-j-dev\`;"
   ```

4. **Generate new migrations:**
   ```powershell
   npm run migration:generate -- src/migrations/InitialMigration
   ```

5. **Run migrations:**
   ```powershell
   npm run migration:run
   ```

6. **Start backend:**
   ```powershell
   npm run start:dev
   ```

## Option 2: Convert Existing Migrations Manually

If you need to keep the migration history, convert the SQL syntax:

### PostgreSQL → MySQL Syntax Changes:

- `SERIAL` → `INT AUTO_INCREMENT`
- `character varying` → `VARCHAR(255)`
- `boolean` → `TINYINT(1)`
- `"table_name"` → `` `table_name` ``
- `SERIAL NOT NULL` → `INT AUTO_INCREMENT NOT NULL`

### Example:

**PostgreSQL:**
```sql
CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL)
```

**MySQL:**
```sql
CREATE TABLE `users` (`id` INT AUTO_INCREMENT NOT NULL, `email` VARCHAR(255) NOT NULL)
```










