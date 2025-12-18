import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    console.error('[STRIPE WEBHOOK] Missing signature');
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('[STRIPE WEBHOOK] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  console.log(`[STRIPE WEBHOOK] Received event: ${event.type}`);

  const supabase = createServiceClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(`[STRIPE WEBHOOK] Checkout completed: ${session.id}`);

      // Update purchase status
      const { error: updateError } = await supabase
        .from('purchases')
        .update({
          status: 'completed',
          stripe_payment_intent_id: session.payment_intent as string,
          completed_at: new Date().toISOString(),
        })
        .eq('stripe_checkout_session_id', session.id);

      if (updateError) {
        console.error('[STRIPE WEBHOOK] Failed to update purchase:', updateError);
        // Try to create the record if it doesn't exist
        const analysisId = session.metadata?.analysis_id;
        const email = session.metadata?.email || session.customer_email;

        if (analysisId && email) {
          await supabase.from('purchases').insert({
            analysis_id: analysisId,
            lead_id: session.metadata?.lead_id || null,
            stripe_checkout_session_id: session.id,
            stripe_payment_intent_id: session.payment_intent as string,
            status: 'completed',
            amount_cents: session.amount_total || 4900,
            email: email,
            completed_at: new Date().toISOString(),
          });
        }
      }

      // Create PDF report record (will be generated in Phase 5)
      const analysisId = session.metadata?.analysis_id;
      if (analysisId) {
        // Find the purchase to link the PDF
        const { data: purchase } = await supabase
          .from('purchases')
          .select('id')
          .eq('stripe_checkout_session_id', session.id)
          .single();

        if (purchase) {
          await supabase.from('pdf_reports').insert({
            analysis_id: analysisId,
            purchase_id: purchase.id,
            status: 'pending', // Will be processed by PDF generation job
          });

          console.log(`[STRIPE WEBHOOK] Created PDF report record for analysis: ${analysisId}`);
        }
      }

      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log(`[STRIPE WEBHOOK] Checkout expired: ${session.id}`);

      // Update purchase status to expired
      await supabase
        .from('purchases')
        .update({ status: 'expired' })
        .eq('stripe_checkout_session_id', session.id);

      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object as Stripe.Charge;

      console.log(`[STRIPE WEBHOOK] Charge refunded: ${charge.id}`);

      // Update purchase status
      await supabase
        .from('purchases')
        .update({ status: 'refunded', refunded_at: new Date().toISOString() })
        .eq('stripe_payment_intent_id', charge.payment_intent as string);

      break;
    }

    default:
      console.log(`[STRIPE WEBHOOK] Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
