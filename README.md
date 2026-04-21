# AI Training

A web application for hobbyists to connect around shared interests (scale models, RC vehicles, etc.) with topic-based communities and live group video streaming.

## Features

- Email/password registration and login
- Topic-based communities — create, browse, and join
- Mutual connection requests between users
- Group video streams — any community member can go live
- Dashboard with live stream discovery across all communities

## Tech Stack

- **Next.js 15** (App Router, TypeScript)
- **PostgreSQL** + Prisma ORM
- **NextAuth.js v5** — JWT-based auth with Credentials provider
- **LiveKit** — self-hosted WebRTC group video
- **Tailwind CSS**

## Quick Start

```bash
# 1. Clone and install
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local — generate AUTH_SECRET with: openssl rand -base64 32

# 3. Start infrastructure (PostgreSQL + LiveKit)
docker compose up -d

# 4. Initialize database
npm run db:push

# 5. Run
npm run dev
# → http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # /login, /register
│   ├── (main)/          # /dashboard, /communities, /connections
│   └── api/             # REST endpoints
├── lib/
│   ├── auth.ts          # NextAuth config
│   ├── prisma.ts        # DB client singleton
│   └── livekit.ts       # LiveKit token generation
prisma/schema.prisma     # Database schema
docker-compose.yml       # PostgreSQL + LiveKit services
```

## Infrastructure Ports

| Service | Port |
|---------|------|
| Next.js | 3000 |
| PostgreSQL | 5432 |
| LiveKit HTTP | 7880 |
| LiveKit RTC | 7882/UDP |
