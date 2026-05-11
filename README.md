# JobLinkr

JobLinkr is a Next.js job search and matchmaking application built with Firebase authentication, AI-powered resume analysis, and a modern Tailwind UI.

## Features

- Next.js 16 + React 19 application using the App Router
- Firebase authentication using email/password through NextAuth
- Employer and job seeker flows with saved jobs and profile pages
- Job search and application routes
- AI resume analysis and job matching via Google Gemini
- Fully componentized UI with Tailwind CSS and Radix UI primitives

## Technologies

- Next.js
- React
- Tailwind CSS
- Firebase Auth + Firestore Lite
- NextAuth
- Google Gemini generative AI
- TypeScript
- Radix UI
- Recharts
- React Hook Form

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm

### Install dependencies

```bash
npm install
```

### Run development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

### Build for production

```bash
npm run build
```

### Start production server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

### Clean build artifacts

```bash
npm run clean
```

## Environment

The project currently uses a hard-coded Firebase config in `lib/firebase.ts`. If you want to use your own Firebase project, replace the values there.

Recommended environment variables:

- `GOOGLE_GEMINI_API_KEY` - API key for Google Gemini resume analysis
- `NEXTAUTH_SECRET` - optional secret for NextAuth session signing

## Project Structure

- `app/` - Next.js routes and pages
- `components/` - reusable UI components and application widgets
- `lib/` - Firebase setup, auth options, AI helpers, utilities
- `hooks/` - custom React hooks
- `styles/` - global CSS
- `types/` - TypeScript type definitions

## Authentication

Authentication is handled by NextAuth with a CredentialsProvider backed by Firebase Auth. Users sign in using email and password, and sessions are managed as JWTs.

## AI Resume Analysis

The resume analyzer endpoint is implemented at `app/api/analyze-resume/route.ts` and uses `lib/gemini.ts` to call Google Gemini models.

## Notes

- The Firebase configuration in `lib/firebase.ts` is currently configured for the existing `joblinkr-dfc2e` project.
- For production use, verify the Firebase settings and secure any API keys.

## License

This project is released under the ISC License.
