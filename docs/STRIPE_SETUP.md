# Stripe Setup Guide

Complete guide to activating Stripe payments for the AI Readiness Tool.

---

## Overview

The payment flow works like this:
1. User enters email → clicks "Get Full Report"
2. Frontend calls `/api/checkout` → creates Stripe Checkout Session
3. User is redirected to Stripe's hosted checkout page
4. After payment, Stripe redirects to `/success?session_id=xxx`
5. Stripe sends a webhook to `/api/webhooks/stripe` confirming payment
6. Webhook updates the `purchases` table and creates a `pdf_reports` record

---

## Step 1: Run the Database Migration

Go to your Supabase project: https://supabase.com/dashboard

1. Click on **SQL Editor** in the left sidebar
2. Click **New Query**
3. Copy and paste the entire contents of `supabase/migrations/002_purchases_and_pdf.sql`
4. Click **Run** (or Cmd+Enter)

This creates two new tables:
- `purchases` - Tracks Stripe transactions
- `pdf_reports` - Tracks PDF generation status

It also adds missing columns to the `leads` table if they don't exist.

**To verify it worked:**
```sql
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('purchases', 'pdf_reports');
```
You should see both tables listed.

---

## Step 2: Get Your Stripe API Keys

### For Testing (you already have these):
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy the **Publishable key** (starts with `pk_test_`)
3. Copy the **Secret key** (starts with `sk_test_`)

### For Production (when you launch):
1. Go to https://dashboard.stripe.com/apikeys (not /test/)
2. Copy the **Publishable key** (starts with `pk_live_`)
3. Copy the **Secret key** (starts with `sk_live_`)

**Add to `.env.local`:**
```bash
STRIPE_SECRET_KEY=sk_test_xxxxx        # or sk_live_xxxxx for production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx  # or pk_live_xxxxx
```

---

## Step 3: Set Up the Webhook

Webhooks let Stripe notify your app when payments complete. This is critical for:
- Confirming the purchase in your database
- Triggering PDF generation
- Handling refunds

### For Local Development:

Use the Stripe CLI to forward webhooks to localhost:

```bash
# Install Stripe CLI (if not installed)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret like:
```
Your webhook signing secret is whsec_xxxxx
```

Add this to `.env.local`:
```bash
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### For Production (Vercel/your hosting):

1. Go to https://dashboard.stripe.com/webhooks
2. Click **Add endpoint**
3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/webhooks/stripe
   ```
4. Select these events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
   - `charge.refunded`
5. Click **Add endpoint**
6. Click on your new endpoint, then **Reveal** the signing secret
7. Copy it to your production environment variables:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_xxxxx
   ```

---

## Step 4: Set Your Base URL

The checkout needs to know where to redirect after payment.

**For local development:**
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**For production:**
```bash
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

---

## Step 5: Configure Your Product/Price (Optional)

Currently the price is hardcoded at $49 in `/app/api/checkout/route.ts`:

```typescript
unit_amount: 4900, // $49.00 in cents
```

If you want to change the price, edit this value. For example:
- $29 = `2900`
- $49 = `4900`
- $99 = `9900`

Alternatively, you can create a Product in Stripe Dashboard and use a Price ID:

1. Go to https://dashboard.stripe.com/products
2. Click **Add product**
3. Name: "AI Readiness Report"
4. Price: $49 one-time
5. Copy the Price ID (starts with `price_`)
6. Update the checkout route to use the price ID instead of `price_data`

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
STRIPE_SECRET_KEY=sk_live_xxxxx          # Use sk_test_xxxxx for testing
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx  # Use pk_test_xxxxx for testing
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# Base URL
NEXT_PUBLIC_BASE_URL=https://your-domain.com

# Email (Phase 5)
# RESEND_API_KEY=xxxxx
```

---

## Testing the Flow

### With Stripe CLI (Recommended):

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. In another terminal, start webhook forwarding:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

3. Go to http://localhost:3000
4. Run an analysis
5. Scroll to pricing, enter email, click "Get Full Report"
6. Use test card: `4242 4242 4242 4242` (any future date, any CVC)
7. Complete payment
8. You should land on `/success` page

### Test Card Numbers:

| Card Number | Scenario |
|-------------|----------|
| 4242 4242 4242 4242 | Successful payment |
| 4000 0000 0000 9995 | Declined (insufficient funds) |
| 4000 0000 0000 0002 | Declined (generic) |
| 4000 0025 0000 3155 | Requires 3D Secure |

Use any future expiry date and any 3-digit CVC.

---

## Verifying Payments in Database

After a successful test payment, check your Supabase:

```sql
-- Check purchases
SELECT * FROM purchases ORDER BY created_at DESC LIMIT 5;

-- Check PDF report records
SELECT * FROM pdf_reports ORDER BY created_at DESC LIMIT 5;
```

---

## Going Live Checklist

Before switching to production:

- [ ] Run the SQL migration on production Supabase
- [ ] Replace test keys with live keys in production environment
- [ ] Create production webhook endpoint in Stripe Dashboard
- [ ] Add production webhook secret to environment
- [ ] Update `NEXT_PUBLIC_BASE_URL` to production domain
- [ ] Test with a real card (you can refund immediately)
- [ ] Enable Stripe Radar for fraud protection

---

## Troubleshooting

### "Failed to create checkout session"
- Check that `STRIPE_SECRET_KEY` is set and valid
- Check server logs for specific error

### Webhook not firing
- Ensure `STRIPE_WEBHOOK_SECRET` matches the endpoint
- Check Stripe Dashboard > Webhooks > [your endpoint] > Logs
- For local: make sure `stripe listen` is running

### Payment succeeds but purchase not in database
- Webhook might have failed - check Stripe webhook logs
- Check Supabase logs for insert errors
- Verify the `purchases` table exists

### Success page shows error
- The verify endpoint might be failing
- Check that `stripe_checkout_session_id` is being saved correctly

---

## Files Reference

| File | Purpose |
|------|---------|
| `/app/api/checkout/route.ts` | Creates Stripe Checkout Sessions |
| `/app/api/checkout/verify/route.ts` | Verifies payment for success page |
| `/app/api/webhooks/stripe/route.ts` | Handles Stripe webhooks |
| `/app/success/page.tsx` | Post-payment success page |
| `/supabase/migrations/002_purchases_and_pdf.sql` | Database schema |
| `/components/.../PricingCTA.tsx` | Checkout button UI |
