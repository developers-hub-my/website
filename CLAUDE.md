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

This is a single-page marketing website for "Developers Hub Sdn Bhd" - a company focused on education, technology, and entrepreneurship.

### Component Structure

The app follows a simple page-section pattern where `App.tsx` composes the main layout:

- `Navbar` - Navigation header
- `Hero` - Main landing section with feature cards
- `About` - Company information
- `Services` - Service offerings
- `Footer` - Contact info and links

### Custom Hooks

Located in `src/hooks/`:

- `usePrograms` - Manages training programs state (currently empty by default, with placeholder structure)
- `useNotifications` - Handles email subscription state

### Notification Components

Modular notification subscription system in `src/components/notification/`:

- `NotificationSubscribe` - Container component
- `EmailInput` - Email form field
- `SubscribeButton` - Submit button

### Empty State Pattern

The `EmptyState` component provides a reusable pattern for sections with no content, including notification subscription prompts.
