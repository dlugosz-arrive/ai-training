# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Web application for registered users to join topic-based communities, connect with each other (mutual friend requests), and participate in group video streams. Built with Next.js 15 App Router, PostgreSQL, NextAuth.js v5, and self-hosted LiveKit.

## Local Development

### Prerequisites
- Node.js 20+, Docker

### Setup
```bash
cp .env.local.example .env.local   # set AUTH_SECRET (openssl rand -base64 32)
docker compose up -d               # PostgreSQL :5432 + LiveKit :7880
npm install
npm run db:push                    # sync schema (no migration history)
npm run dev                        # http://localhost:3000
```

### Commands
- `npm run dev` — dev server
- `npm run build` — production build
- `npm run db:push` — sync Prisma schema to DB (PoC, no migration history)
- `npm run db:migrate` — create a named migration
- `npm run db:studio` — Prisma Studio at :5555
- `npm run lint` — ESLint

## Architecture

### Stack
- **Next.js 15 App Router** — all routes under `src/app/`
- **NextAuth.js v5** — JWT sessions, Credentials provider; config in `src/lib/auth.ts`; handler at `src/app/api/auth/[...nextauth]/route.ts`
- **Prisma + PostgreSQL** — schema at `prisma/schema.prisma`
- **LiveKit** — self-hosted WebRTC (Docker `--dev` mode); token minting in `src/lib/livekit.ts`; UI via `@livekit/components-react`

### Route Groups
- `(auth)` — `/login`, `/register` — no session required
- `(main)` — `/dashboard`, `/communities`, `/connections` — all protected; share the sidebar layout in `src/app/(main)/layout.tsx`

### Data Model
| Model | Purpose |
|-------|---------|
| `User` | Auth + profile; password stored hashed |
| `Community` | Topic group with name, topic, description |
| `Membership` | User ↔ Community; roles: `MEMBER`, `ADMIN` |
| `Connection` | Mutual friend request; states: `PENDING` → `ACCEPTED`/`REJECTED` |
| `Stream` | Live session in a community; states: `LIVE` → `ENDED`; `roomName` maps to LiveKit room |

Standard NextAuth tables (`Account`, `Session`, `VerificationToken`) are present for future OAuth providers.

### Video Stream Flow
1. Community member clicks "Start Stream" → `POST /api/streams` creates a `Stream` row with a unique `roomName = ${communityId}-${Date.now()}`
2. Client navigates to `/communities/[id]/stream?room=<roomName>`
3. `stream-room.tsx` (client) fetches `GET /api/streams/token?room=<roomName>` — server mints a LiveKit JWT via `src/lib/livekit.ts`
4. `<LiveKitRoom>` connects to `NEXT_PUBLIC_LIVEKIT_URL` with the token; `<VideoConference>` renders the full room UI

The stream page wraps the client component in `<Suspense>` because it uses `useSearchParams()`.

### Auth Pattern
Server components call `auth()` from `src/lib/auth.ts` directly. API routes also call `auth()` for session checks. `session.user.id` is populated via the JWT/session callbacks and augmented in `src/types/next-auth.d.ts`.

## Environment Variables
See `.env.local.example`. LiveKit in Docker `--dev` mode uses `LIVEKIT_API_KEY=devkey` / `LIVEKIT_API_SECRET=secret` — do not use in production.
