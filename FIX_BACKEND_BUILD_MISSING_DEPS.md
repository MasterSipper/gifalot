# Fix Backend Build - Missing Dependencies

## Problem
`nest: not found` error when trying to build. This means `node_modules` is missing.

## Solution

### Step 1: Install Dependencies
**Command:**
```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend
npm install
```

**Expected Result:**
- Dependencies installed
- `node_modules` directory created
- May take a few minutes

### Step 2: Build the Backend
**Command:**
```bash
npm run build
```

**Expected Result:**
- Build completes successfully
- `dist/` directory created with compiled code

### Step 3: Rebuild Docker Container
**Command:**
```bash
docker compose build --no-cache
docker compose up -d
```

**Expected Result:**
- Container rebuilt with new code
- Container starts successfully

## Quick One-Liner

```bash
cd /home/ansible/services/dev/gif-j-backend/gif-j-backend && \
npm install && \
npm run build && \
docker compose build --no-cache && \
docker compose up -d
```

## Note

The Docker build process should handle `npm install` automatically, but if you're building manually or if the Dockerfile doesn't install dependencies, you need to run `npm install` first.

If you're using Docker Compose, the build process in the Dockerfile should install dependencies. The error suggests you might be trying to build outside of Docker. Use `docker compose build` instead of `npm run build` directly.



