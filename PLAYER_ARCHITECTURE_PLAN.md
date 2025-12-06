# Player Architecture Plan

## Overview
Unified standalone player architecture that handles both public and private compilations, with smart modal behavior based on authentication status.

## Current State

### Existing Routes
- **Public Player**: `/:userId/:folderId/carousel` - PublicCarousel component
- **Private Overlay Player**: `/dashboard/:folder/carousel` - InnerCarouser component (overlay)
- **Private Standalone Player**: `/player/:folder` - InnerCarouser component (standalone)

### Current Issues
- Two separate player components (PublicCarousel and InnerCarouser) with duplicate logic
- Overlay player requires dashboard layout
- Modal behavior differs between public and private players

## Proposed Architecture

### Routes
1. **Public Player**: `/:userId/:folderId/carousel`
   - No authentication required
   - Accessible to anyone with the URL
   - Uses public API endpoints

2. **Private Player**: `/player/:folderId`
   - Requires authentication (PrivateRoute)
   - Standalone (no dashboard layout)
   - Uses authenticated API endpoints

3. **Deprecate**: `/dashboard/:folder/carousel`
   - Keep for backward compatibility initially
   - Redirect to `/player/:folderId` or show deprecation notice

### Unified Player Component

Create a single `Player` component that:
- Detects if it's public or private based on route params
- Handles data fetching for both scenarios
- Uses the same rendering logic for both
- Shows appropriate modal based on auth status

### Unified Modal Component

Create a `PlayerModal` component that:
- **If user is logged in**:
  - Shows "Go to Dashboard" button
  - Points to: `/dashboard/:folderId`
  
- **If user is NOT logged in**:
  - Shows "Sign In" button → points to `/` (login page)
  - Shows "Create Account" button → points to `/registration`
  - Optional: "Learn More" → points to front page (if exists)

### Implementation Steps

1. **Create Unified Player Component**
   - Merge PublicCarousel and InnerCarouser logic
   - Detect public vs private from route params
   - Handle both public and authenticated API calls

2. **Create Unified Modal Component**
   - Check authentication status
   - Show appropriate buttons based on auth
   - Handle navigation to dashboard/login/registration

3. **Update Routes**
   - Keep public route: `/:userId/:folderId/carousel`
   - Keep private route: `/player/:folderId`
   - Optionally deprecate overlay route

4. **Update Navigation**
   - Change dashboard play button to navigate to `/player/:folderId`
   - Update any other references to use standalone player

5. **Update API Calls**
   - Public: Use `apiUrl` with userId/folderId
   - Private: Use `axiosInstance` (authenticated) with folderId only

## Benefits

1. **Single Source of Truth**: One player component for all scenarios
2. **Consistent UX**: Same experience whether public or private
3. **Better Sharing**: Public URLs work independently
4. **Cleaner Architecture**: No overlay complexity
5. **Easier Maintenance**: Less duplicate code

## Migration Strategy

1. Create unified components alongside existing ones
2. Update routes to use unified player
3. Test both public and private scenarios
4. Remove old components once verified
5. Update documentation

## Files to Create/Modify

### New Files
- `src/pages/player/index.jsx` - Unified player component
- `src/pages/player/components/playerModal/index.jsx` - Unified modal
- `src/pages/player/components/playerModal/style.css` - Modal styles

### Files to Modify
- `src/router/index.js` - Update routes
- `src/static/routes.js` - Add/update route definitions
- `src/pages/dashboard/components/folderItem/index.jsx` - Update play button navigation
- Any other components that navigate to carousel

### Files to Deprecate (eventually)
- `src/pages/publicCarousel/index.jsx` - Merge into unified player
- `src/pages/dashboard/carousel/innerCarouser.jsx` - Merge into unified player
- `src/pages/dashboard/carousel/components/carouselModal/index.jsx` - Replace with unified modal

## Questions to Consider

1. Should we keep the overlay route for backward compatibility?
2. What should the "front page" URL be for non-logged-in users?
3. Should the modal auto-close when user logs in?
4. Do we need different styling for public vs private players?



