# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev         # Start development server (Vite)
npm run build       # Production build — client, SSR bundle, prerender, sitemap, llms.txt, SEO gate
npm run lint        # Run ESLint
npm run preview     # Preview production build
npm run check:seo   # Phase 06 acceptance tests T1-T8 / S1-S6 over dist/ (also runs in postbuild)
npm run check:live  # C1-C6, 404s and redirect hops against a served origin
```

## Tech Stack

- **Framework**: React 19 with TypeScript, React Router 8
- **Build Tool**: Vite 8, with a second SSR build used only for prerendering
- **Styling**: Tailwind CSS with a custom blue palette; Inter loaded from Google Fonts
- **Icons**: lucide-react
- **Linting**: ESLint with TypeScript and React Hooks plugins

## Architecture

This is a **prerendered** marketing website for "Developers Hub Sdn Bhd" - a
Malaysian company focused on education, technology, and entrepreneurship based
in Johor Bahru.

It is authored as a React SPA but **does not ship as one**. `npm run build`
emits a real HTML document per route:

1. `vite build` — client bundle plus `dist/index.html` as the template
2. `vite build --config vite.ssr.config.ts` — `dist-ssr/entry-server.js`
3. `scripts/prerender.mjs` — renders every route in `entry-server.js` `routes()`
   and writes `dist/<route>/index.html`, injecting the head and one JSON-LD
   `@graph` collected during render
4. `postbuild` — sitemap, `llms.txt`, then the SEO acceptance gate

**Do not reintroduce the `/* /index.html 200` fallback in `public/_redirects`.**
That single rule was the root cause of most of the 1 Sep 2026 audit findings: it
answered every unmatched path with the homepage at HTTP 200, so `/about/`,
`/llms.txt` and `/tidak-wujud/` all returned the same document, the crawler saw
one page instead of nineteen, and every URL canonicalised to `https://devhub.my`.
Unmatched paths now fall through to `dist/404.html`, which Netlify serves with a
genuine 404.

`src/App.tsx` deliberately creates **no router** — `main.tsx` supplies
`BrowserRouter`, `entry-server.tsx` supplies `StaticRouter`. A router inside
`App` reads `document` on construction and makes the tree unrenderable on the
server. For the same reason, nothing in the render path may touch `window` or
`document` outside an effect.

### Component Structure

The app follows a simple page-section pattern where `App.tsx` composes the main layout:

`App.tsx` holds the route table and the shared chrome. The homepage composes
sections; every other route is a page in `src/pages/`.

```text
App.tsx
├── Navbar                       Fixed nav, scroll-aware, mobile hamburger
├── Routes
│   ├── /                        Hero + About + Services + Contact sections
│   ├── /about/                  AboutPage        Organization, Person
│   ├── /contact/                ContactPage      LocalBusiness, address, hours
│   ├── /services/               ServicesIndex    the four Service entities
│   ├── /services/:slug/         ServiceDetail    + related technologies, FAQ
│   ├── /technologies/           TechnologiesIndex
│   ├── /technologies/:slug/     TechnologyDetail + services, courses, experts
│   ├── /authors/                AuthorsIndex
│   ├── /authors/:slug/          AuthorProfile    expertise with its evidence
│   ├── /trainings/[…]           TrainingsIndex, TrainingDetail
│   └── /blog/[…]                BlogIndex, BlogPost
└── Footer                       Links every service, technology and hub
```

Entity pages share `PageShell` (breadcrumbs, the single `h1`, the definition
lede) and `Section`. Adding a page means adding it to the route table **and** to
`routes()` in `entry-server.tsx` — the second is what gets it prerendered, into
the sitemap and into `llms.txt`.

### Navigation and the URL contract

Every internal destination is a real page with a **trailing slash**, reached
with `<Link to>`. The Navbar's old hash links (`#about-us`, `#services`,
`#contact`) are gone: they scrolled on the homepage and went nowhere from any
other page, which left `/about/` and `/contact/` with no inbound link at all.

Four rules are locked (Phase 03/14, enforced by `scripts/check-seo.mjs`):

- https only, host `devhub.my` with no `www`
- trailing slash on everything except the homepage, which stays `https://devhub.my/`
- one redirect hop maximum, straight to the final URL — so **internal links must
  already carry the trailing slash**; a link to `/services/x` costs a 301 on
  every click and every crawl. One documented exception:
  `http://www.devhub.my/*` costs two hops and cannot be fixed from this repo,
  because Netlify forces HTTPS at the edge before `_redirects` is evaluated.
  Absolute-URL rules for it were tried, deployed and verified not to work, so
  they were removed rather than left implying the case is handled. Closing it
  needs a CDN or DNS rule above Netlify's edge.
- a query string never becomes part of a canonical URL

`blogPath()` and `trainingPath()` return the slashed form for this reason.

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

## Entity, SEO, AEO & GEO SOP

DevHub (as consultant) hands this repo a gate-based SOP: 22 phases, each with
acceptance criteria it verifies against production. Phases landing here are
**05, 06, 08, 12, 13, 14, 16** plus the page-build half of **03**. Tracked in
the epic issue and its per-block issues.

### Entity data is the source of truth

`src/data/site.ts` holds company identity **once** — legal name, address, email,
logo, founding year — plus the **canonical ID registry** (`ID`). Change an
address there and the JSON-LD, footer and contact page all move together; that
is a Phase 07 requirement, not a convenience.

`services.ts`, `technologies.ts` and `people.ts` hold the entities and the
relationships between them. There are four technologies — Laravel, PHP, Claude
Code and Docker — because the business owner took both candidates for the SOP's
third slot rather than choosing. The gate is evidence, not a headcount: each has
a course or a published article behind it.

A relationship is stored **once** and read from both directions.
`technologiesForTraining()` and `technologiesForService()` are reverse lookups
over `Technology.trainingSlugs` and `Technology.services`; storing the same link
on both entities would let the two copies drift. The same relationship data drives the JSON-LD, the
visible related-content links, the sitemap and `llms.txt` — if the graph says a
service relates to Laravel but no visible link connects the two pages, that is a
defect, not a styling choice.

**Never build an `@id` by string concatenation.** Every one comes from `ID` in
`site.ts`. A slug is part of an `@id`, so renaming a slug after launch breaks
entity identity and is a full migration, not a one-line edit.

### One `@graph` per page

`src/lib/schema.ts` is the only module that produces schema. Pages declare their
nodes and `useSeo` assembles exactly one `<script type="application/ld+json">`
containing one `@graph`. The builder:

- collapses duplicate `@id`s, so an entity is emitted once and referenced after
- **closes the graph itself** — a Service references its technologies and a
  Person references what they know about, so `buildGraph` pulls in any
  referenced entity the page did not declare. Without that, every page would
  have to know the transitive set, and that is how dangling references ship.
- **prunes empty values last** — `null`, `""`, `[]`, `{}`, `N/A`, `TBD`. An
  empty property is a worse signal than an absent one, so a value DevHub does
  not have is simply not written in `site.ts` (there is no `telephone`,
  `priceRange` or `sameAs` today).

Breadcrumbs are declared once per page as a `crumbs` array and passed to **both**
`breadcrumbNode()` and `<Breadcrumbs>`, so the schema and the visible trail
cannot drift.

### Never fake anything

Rule 06 of the SOP, and it is absolute: no invented author, project, review,
citation, partnership or award. No "Editorial Team" byline standing in for a
person — a name and photo going public is that person's decision. A technology
gets a page only when there is a real project, course or published article
behind it; the homepage's old ten-technology list had evidence for almost none
of them and is not coming back.

### The gate runs on every build

`scripts/check-seo.mjs` runs in `postbuild`, so a failing gate fails the build
locally, in CI and on Netlify alike. It checks T1-T8 and S1-S6 over the real
output: one JSON-LD block, one Organization node, registry-matching and
deterministic `@id`s, no empty values, canonical/`og:url`/`WebPage.url`
agreement, breadcrumb parity, crawlable internal links, one `h1`, titles under
60 characters, and sitemap/`llms.txt` consistency.

To confirm it still bites, break something deliberately — change an `@id`, pass
a different crumb array to `<PageShell>` than to `breadcrumbNode()` — and the
build must fail. DevHub asks for that demonstration.

`scripts/check-live.mjs` covers what only a served origin can answer: redirect
hop counts, real 404 status, and whether `?utm_source=` creates a second
canonical.

### Deploy previews must stay out of the index

A preview is a byte-identical copy of the site on another hostname, and the
prerendered HTML hardcodes production canonicals — so an indexable preview feeds
Google canonical tags pointing at devhub.my from a host that is not devhub.my.
Netlify already sets `X-Robots-Tag: noindex` on preview deploys, which covers
indexing. Crawling is covered by `scripts/generate-robots.mjs`, which reads
Netlify's `CONTEXT` variable at build time and writes either the production
`robots.txt` or one that disallows everything. Anything other than
`production` — including a local build — gets the disallow-everything version,
because the failure that matters is a staging copy getting indexed.

**Do not try to express this as a `[context.*]` block in `netlify.toml`.** Those
blocks accept build settings and environment variables only; header and redirect
rules written inside one are parsed and then silently ignored. That was the first
attempt, and it looked correct on deploy-preview-43 while doing nothing.

`netlify.toml` therefore holds build settings and nothing else. Redirects stay in
`public/_redirects` — two files both claiming to define routing is how a rule
gets shadowed silently.

`check-seo.mjs` asserts the right robots.txt for the context it is run in, and
fails a production build that ships the staging one.

### Phase 00: `g8stack.com` is ours

`docs/seo/disavow.txt` records it as permanently whitelisted. It is the largest
referring domain in the profile (12 backlinks) and the consultant's draft
disavow file listed it as toxic; it is in fact DevHub's own product, from the
same `g8*` family as g8crm and g8desk. The file is deliberately **not ready to
upload** — only 4 of the ~44 flagged domains have been reviewed by hand, and the
SOP requires each one classified individually rather than trusting the export.

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

- `/resources/` (listing, Topic facet filters) and `/resources/articles/:slug/`
  (post pages) render from markdown in `content/blog/*.md` — one file per post,
  and **the file name IS the slug**, so renaming one breaks every shared link
  to it.
- Posts moved from `/blog/` to `/resources/articles/` on 1 Sep 2026 to match the
  SOP's URL map, which assigns that path to Article entities. The source
  directory is still `content/blog/` and the slug is unchanged, so every old
  link survives as a single 301 (`public/_redirects`). Those redirects are
  permanent — the move happened at zero organic traffic precisely because the
  cost of breaking a link only rises.
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
