# Branch Testing Setup Exploration - test.gifalot.com

## Quick Summary

**Goal**: Set up `test.gifalot.com` to automatically deploy branches so you can test before committing to `main` without affecting `dev.gifalot.com`.

**Current Architecture** (Updated):
- **Production**: `dev.gifalot.com` (working, don't touch!)
  - Frontend: Static files at `/var/www/gifalot-frontend`, served via Nginx on port 8080
  - Backend: NestJS deployed via GitHub Actions + Ansible on `main` branch pushes
  - Deployment: Ansible playbooks via GitHub Actions workflow (`deploy-dev.yml`)
  - Reverse Proxy: Traefik routes requests to frontend/backend

**Recommended Approach**: Deploy branches to separate test environment on same VPS

**Why This Works**:
- ✅ Same infrastructure as production (same VPS)
- ✅ Isolated from `dev.gifalot.com` 
- ✅ Can test both frontend and backend changes
- ✅ Uses existing Ansible/deployment setup

---

## Current Setup Details

### Production (`dev.gifalot.com`)
- **Frontend**: 
  - Directory: `/var/www/gifalot-frontend` on Contabo server
  - Served by: Nginx Docker container on port 8080
  - Deployment: Manual via `rsync` or `scp`
  
- **Backend**: 
  - Deployed via: GitHub Actions workflow (`.github/workflows/deploy-dev.yml`)
  - Runs on: Port 3333 (via Docker)
  - Stage: `dev`
  - Database: Shared MySQL/Redis
  
- **Routing**:
  - Traefik routes `dev.gifalot.com/` → Frontend (port 8080)
  - Traefik routes `dev.gifalot.com/gif-j/` → Backend (port 3333)

## Goal

Set up `test.gifalot.com` to automatically deploy branches (not `main`) so you can test changes before committing to `main`.

## Architecture Options

### Option 1: Full Test Environment on VPS (Recommended)

**How it works:**
- Deploy both frontend and backend to separate test environment on same VPS
- Use separate directories, ports, and Docker services
- Configure Traefik to route `test.gifalot.com` to test services
- Deploy via GitHub Actions when pushing to branches (not `main`)

**Pros:**
- ✅ Full control over both frontend and backend
- ✅ Same infrastructure as production (`dev.gifalot.com`)
- ✅ Can test both frontend and backend changes
- ✅ Completely isolated from production
- ✅ Uses existing deployment infrastructure (GitHub Actions + Ansible)

**Cons:**
- ⚠️ Need to set up separate test deployment workflow
- ⚠️ Need to manage test database/Redis (can be shared or separate)
- ⚠️ Uses more server resources (separate containers)
- ⚠️ Frontend needs to be built and deployed (via GitHub Actions)

**Implementation steps:**
1. Create GitHub Actions workflow for branch deployments
2. Set up separate frontend directory (`/var/www/gifalot-frontend-test`)
3. Configure separate backend service (port 3334, stage `test`)
4. Add Traefik routing for `test.gifalot.com`
5. Set up DNS for `test.gifalot.com`

---

### Option 2: Backend-Only Test (Simpler)

**How it works:**
- **Frontend**: Reuse production frontend (same static files)
- **Backend**: Deploy test branch to separate backend service
- **Environment**: Test backend on `test.gifalot.com/gif-j/`, frontend points to it

**Pros:**
- ✅ Simpler setup (no frontend deployment needed)
- ✅ Can test backend changes independently
- ✅ Less server resources used

**Cons:**
- ⚠️ Cannot test frontend changes on `test.gifalot.com`
- ⚠️ Frontend code changes still require deploying to `dev.gifalot.com`
- ⚠️ Need to manually update frontend `.env` or API URL config

**Best for:** Testing only backend changes

---

## Recommended Approach: Option 1 (Full Test Environment on VPS)

### Implementation Overview

This setup creates a parallel test environment on the same VPS:
- **Frontend**: `/var/www/gifalot-frontend-test` → Nginx on port 8081
- **Backend**: `gif-j-backend-test` service → Port 3334 (STAGE=test)
- **Domain**: `test.gifalot.com` → Traefik routes to test services

---

### Phase 1: GitHub Actions Workflow for Branch Deploys

**1. Create New Workflow File**

Create `gif-j-backend/.github/workflows/deploy-test.yml`:

```yaml
name: Deploy TEST

on:
  push:
    branches-ignore:
      - main  # Don't deploy main branch (that's for dev.gifalot.com)
  workflow_dispatch:
    inputs:
      branch:
        description: 'Branch to deploy'
        required: false

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    if: github.ref != 'refs/heads/main'
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          ref: ${{ github.ref }}

      - name: Run Playbook - Application (TEST)
        uses: dawidd6/action-ansible-playbook@v9c825aa4d5c39496e71448bb7ae16a71f5fc75e1
        with:
          playbook: ansible/playbooks/app/main.yml
          key: ${{ secrets.ANSIBLE_PRIVATE_SSH_KEY_DEV }}
          inventory: |
            [dev_infrastructure]
            vps1   ansible_host=${{ secrets.ANSIBLE_HOST_VPS1_DEV }}   ansible_port=${{ secrets.ANSIBLE_PORT_DEV }}   ansible_user=ansible
          options: |
            --extra-vars "STAGE=test"
            --extra-vars "AWS_ACCESS_KEY_ID=${{ secrets.AWS_ACCESS_KEY_ID_DEV }}"
            --extra-vars "AWS_SECRET_ACCESS_KEY=${{ secrets.AWS_SECRET_ACCESS_KEY_SECRET_DEV }}"
            --extra-vars "GOOGLE_RECAPTCHA_SECRET_KEY=${{ secrets.GOOGLE_RECAPTCHA_SECRET_KEY_DEV }}"
            --extra-vars "GIPHY_API_KEY=${{ secrets.GIPHY_API_KEY_DEV }}"
            --extra-vars "MAIL_USER=${{ secrets.MAIL_USER_DEV }}"
            --extra-vars "MAIL_PASSWORD=${{ secrets.MAIL_PASSWORD_DEV }}"
            --extra-vars "REDIS_HOST=${{ secrets.REDIS_HOST_DEV }}"
            --extra-vars "REDIS_PASSWORD=${{ secrets.REDIS_PASSWORD_DEV }}"
            --extra-vars "POSTGRES_HOST=${{ secrets.POSTGRES_HOST_DEV }}"
            --extra-vars "POSTGRES_DB=${{ secrets.POSTGRES_DB_DEV }}_test"
            --extra-vars "POSTGRES_USER=${{ secrets.POSTGRES_USER_DEV }}"
            --extra-vars "POSTGRES_PASSWORD=${{ secrets.POSTGRES_PASSWORD_DEV }}"
            --extra-vars "JWT_ACCESS_TOKEN_SECRET=${{ secrets.JWT_ACCESS_TOKEN_SECRET_DEV }}"
            --extra-vars "JWT_REFRESH_TOKEN_SECRET=${{ secrets.JWT_REFRESH_TOKEN_SECRET_DEV }}"
            --extra-vars "ansible_sudo_pass=${{ secrets.ANSIBLE_PASSWORD_DEV }}"

  deploy-frontend:
    runs-on: ubuntu-latest
    if: github.ref != 'refs/heads/main'
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
        with:
          ref: ${{ github.ref }}
          path: repo

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Frontend Dependencies
        working-directory: repo/gif-j-react
        run: npm ci

      - name: Build Frontend
        working-directory: repo/gif-j-react
        env:
          REACT_APP_API_URL: https://test.gifalot.com/gif-j/
        run: npm run build

      - name: Deploy Frontend to Server
        uses: SamKirkland/FTP-Deploy-Action@v4.3.4
        with:
          server: ${{ secrets.FTP_SERVER_DEV }}
          username: ${{ secrets.FTP_USERNAME_DEV }}
          password: ${{ secrets.FTP_PASSWORD_DEV }}
          local-dir: repo/gif-j-react/build/
          server-dir: /var/www/gifalot-frontend-test/
        # Alternative: Use rsync via SSH (if you have SSH key setup)
        # - name: Deploy via rsync
        #   run: |
        #     echo "${{ secrets.ANSIBLE_PRIVATE_SSH_KEY_DEV }}" > /tmp/ssh_key
        #     chmod 600 /tmp/ssh_key
        #     rsync -avz --delete -e "ssh -i /tmp/ssh_key -o StrictHostKeyChecking=no" \
        #       repo/gif-j-react/build/ \
        #       ansible@${{ secrets.ANSIBLE_HOST_VPS1_DEV }}:/var/www/gifalot-frontend-test/
```

**Note**: The frontend deployment step may need adjustment based on your server access method (FTP, SSH, etc.)

---

### Phase 2: Server Setup (One-Time)

**1. Create Frontend Directory**

On Contabo server:
```bash
mkdir -p /var/www/gifalot-frontend-test
chown -R root:root /var/www/gifalot-frontend-test
chmod -R 755 /var/www/gifalot-frontend-test
```

**2. Create Nginx Container for Test Frontend**

On Contabo server:
```bash
docker run -d \
  --name gifalot-frontend-test \
  --network host \
  -v /var/www/gifalot-frontend-test:/usr/share/nginx/html:ro \
  --restart always \
  nginx:alpine

# Configure Nginx to listen on port 8081
docker exec -it gifalot-frontend-test sh -c "sed -i 's/listen.*80;/listen 8081;/' /etc/nginx/conf.d/default.conf && nginx -s reload"
```

---

### Phase 3: Traefik Configuration

**Update Traefik Dynamic Config**

On Contabo server, create/update `/etc/traefik/dynamic/test.yml`:

```yaml
http:
  routers:
    test-frontend:
      rule: "Host(`test.gifalot.com`) && !PathPrefix(`/gif-j`)"
      service: test-frontend-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 1
    
    test-backend:
      rule: "Host(`test.gifalot.com`) && PathPrefix(`/gif-j`)"
      service: test-backend-service
      entryPoints:
        - websecure
      tls:
        certResolver: letsencrypt
      priority: 10
  
  services:
    test-frontend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:8081"
    
    test-backend-service:
      loadBalancer:
        servers:
          - url: "http://localhost:3334"
```

Restart Traefik:
```bash
docker restart traefik-traefik-1
```

---

### Phase 4: DNS Setup

Add DNS record:
- `test.gifalot.com` → A record → `38.242.204.63` (your Contabo VPS IP)

---

### Phase 5: Ansible Configuration

The Ansible playbooks should already support `STAGE=test`:
- Service name: `gif-j-backend-test` (from `vars.yml`: `service_name_stage: '{{ service_name }}-{{ STAGE }}'`)
- Port: Configure in `vars.yml` or via environment variable (defaults to 3333, need to override for test)
- Remote directory: `/home/ansible/services/test` (vs `/home/ansible/services/dev`)

**Note**: You may need to update `vars.yml` or add test-specific variables to handle port differences.

---

## Database Considerations

### Option A: Separate Test Database (Recommended)
- **Pros**: Isolated, safe to test migrations, can reset easily
- **Cons**: More setup, uses more resources

### Option B: Shared Database with Dev
- **Pros**: Simple, no additional setup
- **Cons**: Risk of test data affecting dev environment
- **Use case**: Only if testing frontend-only changes

---

## Workflow Examples

### Testing Frontend Changes
1. Create branch: `git checkout -b feature/new-ui`
2. Make changes in `gif-j-react/`
3. Push: `git push origin feature/new-ui`
4. GitHub Actions workflow runs:
   - Builds frontend with `REACT_APP_API_URL=https://test.gifalot.com/gif-j/`
   - Deploys to `/var/www/gifalot-frontend-test`
5. Visit `test.gifalot.com` to see your changes
6. Backend uses test environment (`test.gifalot.com/gif-j/`)

### Testing Backend Changes
1. Create branch: `git checkout -b feature/new-api`
2. Make backend changes in `gif-j-backend/`
3. Push: `git push origin feature/new-api`
4. GitHub Actions workflow runs:
   - Deploys backend with `STAGE=test` to port 3334
   - Service name: `gif-j-backend-test`
5. Test frontend at `test.gifalot.com` connects to `test.gifalot.com/gif-j/` (test backend)

### Testing Full Stack Changes
1. Create branch: `git checkout -b feature/full-stack-change`
2. Make both frontend and backend changes
3. Push branch: `git push origin feature/full-stack-change`
4. Both deploy automatically:
   - Frontend → `/var/www/gifalot-frontend-test` (port 8081)
   - Backend → `gif-j-backend-test` (port 3334)
5. Visit `test.gifalot.com` to test everything together

---

## Cost Considerations

### VPS Resources
- Uses same VPS as dev (no additional server cost)
- Additional resources used:
  - Separate Docker containers (frontend + backend)
  - Separate database (if using separate test DB)
  - Separate Redis (if using separate test Redis)
  - Additional disk space for test frontend files
- **Estimated impact**: Minimal - mostly just container overhead

---

## Security Considerations

1. **Test Environment Access**
   - Consider if test environment should be public or password-protected
   - Netlify supports password protection for branch deploys

2. **Environment Variables**
   - Use separate secrets for test environment
   - Don't use production secrets in test

3. **CORS Configuration**
   - Backend needs to allow `test.gifalot.com` in `CORS_ORIGINS`

---

## Next Steps (If Proceeding)

1. **Confirm approach**: Option 1 (Full test environment) or Option 2 (Backend only)?
2. **GitHub Actions**: Create `deploy-test.yml` workflow in `gif-j-backend/.github/workflows/`
3. **Server setup**: Create frontend directory and Nginx container for test
4. **Traefik config**: Add `test.gifalot.com` routing rules
5. **DNS**: Configure `test.gifalot.com` A record pointing to VPS
6. **Ansible vars**: Update to support test stage port differences (if needed)
7. **SSL certificate**: Traefik will auto-generate via Let's Encrypt

---

## Questions to Consider

1. **Separate database**: Do you want a separate test database, or share with dev?
   - Separate = safer, can test migrations, isolated data
   - Shared = simpler, less resources, but test data affects dev

2. **Deployment trigger**: Should test deploy on every branch push, or manual only?
   - Auto on push = always up to date, but uses more resources
   - Manual = more control, less server load

3. **Frontend deployment method**: How should frontend files be transferred?
   - FTP (if you have FTP access)
   - SSH/rsync (via Ansible SSH key)
   - Direct build on server (via Ansible)

4. **Port configuration**: How to handle port differences?
   - Hardcode port 3334 for test in Ansible vars
   - Use environment variable override
   - Configure in `vars.yml` based on STAGE

5. **CORS configuration**: Backend needs to allow `test.gifalot.com`
   - Update `CORS_ORIGINS` to include `https://test.gifalot.com`

