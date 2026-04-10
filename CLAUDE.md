# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Frontend** (run from `client/`):
```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run lint      # ESLint
```

**Backend** (run from `server/`):
```bash
npm run dev       # Start Express server with nodemon (port 4000)
npm start         # Production start
```

Both must run simultaneously during development.

All commands run from the `client/` directory (legacy note):

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # Production build to dist/
npm run lint      # Run ESLint
npm run preview   # Preview production build locally
```

No test framework is configured. Backend health check: `curl http://localhost:4000/health`

## Backend Architecture (`server/`)

Node.js + Express + Firebase Admin SDK + Paystack.

```
server/
├── config/          firebase.js (Admin SDK), paystack.js (Axios instance)
├── middleware/      auth.js (verify Firebase ID token), requireEducator.js
├── controllers/     user, course, enrollment, progress, payment, educator
├── routes/          one file per domain, mirrors controllers
├── services/        firestoreService.js (isEnrolled, enrollUserInCourse, upsertUser, sanitizeCourseForPublic)
│                    paystackService.js (initializeTransaction, verifyTransaction)
└── server.js        entry point — IMPORTANT: express.raw() for /api/payment/webhook must come before express.json()
```

**Auth flow:** Firebase Auth on frontend → ID token sent as `Authorization: Bearer <token>` → `middleware/auth.js` verifies with Firebase Admin SDK → `req.user.uid` set.

**Payment flow:** `POST /api/payment/initialize` → Paystack returns `authorizationUrl` → frontend redirects user → Paystack redirects back with `?reference=xxx` → `GET /api/payment/verify` → `enrollUserInCourse()` called → `POST /api/payment/webhook` handles missed redirects.

**Educator role:** Set `isEducator: true` on the user doc in Firestore manually or via a dedicated onboarding endpoint. All `/api/educator/*` routes check this via `requireEducator` middleware.

**Environment variables:**
- `server/.env` — `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `PAYSTACK_SECRET_KEY`, `PAYSTACK_CALLBACK_URL`, `FRONTEND_URL`
- `client/.env` — `VITE_FIREBASE_*` (6 keys from Firebase Console), `VITE_BACKEND_URL`

## Frontend Architecture

**Lena** is a full-stack LMS built with React 19 + Vite + Tailwind CSS v4 (frontend) and Node.js + Express + Firestore (backend). Firebase Auth handles authentication; Paystack handles per-course payments.

### Dual-Role System

The app has two user roles with separate page trees and component sets:

- **Student** (`pages/student/`, `components/student/`) — browse courses, enroll, watch video content, rate courses
- **Educator** (`pages/educator/`, `components/educator/`) — create/manage courses, view enrolled students, track earnings

### State Management

Global state lives in `client/src/context/AppContex.jsx` (React Context + useState). It holds course data, enrollment state, and ratings. All pages consume this context. There is no external state library.

### Routing

Defined in `client/src/App.jsx` using React Router DOM v7. Student routes are at the root level; educator routes are nested under `/educator` with `Educator.jsx` as the layout wrapper.

### Key Files

| File | Purpose |
|------|---------|
| `src/context/AppContex.jsx` | Global state — courses, enrollments, ratings |
| `src/assets/assets.js` | All mock data + image imports |
| `src/App.jsx` | Route definitions |
| `src/index.css` | Tailwind + custom CSS variables (fonts, spacing, typography scales) |

### Authentication

Clerk (`@clerk/clerk-react`) handles auth. The publishable key is read from `VITE_CLERK_PUBLISHABLE_KEY` in `.env`.

### Rich Text / Video

- Course content editing uses **Quill** (rich text editor)
- Course video playback uses **react-youtube** (YouTube embeds)

### Currency

The display currency is set via `VITE_CURRENCY` env var (currently `€`).
