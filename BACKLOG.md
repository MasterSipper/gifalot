# Gifalot Backlog

## Future Features & Improvements

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



