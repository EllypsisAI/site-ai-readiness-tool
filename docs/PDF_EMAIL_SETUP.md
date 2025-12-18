# PDF Generation & Email Delivery Setup

Complete guide to activating PDF report generation and email delivery.

---

## Overview

After a successful Stripe payment:
1. Webhook triggers PDF generation
2. PDF is created using React-PDF
3. PDF is uploaded to Supabase Storage
4. Email with PDF attachment is sent via Resend
5. Success page polls for status and shows download link

---

## Step 1: Create Supabase Storage Bucket

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click **Storage** in the left sidebar
3. Click **New bucket**
4. Name it: `pdf-reports`
5. Check **Public bucket** (so users can download their reports)
6. Click **Create bucket**

---

## Step 2: Set Up Resend

Resend is used for sending transactional emails with PDF attachments.

1. Create account at https://resend.com
2. Verify your domain (or use their test domain for development)
3. Go to **API Keys** and create a new key
4. Add to `.env.local`:

```bash
RESEND_API_KEY=re_xxxxx
```

### Domain Verification (for production)

To send from your own domain (e.g., `reports@ellypsis.ai`):

1. Go to Resend Dashboard > **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `ellypsis.ai`)
4. Add the DNS records Resend provides
5. Wait for verification (usually a few minutes)

### For Development/Testing

You can use Resend's test domain or send to your own verified email without domain setup.

---

## Step 3: Ensure Database Tables Exist

The PDF system uses the `pdf_reports` table created in the Stripe migration. If you haven't run it:

```sql
-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS pdf_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE CASCADE,
  purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'completed', 'failed')),
  pdf_url TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_pdf_reports_analysis ON pdf_reports(analysis_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_purchase ON pdf_reports(purchase_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_status ON pdf_reports(status);
```

---

## Step 4: Update Email Sender Address

In `/app/api/pdf/generate/route.ts`, update the `from` address:

```typescript
await resend.emails.send({
  from: 'AI Readiness <reports@yourdomain.com>',  // Change this
  to: email,
  // ...
});
```

For development, you can use:
```typescript
from: 'AI Readiness <onboarding@resend.dev>',
```

---

## Complete `.env.local` Example

```bash
# Existing
FIRECRAWL_API_KEY=fc-xxxxx
OPENAI_API_KEY=sk-proj-xxxxx
GROQ_API_KEY=gsk_xxxxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Email (Resend)
RESEND_API_KEY=re_xxxxx
```

---

## Testing the Flow

### End-to-End Test:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Start Stripe webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Run an analysis on the homepage

4. Scroll to pricing, enter email, complete Stripe checkout

5. After payment, you should see:
   - Success page with "Generating your report" spinner
   - After 1-2 minutes: "Report ready" with download button
   - Email in your inbox with PDF attached

### Test PDF Generation Only:

You can test PDF generation directly:

```bash
curl -X POST http://localhost:3000/api/pdf/generate \
  -H "Content-Type: application/json" \
  -d '{"analysisId": "your-analysis-id", "email": "test@example.com"}'
```

---

## Troubleshooting

### "PDF generation failed"

- Check server logs for specific error
- Ensure the analysis exists in the database
- Verify `@react-pdf/renderer` is installed

### Email not received

- Check Resend dashboard for delivery status
- Verify `RESEND_API_KEY` is correct
- Check spam folder
- For production: ensure domain is verified

### PDF not uploading to storage

- Verify `pdf-reports` bucket exists in Supabase
- Check bucket is public
- Ensure service role key has storage permissions

### Success page stuck on "Generating"

- Check if webhook is being received (Stripe CLI output)
- Verify PDF generation API is being called
- Check for errors in server logs

---

## Files Reference

| File | Purpose |
|------|---------|
| `/lib/pdf/report-template.tsx` | React-PDF template component |
| `/app/api/pdf/generate/route.ts` | PDF generation API |
| `/app/api/pdf/status/route.ts` | PDF status check API |
| `/app/api/webhooks/stripe/route.ts` | Triggers PDF generation |
| `/app/success/page.tsx` | Polls status, shows download |

---

## Customizing the PDF Report

The PDF template is in `/lib/pdf/report-template.tsx`.

### To change colors:
Edit the `colors` object at the top of the file.

### To add new sections:
Add a new `<Page>` component following the existing pattern.

### To change content:
Modify the `generateActionItems()` function or add new helper functions.

### Note on fonts:
React-PDF includes Helvetica by default. To use custom fonts, you need to register them. See: https://react-pdf.org/fonts

---

## Going Live Checklist

- [ ] Create `pdf-reports` storage bucket in Supabase
- [ ] Set up Resend account and verify domain
- [ ] Add `RESEND_API_KEY` to production environment
- [ ] Update email `from` address in generate route
- [ ] Test end-to-end with a real payment
- [ ] Verify emails are being delivered
- [ ] Check PDF renders correctly
