import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');
  const analysisId = request.nextUrl.searchParams.get('analysis_id');

  if (!sessionId && !analysisId) {
    return NextResponse.json(
      { error: 'Session ID or Analysis ID is required' },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  try {
    let pdfReport;

    if (sessionId) {
      // Find by Stripe session ID
      const { data: purchase } = await supabase
        .from('purchases')
        .select('id')
        .eq('stripe_checkout_session_id', sessionId)
        .single();

      if (purchase) {
        const { data } = await supabase
          .from('pdf_reports')
          .select('status, pdf_url, created_at, completed_at')
          .eq('purchase_id', purchase.id)
          .single();

        pdfReport = data;
      }
    } else if (analysisId) {
      // Find by analysis ID (most recent)
      const { data } = await supabase
        .from('pdf_reports')
        .select('status, pdf_url, created_at, completed_at')
        .eq('analysis_id', analysisId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      pdfReport = data;
    }

    if (!pdfReport) {
      return NextResponse.json({
        status: 'not_found',
        message: 'PDF report not found',
      });
    }

    return NextResponse.json({
      status: pdfReport.status,
      pdfUrl: pdfReport.pdf_url,
      createdAt: pdfReport.created_at,
      completedAt: pdfReport.completed_at,
    });
  } catch (error) {
    console.error('PDF status check error:', error);
    return NextResponse.json(
      { error: 'Failed to check PDF status' },
      { status: 500 }
    );
  }
}
