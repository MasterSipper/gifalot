# Setting Up Local MySQL Database

## Option 1: Using Docker (Recommended - Easiest)

### Step 1: Install Docker Desktop
- Download: https://www.docker.com/products/docker-desktop/
- Install and restart your computer

### Step 2: Start MySQL with Docker

```powershell
cd C:\Projects\Gifalot\gif-j-backend

# Start MySQL and Redis
docker-compose up -d mysql redis
```

This will:
- ✅ Create MySQL container
- ✅ Create database automatically (`gif-j-dev` based on `MYSQL_DB` in `.env`)
- ✅ Set up root user with password from `.env`

### Step 3: Verify It's Running

```powershell
docker ps
```

You should see MySQL and Redis containers running.

### Step 4: Update Your .env File

Make sure `gif-j-backend\.env` has:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root
MYSQL_DB=gif-j-dev
```

**Done!** The database is ready. You can now start your backend.

---

## Option 2: Local MySQL Installation

### Step 1: Install MySQL

1. **Download MySQL:**
   - Visit: https://dev.mysql.com/downloads/mysql/
   - Choose: **MySQL Installer for Windows**
   - Download the installer (recommended: MySQL Installer MSI)

2. **Run the Installer:**
   - Choose "Developer Default" or "Server only"
   - During installation, you'll be asked to:
     - Set root password (remember this!)
     - Configure port (default: 3306)
     - Start MySQL as Windows service

3. **Complete Installation:**
   - MySQL will be installed and started automatically
   - MySQL Workbench will be installed (GUI tool)

### Step 2: Verify MySQL is Running

```powershell
# Check MySQL service
Get-Service | Where-Object {$_.Name -like "*mysql*"}

# Should show MySQL service running
```

Or test connection:
```powershell
mysql --version
```

### Step 3: Create the Database

You can create the database in two ways:

#### Method A: Using MySQL Command Line

1. **Open MySQL Command Line:**
   ```powershell
   mysql -u root -p
   ```
   Enter your root password when prompted.

2. **Create Database:**
   ```sql
   CREATE DATABASE `gif-j-dev`;
   SHOW DATABASES;
   exit;
   ```

#### Method B: Using MySQL Workbench (GUI)

1. **Open MySQL Workbench** (installed with MySQL)

2. **Connect to Local Instance:**
   - Click on "Local instance MySQL80" (or your instance name)
   - Enter root password

3. **Create Database:**
   - Click the "Create a new schema" icon (⚡)
   - Schema name: `gif-j-dev`
   - Collation: `utf8mb4_unicode_ci` (default)
   - Click "Apply"

### Step 4: Update Your .env File

Edit `gif-j-backend\.env` and set:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_actual_root_password_here
MYSQL_DB=gif-j-dev
```

**Important:** Replace `your_actual_root_password_here` with the password you set during MySQL installation!

---

## Option 3: Using XAMPP (Easiest for Windows)

### Step 1: Install XAMPP

1. **Download XAMPP:**
   - https://www.apachefriends.org/download.html
   - Download and install XAMPP for Windows

2. **Start MySQL:**
   - Open XAMPP Control Panel
   - Click "Start" next to MySQL

### Step 2: Create Database

1. **Open phpMyAdmin:**
   - In XAMPP Control Panel, click "Admin" next to MySQL
   - Or go to: http://localhost/phpMyAdmin

2. **Create Database:**
   - Click "New" in left sidebar
   - Database name: `gif-j-dev`
   - Collation: `utf8mb4_unicode_ci`
   - Click "Create"

### Step 3: Update .env File

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=        # Leave empty (XAMPP default)
MYSQL_DB=gif-j-dev
```

---

## Verify Database Connection

After setting up, test the connection:

### Using Command Line:
```powershell
mysql -u root -p -e "SHOW DATABASES;"
```

You should see `gif-j-dev` in the list.

### Using Your Backend:

1. **Start the backend:**
   ```powershell
   cd gif-j-backend
   npm run start:dev
   ```

2. **Check for errors:**
   - If you see "Connected to MySQL" or no database errors, it's working!
   - If you see connection errors, check:
     - MySQL is running
     - Password in `.env` is correct
     - Database exists

---

## Quick Reference

### Database Location

**Docker:**
- Database is stored in Docker volume: `mysqldata`
- Data persists even if container stops

**Local Installation:**
- Default location: `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`
- Database folder: `gif-j-dev\`

### Connection Settings

**Default MySQL Settings:**
- Host: `localhost` or `127.0.0.1`
- Port: `3306`
- Default user: `root`
- Default password: (set during installation)

### Common Commands

```sql
-- Connect to MySQL
mysql -u root -p

-- List databases
SHOW DATABASES;

-- Use database
USE `gif-j-dev`;

-- Show tables
SHOW TABLES;

-- Check table structure
DESCRIBE users;
```

---

## Troubleshooting

### "Access denied" error

1. **Check password in `.env` matches MySQL root password**
2. **Reset MySQL password if needed:**
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
   FLUSH PRIVILEGES;
   ```

### "Unknown database" error

1. **Create the database:**
   ```sql
   CREATE DATABASE `gif-j-dev`;
   ```

### "Can't connect to MySQL server" error

1. **Check MySQL service is running:**
   ```powershell
   Get-Service | Where-Object {$_.Name -like "*mysql*"}
   ```

2. **Start MySQL service:**
   ```powershell
   Start-Service MySQL*
   ```

### Port 3306 already in use

1. **Find what's using the port:**
   ```powershell
   netstat -ano | findstr ":3306"
   ```

2. **Change MySQL port in `.env`** (e.g., `3307`)
3. **Update MySQL configuration** to use new port

---

## Recommended: Use Docker

**Docker is the easiest option** because:
- ✅ No manual installation needed
- ✅ Database created automatically
- ✅ Easy to reset/restart
- ✅ Clean environment
- ✅ Works the same on all systems

Just run:
```powershell
docker-compose up -d mysql redis
```










