# Fix Ansible Sudo Password Error

## Problem:
The deployment is failing with "Incorrect sudo password" when trying to run the docker playbook.

## Solutions (try in order):

### Option 1: Check/Update GitHub Secret (Recommended)

1. Go to GitHub → Settings → Secrets and variables → Actions
2. Find `ANSIBLE_PASSWORD_DEV`
3. Check if it's correct - this should be the `ansible` user's sudo password on the server
4. If it's wrong or missing, update it with the correct password

### Option 2: Enable Passwordless Sudo (Best Practice)

If the `ansible` user should have passwordless sudo, configure it on the server:

```bash
# SSH to server as root
# Edit sudoers file
sudo visudo

# Add this line (if not already present):
ansible ALL=(ALL) NOPASSWD: ALL

# Save and exit
```

Then the docker playbook won't need a password. However, the workflow would still pass `ansible_sudo_pass`, which would just be ignored.

### Option 3: Skip Docker Playbook if Docker is Already Installed

If Docker is already installed on the server, we can skip the docker playbook. Check:

```bash
# On server, check if Docker is installed:
docker --version
docker compose version
```

If Docker is already installed, we might be able to skip that playbook step or mark it as optional.

### Option 4: Use Root User Instead (Not Recommended)

If the ansible user doesn't have sudo, you could use root user, but this is less secure.

## Current Status:

The deployment needs the sudo password to:
- Install Docker packages
- Create Docker group
- Add user to Docker group

Most servers should already have Docker installed, so this playbook might not need to run on every deployment.

## Next Steps:

1. **First, check what the ANSIBLE_PASSWORD_DEV secret is set to in GitHub**
2. **Verify the password is correct on the server** (SSH as root and test `su ansible` then `sudo whoami`)
3. **Update the secret if needed**
4. **Or configure passwordless sudo** (preferred for automation)

Would you like me to update the workflow to make the docker playbook optional, or help you verify the password?
