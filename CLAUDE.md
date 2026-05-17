# Protocol — AI-Powered Goal Deconstruction Engine

## What This Is
Protocol is a web app that takes ambitious goals (e.g., "run a sub-17 5K") and reverse-engineers them into automated daily protocols via an AI-powered intake process. Users then track compliance on a premium data dashboard.

## Tech Stack
- **Framework**: Next.js 15 (App Router, TypeScript, `src/` directory)
- **Styling**: Vanilla CSS with CSS custom properties (NO Tailwind)
- **AI Provider**: Google Gemini API (`@google/generative-ai`)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Data**: localStorage (MVP — no database yet)

## Architecture

### Directory Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes (Gemini integration)
│   │   ├── chat/route.ts   # Streaming chat for onboarding
│   │   └── generate/route.ts # Protocol generation
│   ├── dashboard/          # Main tracking dashboard
│   ├── onboarding/         # AI intake/screening flow
│   ├── paywall/            # Subscription gate
│   ├── globals.css         # Design system (CSS custom properties)
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing/hero page
├── components/             # Reusable UI components
└── lib/                    # Shared utilities
    ├── types.ts            # TypeScript interfaces
    ├── store.ts            # localStorage persistence layer
    ├── prompts.ts          # AI system prompts
    └── mock-data.ts        # Demo data for dashboard
```

### Design System
- **Dark mode + Light mode** via `[data-theme]` attribute on `<html>`
- All colors, spacing, typography defined as CSS custom properties in `globals.css`
- Color palette: Deep navy/slate backgrounds, electric cyan + emerald accent gradients
- Font: Inter (Google Fonts via next/font)
- Glassmorphism panels for cards and overlays

### Key Conventions
- Use CSS Modules (`*.module.css`) for component-scoped styles
- Use `globals.css` custom properties (`var(--color-*)`) — never hardcode colors
- API routes live in `src/app/api/` and use Next.js Route Handlers
- All data types defined in `src/lib/types.ts`
- AI prompts centralized in `src/lib/prompts.ts` — clinical/direct tone
- localStorage wrapper in `src/lib/store.ts`

### AI Coach Personality
The AI onboarding coach uses a **clinical, direct** tone — like a sports scientist or systems engineer. No fluff, no motivational platitudes. It asks precise, probing questions and outputs structured protocols.

### User Flow
1. **Landing** → Hero page with CTA
2. **Onboarding** → AI chat intake (goal → follow-up questions → protocol generation)
3. **Paywall** → Preview of generated protocol with subscription lock
4. **Dashboard** → Full tracking interface (habits, milestones, charts)

## Environment Variables
- `GEMINI_API_KEY` — Google Gemini API key (required for AI features)
- `NEXT_PUBLIC_APP_URL` — App base URL

## Commands
- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
