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
