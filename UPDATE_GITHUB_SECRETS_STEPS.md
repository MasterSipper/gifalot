# How to Update GitHub Secrets

## Step-by-Step Instructions

### 1. Go to Your Repository on GitHub
- Open: `https://github.com/MasterSipper/gifalot`

### 2. Navigate to Settings
- Click on the **"Settings"** tab (at the top of the repository page)
- It's the rightmost tab in the navigation bar

### 3. Go to Secrets and Variables
- In the left sidebar, look for **"Secrets and variables"**
- Click on it to expand
- Click on **"Actions"** (under "Secrets and variables")

### 4. View/Add Secrets
- You'll see a list of existing secrets
- To add a new secret:
  - Click the **"New repository secret"** button (top right)
  - Enter the **Name** (e.g., `MYSQL_HOST_DEV`)
  - Enter the **Secret** (the actual value)
  - Click **"Add secret"**

### 5. Update Existing Secrets
- Find the secret in the list
- Click on it
- Click **"Update"** button
- Enter the new value
- Click **"Update secret"**

### 6. Delete Old Secrets (Optional)
- If you have old `POSTGRES_*_DEV` secrets you want to remove:
  - Click on the secret
  - Click **"Delete"** button
  - Confirm deletion

## MySQL Secrets to Add

Add these 5 secrets (all with `_DEV` suffix):

1. **Name:** `MYSQL_HOST_DEV`
   - **Value:** Your MySQL host (e.g., `mysql96.unoeuro.com`)

2. **Name:** `MYSQL_DB_DEV`
   - **Value:** Your MySQL database name (e.g., `gifalot_com_db`)

3. **Name:** `MYSQL_USER_DEV`
   - **Value:** Your MySQL username (e.g., `gifalot_com`)

4. **Name:** `MYSQL_PASSWORD_DEV`
   - **Value:** Your MySQL password

5. **Name:** `MYSQL_PORT_DEV`
   - **Value:** Your MySQL port (usually `3306`)

## Quick Navigation Path

```
GitHub Repository
  → Settings (top tab)
    → Secrets and variables (left sidebar)
      → Actions
        → New repository secret (button)
```

## Finding Your MySQL Values

If you have existing `POSTGRES_*_DEV` secrets, they likely have the same values (just different names). You can:
1. View the old `POSTGRES_*_DEV` secrets to get the values
2. Create new `MYSQL_*_DEV` secrets with those same values
3. Delete the old `POSTGRES_*_DEV` secrets (optional)

## Alternative: Direct URL

You can also go directly to:
`https://github.com/MasterSipper/gifalot/settings/secrets/actions`

