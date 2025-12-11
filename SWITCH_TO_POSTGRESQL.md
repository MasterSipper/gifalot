# Switch Backend from MySQL to PostgreSQL

## Overview

This guide will help you switch your NestJS backend from MySQL to PostgreSQL. This is useful if you want to use Simply's managed PostgreSQL database.

## Prerequisites

- PostgreSQL database available (from Simply or elsewhere)
- Connection details (host, port, user, password, database name)
- Access to your backend code

## Step 1: Install PostgreSQL Driver

```bash
cd gif-j-backend

# Install PostgreSQL driver
npm install pg

# Remove MySQL driver (optional, but recommended)
npm uninstall mysql2
```

## Step 2: Update TypeORM Configuration

### File: `src/app.module.ts`

Find the `TypeOrmModule.forRootAsync` section and update:

**FROM:**
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get<string>('MYSQL_HOST'),
    port: configService.get<number>('MYSQL_PORT'),
    username: configService.get<string>('MYSQL_USER'),
    password: configService.get<string>('MYSQL_PASSWORD'),
    database: configService.get<string>('MYSQL_DB'),
    entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
    migrations: [resolve(__dirname, 'migrations/*.{ts,js}')],
    migrationsRun: true,
  }),
}),
```

**TO:**
```typescript
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('POSTGRES_HOST'),
    port: configService.get<number>('POSTGRES_PORT'),
    username: configService.get<string>('POSTGRES_USER'),
    password: configService.get<string>('POSTGRES_PASSWORD'),
    database: configService.get<string>('POSTGRES_DB'),
    entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
    migrations: [resolve(__dirname, 'migrations/*.{ts,js}')],
    migrationsRun: true,
  }),
}),
```

### File: `src/typeorm.config.ts`

Update the DataSource configuration:

**FROM:**
```typescript
export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
  migrations: [resolve(__dirname, 'migrations/*.{ts,js}')],
  migrationsRun: true,
});
```

**TO:**
```typescript
export default new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [resolve(__dirname, '**/*.entity.{ts,js}')],
  migrations: [resolve(__dirname, 'migrations/*.{ts,js}')],
  migrationsRun: true,
});
```

## Step 3: Update Environment Variables

### File: `env.template`

Update the database section:

**FROM:**
```env
# Database Configuration (MySQL)
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=gifalot
```

**TO:**
```env
# Database Configuration (PostgreSQL)
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
POSTGRES_DB=gifalot
```

### File: `.env` (your actual environment file)

Update with your PostgreSQL connection details from Simply:

```env
POSTGRES_HOST=your-simply-postgres-host
POSTGRES_PORT=5432
POSTGRES_USER=your-postgres-user
POSTGRES_PASSWORD=your-postgres-password
POSTGRES_DB=gifalot
```

## Step 4: Update Migrations

Your current migrations use MySQL syntax. You have two options:

### Option A: Regenerate Migrations (Recommended for Fresh Start)

If you're okay with recreating the database:

```bash
# Delete old migrations
rm src/migrations/*.ts

# Generate new PostgreSQL migrations
npm run migration:generate -- src/migrations/InitialMigration
```

### Option B: Convert Existing Migrations

Update your existing migration file:

**File: `src/migrations/1762306778194-AddOriginalUrlToFiles.ts`**

**FROM (MySQL syntax):**
```typescript
await queryRunner.query(`ALTER TABLE \`files\` ADD \`originalUrl\` varchar(255) NULL`);
```

**TO (PostgreSQL syntax):**
```typescript
await queryRunner.query(`ALTER TABLE "files" ADD "originalUrl" character varying(255) NULL`);
```

**Common Conversions:**
- `` `table` `` → `"table"` (or just `table` without quotes)
- `varchar(255)` → `character varying(255)` or `varchar(255)` (both work)
- `INT AUTO_INCREMENT` → `SERIAL` or `INT GENERATED ALWAYS AS IDENTITY`
- Backticks → Double quotes or remove quotes

## Step 5: Update Entity Files (if needed)

Most TypeORM decorators work the same for both databases. However, check:

### File: `src/modules/file/file.entity.ts`

The `varchar` type works in both, but you can be more explicit:

```typescript
// Current (works in both)
@Column({ type: 'varchar', nullable: true })
public originalUrl: string | null;

// PostgreSQL-specific (optional)
@Column({ type: 'character varying', nullable: true })
public originalUrl: string | null;
```

**Note:** TypeORM's `varchar` works fine in PostgreSQL, so you don't need to change this.

## Step 6: Update Docker Compose (for local development)

If you use Docker locally, update `docker-compose.yml`:

**FROM:**
```yaml
mysql:
  hostname: '${MYSQL_HOST}'
  image: 'mysql:8.0'
  environment:
    MYSQL_ROOT_PASSWORD: '${MYSQL_PASSWORD}'
    MYSQL_DATABASE: '${MYSQL_DB}'
  expose:
    - '${MYSQL_PORT}'
  ports:
    - '${MYSQL_PORT}:3306'
  networks:
    - 'gif-j'
  volumes:
    - 'mysqldata:/var/lib/mysql'
  restart: 'always'
  command: --default-authentication-plugin=mysql_native_password
```

**TO:**
```yaml
postgres:
  hostname: '${POSTGRES_HOST}'
  image: 'postgres:15'
  environment:
    POSTGRES_USER: '${POSTGRES_USER}'
    POSTGRES_PASSWORD: '${POSTGRES_PASSWORD}'
    POSTGRES_DB: '${POSTGRES_DB}'
  expose:
    - '${POSTGRES_PORT}'
  ports:
    - '${POSTGRES_PORT}:5432'
  networks:
    - 'gif-j'
  volumes:
    - 'postgresdata:/var/lib/postgresql/data'
  restart: 'always'
```

And update volumes:
```yaml
volumes:
  postgresdata:  # Changed from mysqldata
  redisdata:
```

## Step 7: Remove MySQL-Specific Code

### File: `src/modules/user/user.service.ts`

Find and remove or update the MySQL compatibility comment:

**FROM:**
```typescript
roles: ['user'], // Set default role for MySQL compatibility
```

**TO:**
```typescript
roles: ['user'],
```

## Step 8: Test the Connection

```bash
# Build the application
npm run build

# Test connection (migrations will run automatically)
npm run start:prod
```

Or test manually:

```bash
# Install PostgreSQL client (if not installed)
# On Ubuntu/Debian:
apt install postgresql-client

# Test connection
psql -h your-postgres-host -U your-postgres-user -d gifalot
```

## Step 9: Run Migrations

Migrations run automatically on startup, but you can run manually:

```bash
npm run migration:run
```

## Step 10: Verify Everything Works

1. Start the backend: `npm run start:dev`
2. Check logs for successful database connection
3. Test API endpoints
4. Verify data is being saved correctly

## Troubleshooting

### "relation does not exist" error

The database tables don't exist. Run migrations:

```bash
npm run migration:run
```

### "password authentication failed"

Check your `.env` file has correct PostgreSQL credentials.

### "could not connect to server"

- Verify PostgreSQL host and port
- Check if PostgreSQL allows remote connections
- Verify firewall settings

### Migration errors

If migrations fail, you may need to:
1. Drop and recreate the database (if starting fresh)
2. Or manually fix migration syntax

## Rollback (if needed)

If you need to go back to MySQL:

```bash
# Reinstall MySQL driver
npm install mysql2
npm uninstall pg

# Revert code changes
git checkout HEAD -- src/app.module.ts src/typeorm.config.ts

# Update .env back to MySQL variables
```

## Next Steps

1. ✅ Update code (Steps 1-7)
2. ✅ Configure `.env` with Simply's PostgreSQL details
3. ✅ Test connection
4. ✅ Run migrations
5. ✅ Deploy to production

## Using Simply's PostgreSQL

When you get your PostgreSQL details from Simply:

1. Add them to your `.env`:
   ```env
   POSTGRES_HOST=your-simply-postgres-host.simply.com
   POSTGRES_PORT=5432
   POSTGRES_USER=your-username
   POSTGRES_PASSWORD=your-password
   POSTGRES_DB=your-database-name
   ```

2. Make sure your backend (on Contabo VPS) can connect to Simply's PostgreSQL:
   - Check firewall rules
   - Verify connection string
   - Test connection from VPS

3. Deploy and test!




