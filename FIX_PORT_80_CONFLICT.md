# Fix Port 80 Conflict - Manual Steps

## Run these commands on your server:

```bash
# 1. Check what's using port 80
sudo lsof -i :80
# OR
sudo netstat -tlnp | grep :80
# OR  
sudo ss -tlnp | grep :80

# 2. If it's a Docker container, stop it:
docker ps | grep -E "traefik|80:80"
# Then stop it:
docker stop <CONTAINER_ID>
docker rm <CONTAINER_ID>

# 3. If it's a system service (nginx/apache), you may want to stop it:
sudo systemctl stop nginx
# OR
sudo systemctl stop apache2

# 4. Quick nuclear option - kill whatever is using port 80:
sudo fuser -k 80/tcp

# 5. Verify port 80 is now free:
sudo lsof -i :80
# Should return nothing

# 6. After freeing port 80, the GitHub Actions deployment should work
```

## Alternative: Skip Traefik Deployment

If Traefik is already working on your server and you just want to deploy the app, we could skip the Traefik playbook. But first, let's fix the port conflict.

Run the commands above and let me know what's using port 80!
