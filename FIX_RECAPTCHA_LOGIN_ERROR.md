# Fix reCAPTCHA Login Error

## Problem
Login fails with error: "The response parameter is invalid or malformed" (400 Bad Request)

This is a reCAPTCHA validation error. The backend is trying to validate a reCAPTCHA token even though login has reCAPTCHA disabled.

## Root Cause
1. Frontend was sending an empty reCAPTCHA token (`""`) in the header
2. Backend reCAPTCHA module was trying to validate the empty token
3. Google reCAPTCHA API rejected it with "invalid or malformed" error

## Solution Applied

### Frontend Fix (Already Done)
- Updated `userSlice.js` to only send reCAPTCHA header if token is present and not empty
- Login endpoint doesn't require reCAPTCHA, so we don't send the header

### Backend Verification Needed

**Check if the deployed backend has reCAPTCHA disabled for login:**

1. SSH into your VPS:
   ```bash
   ssh root@38.242.204.63
   ```

2. Navigate to backend directory:
   ```bash
   cd /home/ansible/services/dev/gif-j-backend
   ```

3. Check the auth controller:
   ```bash
   cat src/modules/auth/auth.controller.ts | grep -A 5 "login"
   ```

4. Verify the `@Recaptcha` decorator is commented out:
   ```typescript
   // @Recaptcha({ action: 'login' }) // Temporarily disabled for debugging
   @Post('login')
   ```

5. If it's NOT commented out, you need to:
   - Pull latest code: `git pull origin dev`
   - Rebuild container: `docker compose up -d --build app`
   - Restart: `docker compose restart app`

## Alternative: Disable reCAPTCHA Globally for Login

If the backend is still validating reCAPTCHA, you can update the reCAPTCHA module configuration to exclude login:

Edit `gif-j-backend/src/app.module.ts`:

```typescript
GoogleRecaptchaModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    secretKey: configService.get<string>('GOOGLE_RECAPTCHA_SECRET_KEY'),
    response: (req) => req.headers['recaptcha'],
    actions: ['register'], // Remove 'login' from here
    skipIf: process.env.STAGE === 'local',
    score: 0.6,
  }),
}),
```

Then rebuild and restart the backend.

## Testing

After applying the fix:

1. Clear browser cache
2. Try logging in
3. Should work without reCAPTCHA validation error

## If Still Failing

If login still fails after the frontend fix:

1. Check backend logs:
   ```bash
   docker compose logs app --tail 50
   ```

2. Look for reCAPTCHA-related errors

3. Verify the backend code is up to date:
   ```bash
   cd /home/ansible/services/dev/gif-j-backend
   git status
   git pull origin dev
   docker compose up -d --build app
   ```




