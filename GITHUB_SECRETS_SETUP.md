# GitHub Secrets Setup - Repository vs Environment

## Recommendation: Use Repository Secrets

For your test environment setup, **use Repository secrets** because:

1. ✅ Your workflow is already configured to use repository secrets
2. ✅ Simpler setup - no need to configure environments
3. ✅ Same secrets as dev environment (they're already set up)
4. ✅ Works immediately without additional configuration

---

## Repository Secrets (Recommended)

**Location:** Settings → Secrets and variables → Actions → **Repository secrets**

**How to add:**
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret

**These should already exist** (from your `deploy-dev.yml` setup):
- `ANSIBLE_PRIVATE_SSH_KEY_DEV`
- `ANSIBLE_HOST_VPS1_DEV`
- `ANSIBLE_PORT_DEV`
- `ANSIBLE_PASSWORD_DEV`
- `AWS_ACCESS_KEY_ID_DEV`
- `AWS_SECRET_ACCESS_KEY_SECRET_DEV`
- `GOOGLE_RECAPTCHA_SECRET_KEY_DEV`
- `GIPHY_API_KEY_DEV`
- `MAIL_USER_DEV`
- `MAIL_PASSWORD_DEV`
- `REDIS_HOST_DEV`
- `REDIS_PASSWORD_DEV`
- `POSTGRES_HOST_DEV`
- `POSTGRES_DB_DEV`
- `POSTGRES_USER_DEV`
- `POSTGRES_PASSWORD_DEV`
- `JWT_ACCESS_TOKEN_SECRET_DEV`
- `JWT_REFRESH_TOKEN_SECRET_DEV`

**If they exist:** You're all set! The workflow will use them automatically.

**If any are missing:** Add them as Repository secrets.

---

## Environment Secrets (Alternative - More Complex)

**When to use:** If you want separate secrets for test vs dev, or want protection rules.

**Setup required:**
1. Create an Environment called "test"
2. Add secrets to that environment
3. Update workflow to reference the environment

**Not recommended for now** because:
- More complex setup
- Requires workflow changes
- Your current setup uses repository secrets

---

## Quick Check: Verify Secrets Exist

1. Go to: **Settings** → **Secrets and variables** → **Actions**
2. Look at **Repository secrets** section
3. Verify all the `*_DEV` secrets listed above exist

**If they all exist:** ✅ You're ready to deploy!

**If any are missing:** Add them as Repository secrets.

---

## How the Workflow Uses Secrets

The workflow file uses secrets like this:
```yaml
key: ${{ secrets.ANSIBLE_PRIVATE_SSH_KEY_DEV }}
```

This automatically pulls from **Repository secrets**. No additional configuration needed!

---

## Summary

✅ **Use Repository secrets** - They're already set up and the workflow is configured for them  
❌ **Don't use Environment secrets** - Would require workflow changes and more setup

Just verify your existing repository secrets are there, and you're good to go!


