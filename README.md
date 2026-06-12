# StageCOMM

A real-time mobile communication app for live production teams. Performers signal technical issues instantly via a button press. Technicians receive blinking alerts on their devices and clear them when resolved.

---

## Project Overview

StageCOMM replaces ad-hoc verbal cues and text messages with a structured, instantaneous alert system built for the pace of live performance. It connects performers and technical crew through a purpose-built mobile interface with real-time WebSocket communication.

---

## Features

- Organisation accounts with secure invite tokens
- Role-based access (Director, Admin, Stage Manager, Technician, Performer)
- Customisable button layouts per organisation
- Real-time alerts via Socket.io — instant blinking indicators on technician devices
- Contextual sub-actions per button (e.g. Feedback, Volume Up, Volume Down)
- Alert clearing with real-time sync across all connected devices
- Group chat per organisation
- Schedule view (show times, call times, notes)
- People directory (team members and roles)
- Slide-in sidebar for account and profile settings

---

## Repository Structure
StageCOMM/
├── client/          # React Native + Expo mobile app
├── server/          # Node.js + Express + Socket.io backend
├── devlog/          # Weekly development log
└── .github/
└── workflows/   # GitHub Actions CI/CD pipeline

---

## Installation Instructions

### Prerequisites
- Node.js v18+
- Expo CLI (`npm install -g expo-cli`)
- MongoDB Atlas account
- Expo Go app on your mobile device (for testing)

### Server

```bash
cd server
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env
npm run dev
```

### Client

```bash
cd client
npm install
npm start
# Scan the QR code with Expo Go
```

---

## Usage

1. Register an account and create an organisation
2. Invite team members via a generated token link
3. An admin builds a layout (sections + buttons) for the production
4. During the show, performers press buttons to fire alerts
5. Technicians see blinking indicators in real time and clear them when resolved
6. Use the chat tab for any freeform communication

---

## Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React Native, Expo (~54) |
| Real-Time | Socket.io |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt |
| Testing | Mocha, Chai, Supertest |
| CI/CD | GitHub Actions |
| Deployment | Render |

---

## Future Improvements

- Push notifications for background alert delivery
- Per-show channel routing for targeted alerts
- Alert history log with timestamps
- Custom role creation by organisation admins
- Tablet-optimised layout for stage manager stations
- Offline resilience with local queuing and sync on reconnect
- Redis adapter for Socket.io horizontal scaling

---

## Development Log

See the [`devlog/`](./devlog) folder for weekly progress updates.

---

## Deployment

Backend deployed on Render: https://stagecomm.onrender.com

frontend deployed on EXPO : https://expo.dev/preview/update?message=remove+broken+console.log&updateRuntimeVersion=1.0.0&createdAt=2026-06-12T04%3A10%3A46.371Z&slug=exp&projectId=4f654b8f-5f47-4a96-9535-f19b83508a8a&group=22659ef4-e3ff-42f4-ac7f-63c6b9ede3b8