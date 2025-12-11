# Domain Structure Setup Guide

## Target Architecture

```
gifalot.com                    → Public site (homepage, about, login)
gifalot.com/[short-id]         → Public player (short URL)
gifalot.com/[custom-name]      → Public player (custom URL)
app.gifalot.com                → Main application (dashboard, editor)
dev.gifalot.com                → Backend API (already set up)
```

## Benefits

- ✅ Clean, shareable URLs for public players
- ✅ SEO-friendly public content on root domain
- ✅ Clear separation: public vs. authenticated app
- ✅ Professional structure

## Implementation Steps

### Phase 1: Netlify Domain Configuration

1. **Add Custom Domains in Netlify**
   - Go to Netlify Dashboard → Your Site → Domain settings
   - Add `gifalot.com` as primary domain
   - Add `app.gifalot.com` as additional domain
   - Both point to the same Netlify site

2. **DNS Configuration**
   - In your domain registrar, add DNS records:
     ```
     # Root domain (gifalot.com)
     Type: CNAME
     Name: @ (or gifalot.com)
     Value: [your-site-name].netlify.app
     
     # App subdomain
     Type: CNAME
     Name: app
     Value: [your-site-name].netlify.app
     
     # www subdomain (optional)
     Type: CNAME
     Name: www
     Value: [your-site-name].netlify.app
     ```

3. **SSL Certificates**
   - Netlify automatically provisions SSL certificates for both domains
   - Wait for DNS propagation (usually 5-30 minutes)

### Phase 2: React Routing Updates

1. **Domain Detection Logic**
   - Create a utility to detect current domain
   - Route users based on domain

2. **Route Structure**
   ```javascript
   // gifalot.com routes
   /                    → Homepage
   /about               → About page
   /login               → Login page
   /[userId]/[folderId]/carousel  → Public player (existing)
   /[custom-slug]       → Public player (custom URL - new)
   
   // app.gifalot.com routes
   /dashboard           → Main dashboard
   /dashboard/[folderId] → Collection editor
   /settings            → User settings
   ```

3. **Redirect Logic**
   - After login: redirect to `app.gifalot.com/dashboard`
   - Public routes stay on `gifalot.com`
   - App routes redirect to `app.gifalot.com` if accessed from root domain

### Phase 3: Custom URL Feature (Optional)

1. **Database Schema**
   - Add `customSlug` field to Collection entity
   - Add unique constraint on `customSlug`
   - Add validation (alphanumeric, hyphens, lowercase)

2. **Backend API**
   - Add endpoint: `GET /collection/slug/:customSlug`
   - Returns collection by custom slug
   - Falls back to ID-based lookup if slug not found

3. **Frontend Routing**
   - Add route: `/gifalot.com/:slug`
   - Check if slug is custom URL or ID-based
   - Load appropriate collection

### Phase 4: Environment Variables

Update frontend environment variables:

```env
# Netlify environment variables
REACT_APP_PUBLIC_URL=https://gifalot.com
REACT_APP_APP_URL=https://app.gifalot.com
REACT_APP_API_URL=https://dev.gifalot.com/gif-j/
```

## Code Changes Required

### 1. Domain Detection Utility

Create `src/utils/domainUtils.js`:

```javascript
export const getDomainType = () => {
  const hostname = window.location.hostname;
  
  if (hostname === 'app.gifalot.com') {
    return 'app';
  }
  if (hostname === 'gifalot.com' || hostname === 'www.gifalot.com') {
    return 'public';
  }
  return 'unknown';
};

export const redirectToApp = (path = '/dashboard') => {
  window.location.href = `https://app.gifalot.com${path}`;
};

export const redirectToPublic = (path = '/') => {
  window.location.href = `https://gifalot.com${path}`;
};
```

### 2. Route Guard Component

Create `src/components/AppRouteGuard.jsx`:

```javascript
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDomainType, redirectToApp } from '../utils/domainUtils';

export const AppRouteGuard = ({ children }) => {
  const domainType = getDomainType();
  const navigate = useNavigate();

  useEffect(() => {
    if (domainType === 'public') {
      // Redirect app routes to app subdomain
      redirectToApp(window.location.pathname);
    }
  }, [domainType]);

  if (domainType !== 'app') {
    return null; // Will redirect
  }

  return children;
};
```

### 3. Update App Router

Modify `src/App.jsx` or router configuration:

```javascript
import { getDomainType } from './utils/domainUtils';
import { AppRouteGuard } from './components/AppRouteGuard';

// In your router
const domainType = getDomainType();

{domainType === 'app' && (
  <AppRouteGuard>
    <Route path="/dashboard" element={<Dashboard />} />
    {/* Other app routes */}
  </AppRouteGuard>
)}

{domainType === 'public' && (
  <>
    <Route path="/" element={<Homepage />} />
    <Route path="/about" element={<About />} />
    <Route path="/login" element={<Login />} />
    <Route path="/:slug" element={<PublicPlayer />} />
    <Route path="/:userId/:folderId/carousel" element={<PublicPlayer />} />
  </>
)}
```

### 4. Update Login Redirect

In `userSlice.js` or login component:

```javascript
// After successful login
import { redirectToApp } from '../utils/domainUtils';

// In login success handler
redirectToApp('/dashboard');
```

## Testing Checklist

- [ ] `gifalot.com` shows homepage
- [ ] `gifalot.com/about` shows about page
- [ ] `gifalot.com/login` shows login page
- [ ] `gifalot.com/[id]/[folderId]/carousel` shows public player
- [ ] `app.gifalot.com/dashboard` shows dashboard (requires login)
- [ ] Login redirects to `app.gifalot.com/dashboard`
- [ ] Accessing app routes from root domain redirects to subdomain
- [ ] SSL certificates work on both domains
- [ ] All links use correct domain

## Migration Notes

- Existing public player URLs will continue to work
- Users will be redirected to app subdomain after login
- No breaking changes for existing users
- Custom URLs are optional enhancement

## Future Enhancements

- Custom slug generation/validation UI
- Slug availability checking
- Analytics for public vs. app usage
- A/B testing different domain structures




