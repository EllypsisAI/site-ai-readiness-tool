# AI Readiness Tool: Conversion Funnel Architecture

> **Status**: Phases 1-5 COMPLETE. Ready for Phase 6 (AI-Enhanced Reports).

---

## Overview

Transform the free AI Readiness Analysis into a lead-generation funnel:
- **FREE**: URL input → Firecrawl analysis → Score + metrics display ✅ DONE
- **CONVERSION**: Scrolly persuasion journey using their specific results ✅ DONE
- **PAID**: Detailed PDF report delivered via email after Stripe payment ✅ DONE (basic)
- **PREMIUM**: AI-enhanced PDF with step-by-step actionable guidance 🔜 NEXT

**Completed Decisions**:
- Payment: Stripe Checkout Sessions ($49, adjustable)
- PDF Delivery: Webhook triggers generation → Supabase Storage → Resend email
- Shareability: Yes - unique URLs per analysis (`/report/[id]`)
- Email Capture: After results display (user sees value first, email unlocks sharing)
- GDPR Compliance: Consent checkboxes, privacy policy, data deletion

**Pending Decisions**:
- Final pricing ($49 basic vs $100-150 premium with AI insights)
- Custom branding/colors

---

## Architecture Decisions

### 1. Page Structure: Hybrid Approach

```
/                     → Homepage with URL input + results + scrolly journey (single page)
/report/[id]          → SSR shareable report page (for link previews + SEO)
/checkout/[id]        → Checkout confirmation
/success              → Post-purchase success with PDF status
```

**Rationale**: Single-page scroll for conversion flow (no context loss), separate SSR route for sharing (proper meta tags).

### 2. Database: Supabase

- Native Postgres with Next.js integration
- Built-in storage for PDFs
- Edge Functions for background jobs
- Free tier sufficient for MVP

### 3. State Management: Expand Jotai

Current state in `page.tsx` is local. Move to Jotai atoms for:
- Analysis data persistence across scroll
- User/lead state
- Funnel progress tracking

---

## Database Schema

```sql
-- Core analysis results
analyses (
  id UUID PRIMARY KEY,
  url TEXT,
  domain TEXT,
  overall_score INTEGER,
  checks JSONB,              -- 8 metric results
  html_content TEXT,
  metadata JSONB,
  ai_insights JSONB,         -- Optional AI enhancement
  created_at TIMESTAMPTZ
)

-- Email capture (leads)
leads (
  id UUID PRIMARY KEY,
  analysis_id UUID REFERENCES analyses,
  email TEXT,
  company_name TEXT,
  marketing_consent BOOLEAN,
  utm_source TEXT,
  created_at TIMESTAMPTZ
)

-- Stripe purchases
purchases (
  id UUID PRIMARY KEY,
  analysis_id UUID REFERENCES analyses,
  lead_id UUID REFERENCES leads,
  stripe_checkout_session_id TEXT,
  status TEXT,               -- pending, completed, refunded
  amount_cents INTEGER,
  created_at TIMESTAMPTZ
)

-- PDF generation tracking
pdf_reports (
  id UUID PRIMARY KEY,
  analysis_id UUID REFERENCES analyses,
  purchase_id UUID REFERENCES purchases,
  status TEXT,               -- pending, generating, completed, failed
  pdf_url TEXT,
  created_at TIMESTAMPTZ
)
```

---

## API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/ai-readiness` | POST | Main analysis (Firecrawl → scoring → save to DB) |
| `/api/analysis/[id]` | GET | Fetch analysis for SSR report page |
| `/api/email-capture` | POST | Save lead, link to analysis |
| `/api/checkout` | POST | Create Stripe Checkout Session |
| `/api/checkout/verify` | GET | Verify payment status |
| `/api/webhooks/stripe` | POST | Handle payment success, trigger PDF |
| `/api/pdf/generate` | POST | Generate PDF and send email |
| `/api/pdf/status` | GET | Check PDF generation status |
| `/api/pdf/preview` | GET | Preview PDF without payment (testing) |
| `/api/data-deletion` | POST | GDPR data deletion request |

---

## Scrolly Journey Structure (6 Sections)

After results display, user scrolls through personalized persuasion:

1. **Score Breakdown** (0-15vh)
   - Animated score visualization
   - "Your site scored {score}% - here's what that means"
   - Highlight top 2 failing metrics

2. **Problem Statement** (15-30vh)
   - "AI agents are how customers find you in 2025"
   - Reference their specific domain
   - Stats about AI-driven traffic

3. **Competitor Context** (30-45vh)
   - "Sites scoring 80+ get discovered by AI"
   - Show where their score falls in distribution

4. **Detailed Findings Preview** (45-60vh)
   - Teased/blurred action items
   - Preview 2-3 real action items from their analysis
   - "40+ specific fixes in full report"

5. **Solution Preview** (60-75vh)
   - Mock PDF layout with their domain name
   - Section highlights (Executive Summary, Code Examples, etc.)

6. **Pricing CTA** (75-100vh)
   - Clear pricing
   - Value stack
   - Email capture → Stripe Checkout

---

## Key Components

```
/components/app/(home)/sections/scrolly/
  ScrollyJourney.tsx              # Main container with scroll tracking
  sections/
    ScoreBreakdown.tsx
    ProblemStatement.tsx
    CompetitorComparison.tsx
    DetailedFindings.tsx
    SolutionPreview.tsx
    PricingCTA.tsx
  hooks/
    useScrollProgress.ts          # Intersection observer + scroll %
    usePersonalization.ts         # Generate dynamic copy from their data
    useUtmParams.ts               # Capture UTM parameters

/lib/pdf/
  report-template.tsx             # React-PDF 3-page template

/atoms/
  analysis.ts                     # analysisId, analysisData, funnelStep
```

---

## Third-Party Services

| Service | Purpose | Notes |
|---------|---------|-------|
| Supabase | DB + Storage + Edge Functions | Free tier |
| Stripe | Payments | Checkout Sessions |
| Resend | Transactional email | Free 3k/month |
| React-PDF | PDF generation | Server-side |
| OpenAI | AI-enhanced reports | GPT-4 (Phase 6) |

---

## Data Flow Summary

```
URL Input → Firecrawl → Save to DB → Display Results
                                          ↓
                                    Scrolly Journey
                                          ↓
                                    Email Capture → Lead stored
                                          ↓
                                    Stripe Checkout
                                          ↓
                                    Webhook → PDF Job → Email with PDF
```

---

## Implementation Phases

### Phase 1: Foundation ✅ COMPLETE
- [x] Set up Supabase project + schema
- [x] Modify `/api/ai-readiness` to save to DB
- [x] Create `/api/analysis` and `/api/analysis/[id]`
- [x] Create `/app/report/[id]/page.tsx` with SSR
- [x] Add Jotai atoms for analysis state

### Phase 2: Scrolly Journey ✅ COMPLETE
- [x] Create ScrollyJourney container with scroll tracking
- [x] Build 6 scroll sections with Framer Motion
- [x] Create personalization hooks
- [x] Integrate after ControlPanel results

### Phase 3: Email Capture + Privacy ✅ COMPLETE
- [x] Create email capture components with consent checkboxes
- [x] Implement `/api/email-capture` with UTM tracking
- [x] Gate shareable link behind email
- [x] Create Privacy Policy, Terms of Service pages
- [x] Create Cookie Consent banner
- [x] Create `/delete-my-data` page and API

### Phase 4: Stripe Integration ✅ COMPLETE
- [x] Create `/api/checkout` for Checkout Sessions
- [x] Implement `/api/webhooks/stripe` webhook handler
- [x] Create `/success` page with payment verification
- [x] Create `/api/checkout/verify` for session validation

**Setup Guide**: `docs/STRIPE_SETUP.md`

### Phase 5: PDF Generation + Delivery ✅ COMPLETE (Basic)
- [x] Design PDF template with React-PDF (`lib/pdf/report-template.tsx`)
- [x] Create `/api/pdf/generate` for PDF creation
- [x] Implement Resend email delivery with PDF attachment
- [x] Add PDF status polling on success page
- [x] Create `/api/pdf/preview` for testing without payment

**Setup Guide**: `docs/PDF_EMAIL_SETUP.md`

**Current Limitation**: PDF shows the same info as the free analysis. Not worth paying for.

---

### Phase 6: AI-Enhanced Premium Reports 🔜 NEXT
**Goal**: Transform the PDF from "summary of free data" to "actionable implementation guide worth $100-150"

**The Problem**:
Current PDF says things like "Create llms.txt" without explaining:
- What is llms.txt?
- Where does it go?
- What should be in it?
- Code examples for their specific site

**The Solution**: Use LLM (OpenAI GPT-4) to generate:
1. **Contextual explanations** - What each issue means for THEIR site
2. **Step-by-step instructions** - Exactly how to fix each issue
3. **Code snippets** - Copy-paste ready solutions
4. **Priority reasoning** - Why this matters for AI discovery

**Implementation**:
- [ ] Create `/api/ai-insights` route to generate LLM-powered recommendations
- [ ] Design prompt templates for each metric type
- [ ] Store AI insights in `analyses.ai_insights` JSONB field
- [ ] Update PDF template with expanded sections per issue
- [ ] Add "Code Examples" section with syntax highlighting
- [ ] Consider tiered pricing (Basic $49 vs Premium $149)

**Example Output Transformation**:

| Current (Free-tier quality) | Enhanced (Premium quality) |
|----------------------------|---------------------------|
| "Missing llms.txt file" | "Your site lacks an llms.txt file, which is how AI agents like ChatGPT and Claude understand what your site offers." |
| "Recommendation: Add llms.txt" | "**Step 1**: Create a file called `llms.txt` in your root directory (`/public/llms.txt` for Next.js).<br>**Step 2**: Add this content:<br>```<code for their domain>```<br>**Step 3**: Deploy and verify at `yourdomain.com/llms.txt`" |

**LLM Provider**: OpenAI GPT-4 (decided) - You have a key, good quality, well-documented API.

---

### Phase 7: UI/Branding Refresh (Lower Priority)
**Goal**: Replace Firecrawl branding with EllypsisAI identity

- [ ] Design new color palette in `colors.json`
- [ ] Update logo and favicon
- [ ] Refresh typography choices
- [ ] Update meta tags and OG images
- [ ] Review all copy for brand voice

**Note**: Do this AFTER core functionality is proven. Ship ugly, iterate later.

---

### Phase 8: Production Deployment
**Goal**: One-click deploy to Vercel with step-by-step guide

**Pre-Deployment Checklist**:
- [ ] All environment variables documented
- [ ] Supabase migrations ready to run
- [ ] Stripe webhook URL updated to production domain
- [ ] Resend domain verified
- [ ] Error monitoring set up (Sentry or similar)

**Deployment Steps** (to be expanded into `docs/DEPLOYMENT.md`):
1. Push code to GitHub
2. Connect Vercel to GitHub repo
3. Configure environment variables in Vercel dashboard
4. Run Supabase migrations on production
5. Set up Stripe production webhook
6. Verify Resend domain
7. Test end-to-end flow
8. Set up custom domain (optional)

**Post-Launch**:
- [ ] Set up analytics (Vercel Analytics or Plausible)
- [ ] Monitor error rates
- [ ] Set up alerts for failed payments/PDFs

---

## Decisions Made

- **Pricing**: Currently $49, considering $100-150 for AI-enhanced premium tier
- **Email timing**: After results display (user sees value, then email unlocks sharing)
- **PDF scope**: Executive summary + Top 10 priorities + All action items (to be enhanced with AI)
- **GDPR**: Full compliance with consent checkboxes, privacy policy, data deletion
- **LLM for insights**: OpenAI GPT-4 (decided)

---

## Session Log: December 18, 2024

### What Was Built

**Phase 3.5: Privacy & GDPR Compliance**
- Created `/app/privacy/page.tsx` - Full GDPR-compliant privacy policy
- Created `/app/terms/page.tsx` - Terms of service
- Created `/app/delete-my-data/page.tsx` - Self-service data deletion
- Created `/app/api/data-deletion/route.ts` - Data deletion API
- Created `/components/shared/CookieConsent.tsx` - Cookie consent banner
- Updated email capture with consent checkboxes and UTM tracking

**Phase 4: Stripe Integration**
- Created `/app/api/checkout/route.ts` - Stripe Checkout Sessions
- Created `/app/api/checkout/verify/route.ts` - Payment verification
- Created `/app/api/webhooks/stripe/route.ts` - Webhook handler
- Created `/app/success/page.tsx` - Post-payment success page
- Created `docs/STRIPE_SETUP.md` - Complete setup guide
- Created `supabase/migrations/002_purchases_and_pdf.sql`

**Phase 5: PDF Generation**
- Created `/lib/pdf/report-template.tsx` - 3-page React-PDF template
- Created `/app/api/pdf/generate/route.ts` - PDF generation + email
- Created `/app/api/pdf/status/route.ts` - Status polling
- Created `/app/api/pdf/preview/route.ts` - Test without payment
- Created `docs/PDF_EMAIL_SETUP.md` - Complete setup guide
- Updated webhook to trigger PDF generation

### Database Migration Needed
Run `supabase/migrations/002_purchases_and_pdf.sql` in Supabase SQL Editor to create:
- `purchases` table
- `pdf_reports` table
- Additional columns on `leads` table
