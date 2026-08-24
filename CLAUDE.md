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

The Navbar uses hash-based navigation (`#about-us`, `#services`, `#contact`) for in-page scrolling. Section pages (`/trainings`, `/blog`) are ordinary links; external links (e.g. Company Profile) open in new tabs.

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
- "Get Notified" opens `GetNotifiedModal` (name, email, phone/company optional),
  which POSTs the lead straight to the g8crm intake endpoint
  `CRM_INTAKE_CHANNEL_API` (`https://crm.devhub.my/api/intake/<token>`) via
  `src/lib/crm.ts` — no auth, the unguessable token is the credential, so the
  URL is public by design and exposed VITE_-free through `envPrefix`. When the
  env var is unset, the button and modal are not rendered at all.
- The GatherHub "See Available Sessions" CTA is on hold: the
  `SHOW_GATHERHUB_SESSIONS` flag in `src/lib/gatherhub.ts` hides it (and its
  GatherHub-referencing copy) until flipped; `VITE_GATHERHUB_ORG_URL` only
  takes effect then.
- Scheduling, pricing and registration are never listed on the site — they are
  announced per run (GatherHub, once the sessions CTA returns).
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

## Blog & CMS

- `/blog` (listing, Topic facet filters) and `/blog/:slug` (post pages) render
  from markdown in `content/blog/*.md` — one file per post, and **the file name
  IS the URL**, so renaming one breaks every shared link to it.
- `scripts/build-blog.mjs` (prebuild, BEFORE `generate-sitemap.mjs`) validates
  front matter against `scripts/blog-contract.mjs` (Zod, `.strict()` — same
  contract discipline as GatherHub), renders markdown to HTML with marked +
  highlight.js, and writes `src/data/blog.generated.json` (gitignored) and
  `public/rss.xml`. A post that violates the contract FAILS the build.
- Markdown is parsed at BUILD time only — no markdown parser reaches the
  bundle. Post HTML is injected with `dangerouslySetInnerHTML`, which is safe
  only because the sole source is first-party markdown committed to this repo.
  Never point that path at anything a visitor can submit.
- `draft: true` keeps a post out of the site, the RSS feed and the sitemap. The
  dev server DOES render drafts (badged "Draft") so authors can preview them —
  that is why the generated JSON is gitignored rather than committed.
- Article styling is `.blog-prose` in `src/index.css` (@tailwindcss/typography
  plus the highlight.js token palette). Code blocks stay on a dark surface in
  both themes — one palette to maintain.
- Authoring UI: **Sveltia CMS** (git-backed, CDN-served, Decap-compatible) at
  `/admin` — `admin/index.html` + `admin/admin.css` (a second Vite build entry,
  see `build.rollupOptions.input`; Sveltia's version is PINNED because it is
  pre-1.0) and `public/admin/config.yml`. It commits markdown straight to
  `developers-hub-my/website`, so publishing is a commit and Netlify rebuilds.
  No backend, no database, no CMS hosting.
- The admin page is a BUILD ENTRY, not a file in `public/`, precisely so
  Tailwind compiles it — `public/` is copied verbatim and never processed. Its
  CSS imports `tailwindcss/theme.css` + `utilities.css` but NOT preflight
  (which would reset Sveltia's own components), with `source(none)` so the
  marketing site's utility set is not baked into it. Only `config.yml` stays in
  `public/`, since it is a static asset the CMS fetches at runtime.
- The CMS is branded to match devhub.my in three layers, least fragile first:
  1. **Config** — `app_title`, `logo`, `logout_redirect_url`.
  2. **Design tokens** — Sveltia derives its whole palette from
     `--sui-base-hue` (222, the hue behind Tailwind's slate/blue) plus `--sui-*`
     overrides for the blue-600 accent and Inter. Theme through TOKENS; never
     restyle the CMS's internals.
  3. **Sign-in screen only** — card, gradient strip and Hero-style backdrop,
     every rule guarded by `:has(> img.logo)` on the sign-in composition, and
     Sveltia mounted into `#nc-root` (its documented custom mount element).
     If Sveltia changes that markup the selectors stop matching and the page
     loses its decoration, not its function — so after a version bump, open
     /admin and check the sign-in screen in both themes.
- NEVER hide or promote a sign-in button by its `.primary` / `.secondary`
  class: Sveltia's variants are CONTEXTUAL, not semantic. On localhost the
  primary is "Work with Local Repository" and GitHub sign-in is a secondary;
  in production GitHub sign-in is itself the primary. A rule keyed on the
  variant therefore means something different in each environment — one such
  rule shipped a live site whose only option was the access token. Its
  hierarchy is already correct, and the `--sui-*` tokens colour it. To offer
  GitHub only, hide the LAST button (the token option in both compositions).
- Positional selectors mislead here too: `:first-of-type` counts `<button>`
  ELEMENTS, not classes, so "first secondary button" cannot be expressed with
  it — on localhost it matches nothing and every option disappears.
- Sign-in itself needs no per-person setup: access is GitHub WRITE permission
  on `developers-hub-my/website`. Register a GitHub OAuth app (callback
  `https://api.netlify.com/auth/done`, "Expire user access tokens" OFF — the
  Netlify broker is not guaranteed to return a refresh token) and install it
  under the Netlify site's Access & security → OAuth. Netlify is Sveltia's
  default OAuth client while `backend.base_url` is unset.
- `config.yml` fields MIRROR `scripts/blog-contract.mjs` field for field. Change
  one, change the other, or the CMS will write a post the next build rejects.
  Validate the config with the official script:
  `node scripts/validate-config.mjs public/admin/config.yml` (from the
  `sveltia/ai-tools` repo, or the `sveltia-cms` Claude Code plugin).
- Signing in: "Sign In Using Access Token" (a GitHub PAT) works with no setup
  and suits a small team. For non-technical editors, register a GitHub OAuth
  app and link it to the Netlify site — Netlify is the default OAuth client
  when `backend.base_url` is unset — or deploy Sveltia CMS Authenticator on
  Cloudflare Workers and point `base_url` at it.
- `/admin` is `noindex` + `Disallow`ed in robots.txt. It needs explicit rules
  in BOTH environments or the SPA fallback swallows it and answers with the
  React 404: `public/_redirects` (above the `/*` fallback) on Netlify, and the
  `cmsAdmin()` plugin in `vite.config.ts` in dev.
- Those rules REDIRECT `/admin` → `/admin/` rather than rewriting, because the
  trailing slash is load-bearing: at `/admin` every relative URL resolves
  against the site root, so the stylesheet 404s and Sveltia looks for
  `config.yml` in the wrong place — the CMS then renders completely unstyled.
  `vite preview` honours neither rule set, so use `/admin/` there.
