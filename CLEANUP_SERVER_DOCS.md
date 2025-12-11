# Cleanup Documentation Files on Server

## Issue
Many `.md` documentation files are being pulled from GitHub to the production server. These files are not needed on the server and take up space.

## Solution: Add .md files to .gitignore

The documentation files should be excluded from the repository that gets deployed to the server, OR we can add them to `.gitignore` in a way that they're still in the repo but not deployed.

### Option 1: Add to .gitignore (Recommended)

Create or update `.gitignore` in the repository root:

```gitignore
# Documentation files (keep in repo, but don't deploy to server)
*.md
!README.md
```

This keeps `README.md` but ignores all other `.md` files.

### Option 2: Use .dockerignore

If using Docker, add to `.dockerignore` in `gif-j-backend/`:

```dockerignore
# Documentation
*.md
!README.md
```

### Option 3: Manual Cleanup on Server

If you want to clean up existing files on the server:

```bash
# SSH into server
ssh root@38.242.204.63 -p 2049

# Navigate to backend directory
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend

# Remove all .md files except README.md
find . -name "*.md" ! -name "README.md" -type f -delete

# Or move them to a backup location
mkdir -p ../docs-backup
find . -name "*.md" ! -name "README.md" -type f -exec mv {} ../docs-backup/ \;
```

## Recommended Approach

**Best solution:** Add documentation files to `.gitignore` or `.dockerignore` so they don't get deployed in the first place. The documentation is useful in the GitHub repository for developers, but not needed on the production server.

## Files That Should Stay on Server

- `README.md` - Basic project info
- `.env` - Environment configuration (already in .gitignore)
- `docker-compose.yml` - Container configuration
- Source code files

## Files That Can Be Removed from Server

- All other `.md` files (setup guides, troubleshooting, etc.)
- These are documentation for developers, not needed at runtime




