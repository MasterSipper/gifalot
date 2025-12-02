# Authentication Disabled (Development Mode)

Authentication has been temporarily disabled for development purposes.

## Frontend Changes

The following files have been modified to bypass authentication:

1. **`gif-j-react/src/router/privateRoute/index.jsx`**
   - Added `DISABLE_AUTH` flag (set to `true`)
   - Bypasses authentication check when enabled

2. **`gif-j-react/src/store/slices/userSlice.js`**
   - Added `DISABLE_AUTH` flag (set to `true`)
   - Initializes with mock user: `{ id: 1, email: "dev@example.com" }`

3. **`gif-j-react/src/router/RememberMe/index.jsx`**
   - Added `DISABLE_AUTH` flag (set to `true`)
   - Bypasses login redirect when enabled

## Backend Changes

The following files have been modified to bypass authentication:

1. **`gif-j-backend/src/modules/auth/auth.guard.ts`**
   - `OptionalJwtAccessAuthGuard` and `DevelopmentAuthGuard` now bypass auth when `DISABLE_AUTH` is true
   - Returns mock user: `{ id: 1, email: 'dev@example.com', sessionId: 'dev-session' }`

2. **`gif-j-backend/src/modules/auth/strategies/access.strategy.ts`**
   - Modified to return mock user when `DISABLE_AUTH` is true or when `STAGE=local`
   - Ignores JWT expiration in development mode

## How to Re-enable Authentication

### Frontend

1. Open `gif-j-react/src/router/privateRoute/index.jsx`
   - Set `DISABLE_AUTH = false`

2. Open `gif-j-react/src/store/slices/userSlice.js`
   - Set `DISABLE_AUTH = false`

3. Open `gif-j-react/src/router/RememberMe/index.jsx`
   - Set `DISABLE_AUTH = false`

### Backend

1. Set environment variable `DISABLE_AUTH=false` in your `.env` file
   OR
   Set `STAGE=production` (or any value other than `local`)

2. The guards and strategies will automatically re-enable authentication checks

## Current Behavior

- **Frontend**: All routes are accessible without login
- **Backend**: All protected routes accept requests without authentication
- **Mock User**: `{ id: 1, email: "dev@example.com" }` is used throughout the app

## Notes

- This is a temporary development setup
- Authentication should be re-enabled before production deployment
- All changes are marked with `TODO: Re-enable authentication when ready` comments











