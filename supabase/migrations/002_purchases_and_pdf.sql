-- Phase 4: Stripe Integration
-- Run this in Supabase SQL Editor

-- Purchases table (Stripe transactions)
CREATE TABLE IF NOT EXISTS purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID REFERENCES analyses(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  email TEXT,
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'expired', 'refunded')),
  amount_cents INTEGER DEFAULT 4900,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ
);

-- PDF reports table (generated reports)
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

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_purchases_session ON purchases(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_analysis ON purchases(analysis_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);

CREATE INDEX IF NOT EXISTS idx_pdf_reports_analysis ON pdf_reports(analysis_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_purchase ON pdf_reports(purchase_id);
CREATE INDEX IF NOT EXISTS idx_pdf_reports_status ON pdf_reports(status);

-- Enable RLS (Row Level Security)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE pdf_reports ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes)
CREATE POLICY "Service role full access on purchases" ON purchases
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on pdf_reports" ON pdf_reports
  FOR ALL USING (true) WITH CHECK (true);

-- Also, ensure the previous migration ran - add missing columns to leads if needed
-- (This is safe to run multiple times)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'privacy_accepted') THEN
    ALTER TABLE leads ADD COLUMN privacy_accepted BOOLEAN DEFAULT false;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'consent_timestamp') THEN
    ALTER TABLE leads ADD COLUMN consent_timestamp TIMESTAMPTZ;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_medium') THEN
    ALTER TABLE leads ADD COLUMN utm_medium TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_campaign') THEN
    ALTER TABLE leads ADD COLUMN utm_campaign TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_term') THEN
    ALTER TABLE leads ADD COLUMN utm_term TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'utm_content') THEN
    ALTER TABLE leads ADD COLUMN utm_content TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'referrer') THEN
    ALTER TABLE leads ADD COLUMN referrer TEXT;
  END IF;
END $$;
