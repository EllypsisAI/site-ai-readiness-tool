import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServiceClient } from '@/lib/supabase/server';
import { AIReadinessReport } from '@/lib/pdf/report-template';

// Preview endpoint - generates PDF without payment (for testing)
// Remove this in production or add authentication
export async function GET(request: NextRequest) {
  const analysisId = request.nextUrl.searchParams.get('id');

  if (!analysisId) {
    return NextResponse.json({ error: 'Analysis ID required. Use ?id=xxx' }, { status: 400 });
  }

  const supabase = createServiceClient();

  // Fetch the analysis
  const { data: analysis, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error || !analysis) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
  }

  try {
    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      AIReadinessReport({
        analysis: {
          id: analysis.id,
          url: analysis.url,
          domain: analysis.domain,
          overall_score: analysis.overall_score,
          checks: analysis.checks,
          metadata: analysis.metadata,
        },
        email: 'preview@example.com',
      })
    );

    // Return PDF directly
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="ai-readiness-${analysis.domain}.pdf"`,
      },
    });
  } catch (err) {
    console.error('PDF preview error:', err);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
