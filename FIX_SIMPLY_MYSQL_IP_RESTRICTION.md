# Fix Simply MySQL IP Restriction Issue

## Problem
Simply MySQL only allows connections from `38.242.204.63` (your VPS public IP), but Docker containers connect from internal IPs like `192.168.48.4`, which are not whitelisted.

## Error
```
Access denied for user 'gifalot_com'@'192.168.48.4' (using password: YES)
```

## Solutions

### Solution 1: Contact Simply Support (Recommended)

Ask Simply support to whitelist your Docker network IP range:

**Message to Simply Support:**

```
Subject: MySQL IP Whitelist Request

Hello,

I need to connect to my MySQL database (mysql96.unoeuro.com) from Docker containers running on my VPS (38.242.204.63).

Currently, the MySQL user 'gifalot_com' is restricted to IP 38.242.204.63, but Docker containers use internal IP addresses (like 192.168.48.4) which are being blocked.

Could you please:
1. Allow connections from the entire VPS IP range (38.242.204.63/32 or the entire subnet)
2. OR whitelist Docker network IP ranges (192.168.0.0/16 or similar)

This will allow my application containers to connect to the database.

Thank you!
```

### Solution 2: Use Host Networking (Temporary Workaround)

Modify `docker-compose.yml` to use host networking for the app container:

```yaml
app:
  network_mode: "host"
  # Remove the networks section
  # networks:
  #   - 'gif-j'
  #   - 'infrastructure-traefik'
```

**Note:** This makes the container use the host's network, so connections appear from `38.242.204.63`. However, this can cause port conflicts and security concerns.

### Solution 3: MySQL Proxy on Host

Run a MySQL proxy on the host that forwards connections:

```bash
# Install proxy (example with socat)
apt-get install socat

# Forward MySQL connections
socat TCP-LISTEN:3307,fork TCP:mysql96.unoeuro.com:3306
```

Then connect to `localhost:3307` from containers.

### Solution 4: Check Simply MySQL Panel

1. Log into Simply MySQL control panel
2. Look for IP whitelist/access control settings
3. Add your VPS IP range or Docker network range

## Recommended Approach

**Best:** Contact Simply support to whitelist your Docker network IPs or allow the entire VPS IP.

**Quick Fix:** Use host networking mode (Solution 2) as a temporary workaround.

## Implementation: Host Networking (Quick Fix)

Edit `docker-compose.yml` on the server:

```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend
nano docker-compose.yml
```

Find the `app:` section and add:

```yaml
app:
  network_mode: "host"
  # Comment out or remove:
  # networks:
  #   - 'gif-j'
  #   - 'infrastructure-traefik'
```

**Important:** You'll also need to update Redis connection since it won't be on the Docker network anymore. Change `REDIS_HOST=redis` to `REDIS_HOST=localhost` in `.env`.

Then restart:

```bash
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose down
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app
```

## Long-term Solution

Contact Simply support to properly whitelist your Docker network IPs. This is the cleanest solution.




