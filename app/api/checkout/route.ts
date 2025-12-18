import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/server';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisId, email } = body;

    if (!analysisId) {
      return NextResponse.json({ error: 'Analysis ID is required' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Verify the analysis exists
    const supabase = createServiceClient();
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('id, domain, overall_score')
      .eq('id', analysisId)
      .single();

    if (analysisError || !analysis) {
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    // Find or get the lead
    const { data: lead } = await supabase
      .from('leads')
      .select('id')
      .eq('email', email)
      .eq('analysis_id', analysisId)
      .single();

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI Readiness Report',
              description: `Detailed analysis and action plan for ${analysis.domain}`,
              metadata: {
                analysis_id: analysisId,
                domain: analysis.domain,
              },
            },
            unit_amount: 4900, // $49.00 in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        analysis_id: analysisId,
        lead_id: lead?.id || '',
        email: email,
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin')}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin')}/?cancelled=true`,
    });

    // Create a pending purchase record
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        analysis_id: analysisId,
        lead_id: lead?.id || null,
        stripe_checkout_session_id: session.id,
        status: 'pending',
        amount_cents: 4900,
        email: email,
      });

    if (purchaseError) {
      console.error('Failed to create purchase record:', purchaseError);
      // Don't fail the checkout - we can reconcile later via webhook
    }

    return NextResponse.json({
      checkoutUrl: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
