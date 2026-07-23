# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom blue color palette and Montserrat font
- **Icons**: lucide-react
- **Linting**: ESLint with TypeScript and React Hooks plugins

## Architecture

This is a single-page marketing website for "Developers Hub Sdn Bhd" - a Malaysian company focused on education, technology, and entrepreneurship based in Johor Bahru.

### Component Structure

The app follows a simple page-section pattern where `App.tsx` composes the main layout:

```text
App.tsx
├── Navbar      - Fixed navigation with scroll-aware styling and mobile hamburger menu
├── Hero        - Landing section with tagline and 4 feature cards (Innovation, Education, Development, Partnership)
├── About       - Company goals displayed as 4 animated cards
├── Services    - 4 service offerings using ServiceCard component
└── Footer      - Quick links, services list, and contact info
```

### Navigation

The Navbar uses hash-based navigation (`#about-us`, `#services`, `#contact`) for in-page scrolling. External links (like Blog → `https://blog.devhub.my`) open in new tabs.

### Card Components

Two reusable card patterns for displaying content:

- `ServiceCard` - Displays service with icon, title, description, and feature list (uses `ChevronRight` bullets)
- `ProgramCard` - Displays training program with icon, metadata (duration, level, price), and enroll button

### Custom Hooks

Located in `src/hooks/`:

- `usePrograms` - Manages training programs state (currently returns empty array, displays EmptyState)
- `useNotifications` - Handles email subscription state with `handleSubscribe` callback

### Notification Subscription System

Modular form components in `src/components/notification/`:

- `NotificationSubscribe` - Form container with submission handling
- `EmailInput` - Controlled email input field
- `SubscribeButton` - Submit button with loading state

Used by `EmptyState` component to prompt users to subscribe when no content is available.

### Unused Components

Some components exist but are not currently used in App.tsx:

- `Programs` - Training programs section (uses usePrograms hook and EmptyState)
- `Contact` - Contact form with company details
- `NotificationSubscribe` (in root components folder) - Duplicate, use the one in `/notification/` subdirectory

### Styling Conventions

- Custom blue color scale defined in `tailwind.config.js` (blue-50 through blue-900)
- Primary accent color: `blue-600` (#0284c7)
- Cards use `rounded-xl shadow-md hover:shadow-xl` pattern
- Responsive breakpoints: `sm:`, `md:`, `lg:` with mobile-first approach
- Section padding: `py-20` with `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` container pattern

## Trainings Catalogue

- `/trainings` (listing, g8suite-style facet filters: Stage + Tags) and
  `/trainings/:stage/:slug` (landing pages) render from the static catalogue
  `src/data/trainings.ts` — 13 courses across 4 stages, copy authored from the
  DevHub Academy repo's per-course `01-marketing/marketing-positioning.md`.
- Landing-page copy follows AIDCA: hero (Attention) → pains (Interest) →
  outcomes (Desire) → proof (Conviction) → CTA (Action).
- Delivery format (physical/online) and duration are decided per run — never
  displayed on the site. HRD Corp claims are on hold: the `SHOW_HRD_CORP`
  flag in `src/data/trainings.ts` hides all badges/filters until flipped.
- Artwork: social-kit posters converted to webp in
  `public/images/trainings/<stage>/<slug>/` (cover/diagram/quote × dark/light,
  theme-matched via DarkModeContext); brand logos vendored from simpleicons.org
  in `public/images/logos/`.
- The Action CTA links to `VITE_GATHERHUB_ORG_URL` (public URL, company-profile
  style); when unset it falls back to `SUBSCRIBE_URL` — never a dead button.
- Scheduling, pricing and registration live on GatherHub, never on the site.
- `/classes` and `/classes/:slug` are legacy URLs that redirect to `/trainings`.

## GatherHub Integration (build-time only)

- `scripts/fetch-gatherhub.mjs` (prebuild) bakes GatherHub event payloads into
  `src/data/gatherhub.generated.json` (currently evergreen — `classes.json` is
  empty; the mechanism is kept for wiring per-training event data later).
- Contract schema: `scripts/gatherhub-contract.mjs` (Zod, `.strict()`), source
  of truth is the GatherHub workspace doc `10-devhub-landing-integration.md`.
- NEVER re-compute ticket availability client-side — render `available` /
  `available_until` verbatim. Bands (`remaining_band`) render copy only, never
  seat numbers.
- NEVER fetch GatherHub at runtime or reference `GATHERHUB_*` env vars outside
  the prebuild script (secrets must not reach the bundle).
- A fetch/validation failure for a UUID-bearing class must fail the build —
  do not add a fallback.
