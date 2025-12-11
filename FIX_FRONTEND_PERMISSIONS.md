# Fix Frontend Deployment Permissions

## Error
```
tar: build: Cannot mkdir: Permission denied
```

## Problem
The `ansible` user doesn't have write permissions to `/var/www/gifalot-frontend-test/`.

## Solution: Fix Permissions on Server

Run these commands on your server:

```bash
# Make sure the directory exists and has correct ownership
sudo mkdir -p /var/www/gifalot-frontend-test
sudo chown -R ansible:ansible /var/www/gifalot-frontend-test
sudo chmod -R 755 /var/www/gifalot-frontend-test
```

## Alternative: Use ansible User's Home Directory

If you prefer, we can change the deployment target to a directory the ansible user owns:

```bash
# Create directory in ansible user's home
sudo mkdir -p /home/ansible/www/gifalot-frontend-test
sudo chown -R ansible:ansible /home/ansible/www/gifalot-frontend-test
```

Then update the workflow to deploy there instead.

## Recommended: Fix Permissions

The easiest fix is to give the `ansible` user ownership of the directory:

```bash
# On your server
sudo chown -R ansible:ansible /var/www/gifalot-frontend-test
sudo chmod -R 755 /var/www/gifalot-frontend-test
```

This allows the `ansible` user to write files during deployment, and the Nginx container (running as user 101) can still read them.

## After Fixing Permissions

1. Re-run the workflow
2. The frontend deployment should succeed
3. Files will be deployed to `/var/www/gifalot-frontend-test/`

