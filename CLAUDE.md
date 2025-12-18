# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server on localhost:3000
npm run build    # Build for production
npm run lint     # Run ESLint
npm run start    # Start production server
```

For Stripe webhook testing locally:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## Architecture Overview

This is a Next.js 14 App Router application that analyzes websites for AI readiness and sells detailed PDF reports.

### Core User Flow

1. **Free Analysis**: User enters URL → Firecrawl scrapes → 8 metrics calculated → Results displayed
2. **Conversion**: Scrolly journey persuades user with personalized insights
3. **Email Capture**: User enters email to unlock shareable link
4. **Payment**: Stripe Checkout → Webhook triggers PDF generation → Email delivery via Resend

### Key Directories

- `/app/api/ai-readiness/route.ts` - Main analysis endpoint (Firecrawl → scoring → Supabase)
- `/app/api/checkout/` - Stripe Checkout Session creation and verification
- `/app/api/webhooks/stripe/` - Payment webhook handler
- `/app/api/pdf/` - PDF generation, status, and preview endpoints
- `/lib/pdf/report-template.tsx` - React-PDF template for reports
- `/lib/supabase/` - Supabase client configuration
- `/components/app/(home)/sections/scrolly/` - Conversion funnel scroll sections
- `/atoms/` - Jotai state atoms for analysis data

### Database (Supabase)

Tables: `analyses`, `leads`, `purchases`, `pdf_reports`

Migrations in `/supabase/migrations/`

### Third-Party Services

- **Firecrawl**: Website scraping (`@mendable/firecrawl-js`)
- **Supabase**: Database + Storage
- **Stripe**: Payments (Checkout Sessions)
- **Resend**: Transactional email with PDF attachments
- **OpenAI**: AI-enhanced report generation (Phase 6)

## Component Architecture

### Directory Structure
- `/components/ui` - Raw, unstyled base components
- `/components/shared` - Reusable components (used in 2+ places)
- `/components/app/[page-name]` - Page-specific components

### Design System
- Use Tailwind classes with design tokens: `text-accent-black`, `bg-background-base`, `border-border-faint`
- Heat color scale: `heat-4` through `heat-200`
- Typography: `text-body-large`, `text-label-small`, `text-title-h1`
- Animations: Framer Motion patterns

### Responsive Design
Mobile-first approach:
```tsx
className="px-16 lg:px-24"              // Mobile padding first
className="grid grid-cols-1 lg:grid-cols-2"  // Stack on mobile
```

Key breakpoint: `lg:` (1024px+) for desktop

## Environment Variables

Required in `.env.local`:
```bash
FIRECRAWL_API_KEY=xxx
OPENAI_API_KEY=xxx
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=xxx
NEXT_PUBLIC_BASE_URL=http://localhost:3000
RESEND_API_KEY=xxx
```

## Setup Guides

- `docs/STRIPE_SETUP.md` - Stripe configuration and webhook setup
- `docs/PDF_EMAIL_SETUP.md` - PDF generation and Resend email setup

## Project Status & Planning

See `docs/ARCHITECTURE.md` for current project status, completed phases, and implementation plan.

If that file doesn't exist yet, check Claude's plan file and migrate it there first.

## Analysis Metrics

The 8 checks in `/app/api/ai-readiness/route.ts`:
- `llms-txt` - LLMs.txt file presence
- `robots-txt` - Robots.txt configuration
- `sitemap` - Sitemap.xml presence
- `heading-structure` - H1/heading hierarchy
- `readability` - Flesch-Kincaid score
- `meta-tags` - Title/description quality
- `semantic-html` - Proper HTML elements
- `accessibility` - ARIA and alt text

Each returns: `{ id, label, status, score, details, recommendation }`

## Testing Without Full Setup

- **PDF without Stripe**: `/api/pdf/preview?id=ANALYSIS_ID`
- **Analysis without payment**: Run analysis on homepage, get ID from `/report/[id]` URL
- **Stripe test cards**: `4242 4242 4242 4242` (any future date, any CVC)

## Common Issues

- **"Failed to save lead"**: Run `supabase/migrations/002_purchases_and_pdf.sql` in Supabase SQL Editor
- **Package install fails**: Use `npm install --legacy-peer-deps` (zod version conflict)
- **Webhook not firing**: Ensure `stripe listen` is running for local dev
- **PDF generation fails**: Check that `pdf-reports` storage bucket exists in Supabase (must be public)

## Notes

- Stripe API version: `2025-04-30.basil`
- GDPR compliance: Privacy at `/privacy`, terms at `/terms`, data deletion at `/delete-my-data`
- Cookie consent stored in localStorage as `cookie_consent`
- UTM params captured in sessionStorage and saved to leads table
