# Developers Hub Website

Official website for Developers Hub Sdn Bhd - a Malaysian company focused on education, technology, and entrepreneurship based in Johor Bahru.

## Tech Stack

- React 18 with TypeScript
- Vite
- Tailwind CSS
- lucide-react icons

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── notification/       # Email subscription form components
│   ├── About.tsx           # Company goals section
│   ├── Contact.tsx         # Contact form and company details
│   ├── EmptyState.tsx      # Reusable empty state with subscription prompt
│   ├── Footer.tsx          # Site footer with links and contact info
│   ├── Hero.tsx            # Landing section with feature cards
│   ├── Logo.tsx            # Company logo component
│   ├── Navbar.tsx          # Fixed navigation header
│   ├── ProgramCard.tsx     # Training program card
│   ├── Programs.tsx        # Training programs section
│   ├── ServiceCard.tsx     # Service offering card
│   └── Services.tsx        # Services section
├── hooks/
│   ├── useNotifications.ts # Email subscription state management
│   └── usePrograms.ts      # Training programs state management
├── App.tsx                 # Main app component
├── index.css               # Global styles and Tailwind imports
└── main.tsx                # App entry point
```

## Contact

- Email: hello@devhub.my
- Address: No.24-01, Jalan Padi Emas 2, Bandar Baru Uda, 81200 Johor Bahru, Johor
- Blog: https://blog.devhub.my

## Company Details

Developers Hub Sdn. Bhd.
Company Registration No.: 202001019928 (1376248-V)

## GatherHub Class Integration

Class landing data (pricing, seats, registration state) comes from GatherHub's
signed public API at **build time** — never fetched at runtime.

- Evergreen class content lives in `src/data/classes.json`. A class with a
  `gatherhub_event_uuid` gets live run data; without one it renders in
  evergreen/waitlist mode.
- `npm run build` runs `scripts/fetch-gatherhub.mjs` first (HMAC-signed fetch,
  validated by `scripts/gatherhub-contract.mjs`) and bakes
  `src/data/gatherhub.generated.json`.
- **A failed fetch/validation for a UUID-bearing class fails the whole build**
  (slug + uuid + reason in the error). Netlify keeps the last good deploy live —
  never soften this into a silent waitlist fallback.
- Env vars (see `.env.example`): `GATHERHUB_BASE_URL`, `GATHERHUB_CLIENT_KEY`,
  `GATHERHUB_CLIENT_SECRET`, `GATHERHUB_CLIENT_DOMAIN` — set in Netlify build
  environment; only needed once a class carries a UUID.
- **Freshness:** the Netlify build hook URL must be registered in GatherHub as
  a webhook endpoint for the DevHub organization, subscribed to
  `event.updated`, `event.tickets_updated`, and `event.capacity_band_changed`;
  the nightly-rebuild workflow (secret `NETLIFY_BUILD_HOOK_URL`) covers date
  rollovers.
