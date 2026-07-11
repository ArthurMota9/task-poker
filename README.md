# Task Poker

Real-time planning poker for dev teams. Estimate story points together, live — no account required.

🔗 **[task-poker.com](https://task-poker.com/en)**

[![CI](https://github.com/ArthurMota9/task-poker/actions/workflows/ci.yml/badge.svg)](https://github.com/ArthurMota9/task-poker/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Features

- **Real-time sessions** — votes sync instantly across every participant
- **No sign-up** — anonymous auth, just enter a name
- **Voting sequences** — Fibonacci, T-Shirt sizes, Powers of 2
- **Hidden votes** — revealed only when the host decides; the team can revote after discussion
- **Live average** — recalculated automatically on every reveal/revote
- **Collaborative mode** — optionally let any participant control the session
- **History** — completed tasks are logged with their average and individual votes
- **Picture-in-Picture** — keep voting while browsing other tabs (Chrome 116+)
- **Consensus celebration** — confetti and a surprise message when the whole team agrees on the first reveal
- **Internationalization** — English, Portuguese, and Spanish
- **Light / dark theme**

## Tech stack

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Realtime | Firebase Firestore |
| Auth | Firebase Anonymous Authentication |
| i18n | next-intl |
| Theme | next-themes |
| Testing | Jest, React Testing Library |
| Deploy | Heroku |

## Getting started

### Prerequisites

- Node.js 24.x
- A [Firebase](https://firebase.google.com/) project with **Firestore** and **Anonymous Authentication** enabled

### Setup

```bash
git clone https://github.com/ArthurMota9/task-poker.git
cd task-poker
npm install
```

Copy `.env.example` to `.env.local` and fill in your Firebase project credentials:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

Deploy the Firestore security rules and indexes from this repo to your Firebase project:

```bash
firebase deploy --only firestore
```

Run the dev server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Lint the codebase |
| `npm test` | Run the test suite |
| `npm run test:watch` | Run tests in watch mode |

## Contributing

Issues and pull requests are welcome. Please open an issue first to discuss significant changes.

## License

Licensed under the [MIT License](LICENSE).
