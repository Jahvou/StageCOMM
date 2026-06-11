# Devlog — Week 1

## What I built
Set up the full backend foundation for StageCOMM from scratch.

**Server scaffold**
Initialized the monorepo structure with separate `client/` and `server/` folders.
Set up Node.js + Express, connected to MongoDB Atlas, and initialized Socket.io.
Confirmed the server runs and responds to a health check endpoint.

**Authentication**
Built user registration and login using JWT and bcrypt.
Created the User model with role-based fields (director, admin, stage_manager, technician, performer).
Added auth middleware to protect routes using Bearer tokens.
Tested both endpoints successfully in Postman.

**Organisation system**
Built the Org model with support for members and invite tokens.
Implemented create org, generate invite token (24hr expiry), join org via token, and get org endpoints.
Tested the full invite flow in Postman with two separate user accounts.

**Layout builder**
Built the Layout model with nested sections, buttons, and actions.
Implemented full CRUD (create, read, update, delete) for layouts.
Tested creating a layout with Mics and IEMs sections in Postman.

**Real-time alerts**
Integrated Socket.io for instantaneous alert delivery.
Built the Alert model and socket event handlers for send_alert, clear_alert, and get_active_alerts.
Alerts are scoped to organisation rooms so only the right team receives them.
Tested the full alert loop in Postman's Socket.io client — alert fired and cleared in real time.

**Testing**
Set up Mocha and Chai with Supertest for API testing.
Wrote 4 unit tests covering register, duplicate email rejection, login, and invalid credentials.
All 4 tests passing.

---

## Challenges and how I solved them

**Credentials exposed on GitHub**
Early in the project I accidentally pushed my `.env` file before the `.gitignore` was set up.
I resolved this by immediately rotating the MongoDB password, running `git rm --cached server/.env`,
updating the `.gitignore`, and force-pushing a clean history.
Lesson learned: always set up `.gitignore` before the first commit.

**Windows case-sensitive filename bug**
Node.js couldn't find `authController.js` because the file was saved as `authcontroller.js`.
Windows file explorer doesn't register case-only renames, so I had to use the terminal:
`ren src\controllers\authcontroller.js authController.js`

**Template literals written as regular strings**
Several console.log lines used backtick template literals like `\`Connected: ${socket.id}\``
but were entered with single quotes, causing the variable names to print literally instead of
their values. Fixed by switching to comma-separated console.log calls.

**MONGO_URI typo in test file**
The test file referenced `process.env.MONGODB_URI` instead of `process.env.MONGO_URI`,
causing mongoose to receive undefined. Fixed by matching the exact variable name in `.env`.

---

## Key learnings

- `.gitignore` must be populated before the first commit, not after
- Windows is case insensitive for filenames but Node.js module resolution is not
- Template literals require backticks, not single or double quotes
- Socket.io rooms are the right abstraction for org-scoped real time events
- Separating the Express app into `app.js` and the server into `index.js` is necessary
  for Supertest to work correctly in tests

---

## Next steps

- Set up deployment to Render
- Begin frontend development in React Native + Expo
- Build the production screen (performer alert UI)
- Build the technician alert receive and clear UI