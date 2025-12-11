# Resolve Docker Compose Conflict on Server

## Problem
Local changes to `docker-compose.yml` conflict with incoming changes from git.

## Solution

On your server, run:

```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend

# Option 1: Stash local changes (safest - keeps them for later)
git stash
git pull origin dev
# If you need the stashed changes later: git stash pop

# Option 2: Discard local changes (if they're not needed)
git reset --hard origin/dev
git pull origin dev

# Option 3: See what the local changes are first
git diff gif-j-backend/docker-compose.yml
# Then decide: stash, commit, or reset
```

## Recommended: Stash First

```bash
git stash
git pull origin dev
COMPOSE_PROJECT_NAME=services-gif-j-backend-dev docker compose up -d --build app
```

This preserves your local changes in case you need them, but updates to the latest version.





