# Devlog — Week 3

## What I built

**Layout Builder**
Built a full layout management system connected to the backend API.
Admins can create named layouts, add sections with custom names, add buttons
with custom labels, and define up to 3 alert options per button.
Buttons and sections can be edited (tap) and deleted (long press).
A Default layout is always available as a fallback and cannot be edited or deleted.
Each layout has a Launch button that sets it as active and navigates directly
to the Production screen.

**Production screen — layout integration**
The Production screen now loads the active layout from the database on every focus.
If no custom layout is active, it falls back to the hardcoded default layout.
Switching layouts via the Layout tab updates the Production screen instantly.

**Schedule screen — full persistence**
Rebuilt the Schedule screen to use the backend API instead of local state.
Multiple named schedules per org, each with add, edit, and delete for items.
All data persists across sessions via MongoDB.

**People screen**
Displays all org members with name, email, and colour-coded role badges.
Fetches live from the API on every load.

**Chat screen**
Real-time group chat using Socket.io.
Messages persist in MongoDB and load on connect.
Keyboard avoidance and tap-to-dismiss implemented.

---

## Challenges and how I solved them

**Layout not switching on Production screen**
The Production screen was loading the layout once on mount and never refreshing.
Replaced useEffect with useFocusEffect from React Navigation so the layout
reloads every time the tab comes into focus.

**LAyout typo in controller**
A capital A typo in layoutController.js (LAyout instead of Layout) caused all
GET requests to layouts to return a server error. Found it using PowerShell's
Select-String command since grep is not available on Windows.

**layout.otg typo in controller**
A similar typo in the deleteLayout function (layout.otg instead of layout.org)
was causing authorization checks to fail silently.

**Default layout as a non-destructive option**
The default layout needed to always be available without being stored in the
database. Solved by prepending a hardcoded DEFAULT_LAYOUT_OPTION object to
the layouts array on load, with a special _id of 'default' that is checked
before any API calls to prevent accidental writes or deletes.

---

## Key learnings

- useFocusEffect is the correct hook for data that needs to reload when
  navigating back to a screen — useEffect only fires on mount
- Typos in model names (LAyout, layout.otg) are silent until a specific
  route is called — always test every endpoint after writing a controller
- Keeping a non-database option (the default layout) in the same list as
  database items requires a consistent guard (_id === 'default') throughout
  all functions that make API calls
- PowerShell uses Select-String instead of grep for searching file contents

---

## Next steps

- Organisation creation during registration
- Email invite system for org members
- Push notifications for background alert delivery
- Per-show alert channel routing
- Alert history log with timestamps