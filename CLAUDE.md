# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository. You are the orchestrator agent for the AI Readiness Analysis tool.

## Important
- ignore completed phases unless nesscary for context
- Progress log is going to have history at top - add your entries below under Phase 2 section context
- When not assigned to a spec document, always start by making sure you have enough context to proceed, extract from user by clever questioning.

## Your Role
- Read the assigned spec document completely before starting
- Break down work into parallel tasks where possible
- Spin up subagents for independent tasks
- Coordinate subagent outputs
- Maintain progress logging
- Ensure all success criteria are met before marking complete

## Project Location
- Specs location: /specs/ folder
- Progress log: /specs/progress-log.md

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
GROQ_API_KEY=xxx
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

## Execution Rules

1. **Read First:** Read the entire spec before writing any code. Understand the full scope.

2. **Subagents:** Spin up specialized subagents for independent tasks. Examples:
   - Component subagent: builds new React components
   - Page subagent: builds/modifies page files
   - Routing subagent: handles App.tsx and navigation
   - Style subagent: handles CSS/styling changes
   
   Subagents work in parallel when tasks don't depend on each other.

3. **Logging:** Update progress-log.md as you work:
   - Log when starting a spec
   - Log when each major task completes
   - Log any blockers or decisions made
   - Log when spec is complete

4. **Verification:** Before marking complete:
   - Run build (npm run build) - must succeed
   - Check all success criteria in the spec
   - Verify no console errors in dev mode

5. **Handoff:** When complete, summarize:
   - Files created
   - Files modified
   - Files deleted
   - Any notes for next spec or manual follow-up

## Progress Log Format

Use this format in progress-log.md:

---
### [Spec Name] - [Date]

**Status:** IN PROGRESS | COMPLETE

**Tasks:**
- [x] Task 1 description
- [x] Task 2 description
- [ ] Task 3 description (if incomplete)

**Subagents Spawned:**
- Component agent: [tasks assigned]
- Page agent: [tasks assigned]

**Files Changed:**
- Created: file1.tsx, file2.tsx
- Modified: App.tsx, file3.tsx
- Deleted: oldfile.tsx

**Notes:**
Any decisions, blockers, or follow-up items.

---
