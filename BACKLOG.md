# Gifalot Backlog

## Future Features & Improvements

### Domain Structure & Routing

#### Multi-Domain Setup with Clean URLs
**Status:** Backlog  
**Priority:** High  
**Description:** Set up domain structure with `gifalot.com` for public content and `app.gifalot.com` for the main application, with support for clean/short URLs for public players.

**Target Architecture:**
- `gifalot.com` → Public site (homepage, about, login)
- `gifalot.com/[short-id]` → Public player (short URL)
- `gifalot.com/[custom-name]` → Public player (custom URL)
- `app.gifalot.com` → Main application (dashboard, editor)
- `dev.gifalot.com` → Backend API (already set up)

**Benefits:**
- Clean, shareable URLs for public players (like bit.ly)
- SEO-friendly public content on root domain
- Clear separation: public vs. authenticated app
- Professional domain structure

**Implementation Phases:**
1. **Netlify Domain Configuration** - Add both domains, configure DNS, SSL
2. **React Routing Updates** - Domain detection, route guards, redirects
3. **Custom URL Feature** - Database schema, API endpoints, slug validation
4. **Environment Variables** - Update frontend env vars for new domains

**See:** `DOMAIN_STRUCTURE_SETUP.md` for detailed implementation guide

---

### Template & Display Features

#### Option 4: User-Selectable Fill Mode
**Status:** Backlog  
**Priority:** Medium  
**Description:** Add a toggle option for users to choose between "Fill" and "Fit" modes for template displays.

**Details:**
- **Fill Mode**: Uses `object-fit: cover` - items fill the entire space, may crop edges
- **Fit Mode**: Uses `object-fit: contain` - items maintain full visibility, may show space around edges
- Could be a global setting or per-item setting
- Useful for users who want to see full content vs. users who want screen-filling displays

**Implementation Notes:**
- Add toggle/switch in item card settings or compilation settings
- Store preference in item metadata or user preferences
- Apply `object-fit: cover` or `object-fit: contain` based on selection
- Consider adding visual preview of the difference

---

## Completed Features

- ✅ Template system with 1up, 2next, 4next, 2up, 4up
- ✅ Duplicate functionality
- ✅ Fill mode with aspect ratio awareness (Option 2)




