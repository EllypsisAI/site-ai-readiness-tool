import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServiceClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
});

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { status: 'processing', message: 'Payment is still processing' },
        { status: 202 }
      );
    }

    const supabase = createServiceClient();

    // Get purchase details
    const { data: purchase, error: purchaseError } = await supabase
      .from('purchases')
      .select('id, analysis_id, email, status')
      .eq('stripe_checkout_session_id', sessionId)
      .single();

    if (purchaseError || !purchase) {
      // Purchase record might not exist yet (webhook delay)
      // Return success based on Stripe session
      return NextResponse.json({
        success: true,
        email: session.customer_email || session.metadata?.email,
        domain: session.metadata?.domain || 'your website',
        analysisId: session.metadata?.analysis_id,
        pdfStatus: 'pending',
      });
    }

    // Get analysis details
    const { data: analysis } = await supabase
      .from('analyses')
      .select('domain')
      .eq('id', purchase.analysis_id)
      .single();

    // Check PDF status
    const { data: pdfReport } = await supabase
      .from('pdf_reports')
      .select('status')
      .eq('purchase_id', purchase.id)
      .single();

    return NextResponse.json({
      success: true,
      email: purchase.email || session.customer_email,
      domain: analysis?.domain || 'your website',
      analysisId: purchase.analysis_id,
      pdfStatus: pdfReport?.status || 'pending',
    });
  } catch (error) {
    console.error('Session verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
