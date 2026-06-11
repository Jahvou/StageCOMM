# Devlog — Week 2

## What I built

**Frontend foundation**
Initialized the React Native + Expo (SDK 54) client inside the monorepo.
Set up bottom tab navigation using React Navigation with Ionicons for tab icons.
Built an AuthContext using React Context and AsyncStorage to persist login sessions
across app restarts.

**Authentication screens**
Built Login and Register screens with form validation, loading states, and error alerts.
Connected both screens to the backend via fetch, storing the JWT token and user data
in AsyncStorage on success.

**Production screen — core feature**
Built the main alert screen with a default layout (Mics, IEMs, Monitors).
Integrated Socket.io on the client via a useAlerts hook that connects to the org room,
listens for new_alert and alert_cleared events, and maintains active alert state.
Pressing a button opens an action modal (Feedback, Volume Up, Volume Down, etc.).
Selecting an action emits a send_alert event to the server which broadcasts to all
connected org members instantly.
Active buttons turn red with a sharp blinking animation built using setInterval.
Pressing an active button clears the alert and broadcasts alert_cleared to all devices.

**Chat screen**
Built a real-time group chat screen using Socket.io.
Messages are stored in MongoDB and loaded on connect via get_messages.
New messages appear instantly via new_message events.
Outgoing messages appear on the right in purple, incoming on the left in dark grey.
Keyboard avoidance and dismiss on tap outside implemented.

**People screen**
Fetches org members from the API and displays name, email, and role.
Each role has a distinct colour badge (Director gold, Admin red, Stage Manager purple,
Technician blue, Performer green).

**Schedule screen**
Full CRUD schedule manager backed by the API.
Multiple named schedules per org, switchable via a horizontal tab bar.
Items can be added, edited (tap), and deleted (long press).
Schedules persist across sessions via MongoDB.
Keyboard avoidance and dismiss implemented in all modals.

---

## Challenges and how I solved them

**Expo SDK version mismatch**
create-expo-app generated an SDK 56 project but Expo Go on my iPhone only supports SDK 54.
Resolved by deleting the folder and recreating with the blank template which offered SDK 54.

**Socket not connecting (red dot)**
The user object stored in AsyncStorage was missing the org field because the login
response wasn't returning it. Fixed by adding org: user.org to the auth controller
response. Also discovered the BASE_URL in api.js had a typo in the IP address (192.168.2.100
instead of 192.168.2.20) which was silently preventing all API calls from working.

**Blinking animation instability**
First attempt used Animated from React Native with opacity toggling, which caused
unsteady blinking and invisible text when cleared. Replaced with a setInterval approach
that toggles a boolean state between true and false, switching button styles directly.
This produced a sharp, reliable blink with no side effects.

**API requests hanging silently**
axios calls were timing out without any error output because the BASE_URL IP was wrong.
Added a timeout to axios and temporarily replaced calls with plain fetch to isolate
the issue. The fetch confirmed the network was reachable — the IP typo was the only problem.

**Windows path length error when deleting node_modules**
Attempting to delete the client folder via PowerShell failed due to deeply nested
file paths exceeding Windows path length limits. Resolved by deleting through VS Code's
Explorer panel instead.

---

## Key learnings

- AsyncStorage persists data across sessions but the stored data must include all fields
  the app needs — missing org in the user object caused hours of debugging
- Socket.io connection issues are often silent — adding console.log to useAlerts early
  would have saved time
- setInterval is more reliable than Animated loops for sharp on/off UI effects
- Keyboard avoidance in React Native requires both KeyboardAvoidingView and
  TouchableWithoutFeedback wrapping the modal content, with KeyboardAvoidingView
  as the outermost element inside the Modal
- IP addresses in development constants must be verified every session if the network changes

---

## Next steps

- Final cleanup and code review
- Update README with final feature list
- Prepare for submission