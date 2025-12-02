# Starting MySQL and Redis Containers

## Quick Start (CMD)

If your containers are stopped, start them with:

```cmd
cd C:\Projects\Gifalot\gif-j-backend

REM Start MySQL and Redis
docker start gif-j-backend-mysql-1
docker start gif-j-backend-redis-1

REM Or start both at once
docker-compose start mysql redis
```

## Check if Running

```cmd
docker ps
```

You should see both `mysql` and `redis` containers with status "Up".

## Start Backend After Containers

Once containers are running:

```cmd
cd C:\Projects\Gifalot\gif-j-backend
npm run start:dev
```

## If Containers Keep Stopping

If containers exit unexpectedly:

1. **Check logs:**
   ```cmd
   docker logs gif-j-backend-mysql-1
   ```

2. **Restart fresh:**
   ```cmd
   docker-compose down
   docker-compose up -d mysql redis
   ```

## Auto-Start on System Boot

To make containers start automatically:

```cmd
docker update --restart=always gif-j-backend-mysql-1
docker update --restart=always gif-j-backend-redis-1
```










