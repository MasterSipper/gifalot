# GitHub Secrets Mapping - Values Found

## ✅ Values You Found - Add These to GitHub Secrets

Here's the mapping from your .env file to GitHub secret names:

---

## Database Secrets (MySQL)

- **Name:** `POSTGRES_HOST_DEV`  
  **Secret:** `mysql96.unoeuro.com`  
  ⚠️ Note: Your .env says MYSQL, but the workflow uses POSTGRES. Use the MySQL host value.

- **Name:** `POSTGRES_DB_DEV`  
  **Secret:** `gifalot_com_db`

- **Name:** `POSTGRES_USER_DEV`  
  **Secret:** `gifalot_com`

- **Name:** `POSTGRES_PASSWORD_DEV`  
  **Secret:** `z6paFtf9D5Eryh4cdwgb`

---

## Redis Secrets

- **Name:** `REDIS_HOST_DEV`  
  **Secret:** `redis`  
  ⚠️ Note: Your .env says `redis` (Docker service name). For deployment, this might need to be the actual host. Check your docker-compose setup.

- **Name:** `REDIS_PASSWORD_DEV`  
  **Secret:** `mystic-cheese-swindler-moto`

---

## JWT Secrets

- **Name:** `JWT_ACCESS_TOKEN_SECRET_DEV`  
  **Secret:** `test_KEY`

- **Name:** `JWT_REFRESH_TOKEN_SECRET_DEV`  
  **Secret:** `test_KEY1`

---

## API Keys

- **Name:** `GIPHY_API_KEY_DEV`  
  **Secret:** `s3k2WSBRVKYkCsTL60x7ow79geR9aCSq`

- **Name:** `GOOGLE_RECAPTCHA_SECRET_KEY_DEV`  
  **Secret:** `placeholder-key-for-dev`  
  ⚠️ Note: This is a placeholder - you can update it later with a real key.

---

## Still Need to Find

### AWS/S3 Keys
Check docker-compose.yml:
```bash
cat docker-compose.yml | grep -A 80 "environment:" | grep -E "AWS_ACCESS_KEY_ID|AWS_SECRET"
```

Or check your Contabo/AWS account for S3 credentials.

- **Name:** `AWS_ACCESS_KEY_ID_DEV`  
  **Secret:** (need to find)

- **Name:** `AWS_SECRET_ACCESS_KEY_SECRET_DEV`  
  **Secret:** (need to find)

### Mail (Optional - Can Leave Empty)
- **Name:** `MAIL_USER_DEV`  
  **Secret:** (leave empty or add your email)

- **Name:** `MAIL_PASSWORD_DEV`  
  **Secret:** (leave empty or add your email password)

---

## Quick Checklist

Add these to GitHub secrets:

### ✅ You Have These:
- [ ] `POSTGRES_HOST_DEV` = `mysql96.unoeuro.com`
- [ ] `POSTGRES_DB_DEV` = `gifalot_com_db`
- [ ] `POSTGRES_USER_DEV` = `gifalot_com`
- [ ] `POSTGRES_PASSWORD_DEV` = `z6paFtf9D5Eryh4cdwgb`
- [ ] `REDIS_HOST_DEV` = `redis`
- [ ] `REDIS_PASSWORD_DEV` = `mystic-cheese-swindler-moto`
- [ ] `JWT_ACCESS_TOKEN_SECRET_DEV` = `test_KEY`
- [ ] `JWT_REFRESH_TOKEN_SECRET_DEV` = `test_KEY1`
- [ ] `GIPHY_API_KEY_DEV` = `s3k2WSBRVKYkCsTL60x7ow79geR9aCSq`
- [ ] `GOOGLE_RECAPTCHA_SECRET_KEY_DEV` = `placeholder-key-for-dev`

### ❓ Still Need:
- [ ] `AWS_ACCESS_KEY_ID_DEV` = (check docker-compose.yml)
- [ ] `AWS_SECRET_ACCESS_KEY_SECRET_DEV` = (check docker-compose.yml)
- [ ] `MAIL_USER_DEV` = (optional - can leave empty)
- [ ] `MAIL_PASSWORD_DEV` = (optional - can leave empty)

### 🔑 Connection Secrets (From Earlier):
- [ ] `ANSIBLE_HOST_VPS1_DEV` = `38.242.204.63`
- [ ] `ANSIBLE_PORT_DEV` = `2049`
- [ ] `ANSIBLE_PRIVATE_SSH_KEY_DEV` = (your SSH key)
- [ ] `ANSIBLE_PASSWORD_DEV` = (your password, if needed)

---

## Next Step: Find AWS Keys

Run this to find AWS keys:

```bash
cat docker-compose.yml | grep -A 80 "environment:" | grep -E "AWS"
```

Or check the full environment section:
```bash
cat docker-compose.yml | grep -A 100 "environment:"
```

---

## Important Notes

1. **MySQL vs PostgreSQL**: Your .env uses MySQL, but the workflow uses POSTGRES variable names. Use the MySQL values you found, but the secret names should be `POSTGRES_*` (the workflow will handle the mapping).

2. **REDIS_HOST**: Your .env says `redis` (Docker service name). For the deployment, this might work if it's the same Docker network, or you might need `localhost`. Try `redis` first.

3. **JWT Secrets**: You have `test_KEY` and `test_KEY1`. These work, but you might want to generate stronger ones later for production.

4. **AWS Keys**: These are required for file uploads. Check docker-compose.yml or your Contabo/AWS account.

---

## Summary

You've found most of the values! Add the 10 secrets listed above, then find the AWS keys, and you'll be ready to deploy!

