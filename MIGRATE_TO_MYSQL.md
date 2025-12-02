# Migrating Backend from PostgreSQL to MySQL

## ✅ Feasibility Assessment

**Yes, it's feasible!** The codebase uses TypeORM which supports MySQL. The main changes needed are:

1. ✅ Change database driver
2. ✅ Update TypeORM configuration  
3. ✅ Regenerate migrations (or convert existing ones)
4. ✅ Update `.env` file

## Required Changes

### 1. Install MySQL Driver

```bash
cd gif-j-backend
npm uninstall pg
npm install mysql2
```

### 2. Update TypeORM Configuration

**File: `gif-j-backend/src/app.module.ts`**

Change:
```typescript
type: 'postgres',
```

To:
```typescript
type: 'mysql',
```

**File: `gif-j-backend/src/typeorm.config.ts`**

Change:
```typescript
type: 'postgres',
```

To:
```typescript
type: 'mysql',
```

### 3. Update Environment Variables

**File: `gif-j-backend/.env`**

Change from:
```env
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=gif-j-dev
```

To:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DB=gif-j-dev
```

### 4. Update Code References

**File: `gif-j-backend/src/app.module.ts`**

Change:
```typescript
host: configService.get<string>('POSTGRES_HOST'),
port: configService.get<number>('POSTGRES_PORT'),
username: configService.get<string>('POSTGRES_USER'),
password: configService.get<string>('POSTGRES_PASSWORD'),
database: configService.get<string>('POSTGRES_DB'),
```

To:
```typescript
host: configService.get<string>('MYSQL_HOST'),
port: configService.get<number>('MYSQL_PORT'),
username: configService.get<string>('MYSQL_USER'),
password: configService.get<string>('MYSQL_PASSWORD'),
database: configService.get<string>('MYSQL_DB'),
```

**File: `gif-j-backend/src/typeorm.config.ts`**

Change:
```typescript
host: process.env.POSTGRES_HOST,
port: Number(process.env.POSTGRES_PORT),
username: process.env.POSTGRES_USER,
password: process.env.POSTGRES_PASSWORD,
database: process.env.POSTGRES_DB,
```

To:
```typescript
host: process.env.MYSQL_HOST,
port: Number(process.env.MYSQL_PORT),
username: process.env.MYSQL_USER,
password: process.env.MYSQL_PASSWORD,
database: process.env.MYSQL_DB,
```

### 5. Update Entity Column Types

**File: `gif-j-backend/src/modules/collection/collection.entity.ts`**

Change:
```typescript
@Column({ type: 'character varying', nullable: true })
public coverImageKey: string | null;
```

To:
```typescript
@Column({ type: 'varchar', nullable: true })
public coverImageKey: string | null;
```

**File: `gif-j-backend/src/modules/file/file.entity.ts`**

Change:
```typescript
@Column({ type: 'character varying', nullable: true })
public rotation: string | null;
```

To:
```typescript
@Column({ type: 'varchar', nullable: true })
public rotation: string | null;
```

### 6. Regenerate Migrations

**Option A: Delete existing migrations and regenerate (if fresh database)**

```bash
# Delete old migrations
rm -rf src/migrations/*.ts

# Generate new migrations for MySQL
npm run migration:generate -- src/migrations/InitialMigration
```

**Option B: Convert existing migrations manually**

The main differences:
- `SERIAL` → `AUTO_INCREMENT`
- `character varying` → `VARCHAR`
- `boolean` → `TINYINT(1)` or `BOOLEAN`
- `SERIAL NOT NULL` → `INT AUTO_INCREMENT NOT NULL`

### 7. Update Docker Compose (if using)

**File: `gif-j-backend/docker-compose.yml`**

Replace PostgreSQL service with MySQL:

```yaml
mysql:
  hostname: '${MYSQL_HOST}'
  image: 'mysql:8.0'
  environment:
    MYSQL_ROOT_PASSWORD: '${MYSQL_PASSWORD}'
    MYSQL_DATABASE: '${MYSQL_DB}'
    MYSQL_USER: '${MYSQL_USER}'
    MYSQL_PASSWORD: '${MYSQL_PASSWORD}'
  expose:
    - '${MYSQL_PORT}'
  networks:
    - 'gif-j'
  volumes:
    - 'mysqldata:/var/lib/mysql'
  restart: 'always'
```

## Quick Migration Script

I can create an automated migration script that does all these changes for you. Would you like me to:

1. ✅ Update all TypeORM config files
2. ✅ Update entity files
3. ✅ Update package.json
4. ✅ Create new .env template
5. ✅ Update docker-compose.yml

## After Migration

1. **Install MySQL:**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Or use Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=yourpass -d mysql:8.0`

2. **Create database:**
   ```sql
   CREATE DATABASE `gif-j-dev`;
   ```

3. **Run migrations:**
   ```bash
   npm run migration:run
   ```

4. **Start server:**
   ```bash
   npm run start:dev
   ```

## Benefits of MySQL

- ✅ Easier to install on Windows
- ✅ More familiar to many developers
- ✅ Widely used in production
- ✅ Good performance
- ✅ Well-supported by TypeORM

## Notes

- `simple-array` type works the same in MySQL
- `enum` type works the same in MySQL
- All TypeORM decorators remain the same
- Only SQL syntax in migrations changes

Would you like me to automate these changes for you?











