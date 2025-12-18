import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { createServiceClient } from '@/lib/supabase/server';
import { Resend } from 'resend';
import { AIReadinessReport } from '@/lib/pdf/report-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { analysisId, purchaseId, email } = body;

    if (!analysisId || !email) {
      return NextResponse.json(
        { error: 'Analysis ID and email are required' },
        { status: 400 }
      );
    }

    console.log(`[PDF] Starting generation for analysis: ${analysisId}`);

    const supabase = createServiceClient();

    // Update PDF status to generating
    if (purchaseId) {
      await supabase
        .from('pdf_reports')
        .update({ status: 'generating' })
        .eq('purchase_id', purchaseId);
    }

    // Fetch the analysis
    const { data: analysis, error: analysisError } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', analysisId)
      .single();

    if (analysisError || !analysis) {
      console.error('[PDF] Analysis not found:', analysisError);
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    console.log(`[PDF] Generating PDF for ${analysis.domain}...`);

    // Generate PDF
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await renderToBuffer(
        AIReadinessReport({
          analysis: {
            id: analysis.id,
            url: analysis.url,
            domain: analysis.domain,
            overall_score: analysis.overall_score,
            checks: analysis.checks,
            metadata: analysis.metadata,
          },
          email,
        })
      );
      console.log(`[PDF] PDF generated, size: ${pdfBuffer.length} bytes`);
    } catch (pdfError) {
      console.error('[PDF] PDF generation failed:', pdfError);

      if (purchaseId) {
        await supabase
          .from('pdf_reports')
          .update({
            status: 'failed',
            error_message: 'PDF generation failed'
          })
          .eq('purchase_id', purchaseId);
      }

      return NextResponse.json({ error: 'PDF generation failed' }, { status: 500 });
    }

    // Upload to Supabase Storage
    const fileName = `reports/${analysisId}-${Date.now()}.pdf`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('pdf-reports')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    let pdfUrl: string | null = null;
    if (uploadError) {
      console.error('[PDF] Upload failed:', uploadError);
      // Continue without storage - we'll send the PDF directly via email
    } else {
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pdf-reports')
        .getPublicUrl(fileName);
      pdfUrl = urlData?.publicUrl || null;
      console.log(`[PDF] Uploaded to storage: ${pdfUrl}`);
    }

    // Send email with PDF attachment
    console.log(`[PDF] Sending email to ${email}...`);

    try {
      await resend.emails.send({
        from: 'AI Readiness <reports@ellypsis.ai>',
        to: email,
        subject: `Your AI Readiness Report for ${analysis.domain}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <h1 style="color: #0D0D0D; font-size: 24px; margin-bottom: 16px;">
              Your AI Readiness Report is Ready
            </h1>

            <p style="color: #525252; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Thank you for your purchase! Attached is your detailed AI readiness report for <strong>${analysis.domain}</strong>.
            </p>

            <div style="background: #F5F5F5; padding: 24px; border-radius: 8px; margin-bottom: 24px;">
              <div style="font-size: 48px; font-weight: bold; color: #0D0D0D; text-align: center;">
                ${analysis.overall_score}
                <span style="font-size: 20px; color: #525252;">/100</span>
              </div>
              <div style="text-align: center; color: #525252; font-size: 14px; margin-top: 8px;">
                Overall AI Readiness Score
              </div>
            </div>

            <p style="color: #525252; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Your report includes:
            </p>

            <ul style="color: #525252; font-size: 16px; line-height: 1.8; margin-bottom: 24px; padding-left: 20px;">
              <li>Executive summary for stakeholders</li>
              <li>Detailed analysis of all ${analysis.checks?.length || 8} metrics</li>
              <li>Prioritized action plan with specific fixes</li>
              <li>Recommendations tailored to your site</li>
            </ul>

            ${pdfUrl ? `
              <p style="color: #525252; font-size: 14px; margin-bottom: 24px;">
                You can also <a href="${pdfUrl}" style="color: #0D0D0D;">download your report here</a>.
              </p>
            ` : ''}

            <hr style="border: none; border-top: 1px solid #E5E5E5; margin: 32px 0;" />

            <p style="color: #A3A3A3; font-size: 12px; line-height: 1.6;">
              Questions about your report? Reply to this email or contact us at support@ellypsis.ai.
              <br /><br />
              EllypsisAI - Making websites AI-ready
            </p>
          </div>
        `,
        attachments: [
          {
            filename: `ai-readiness-report-${analysis.domain.replace(/\./g, '-')}.pdf`,
            content: pdfBuffer.toString('base64'),
          },
        ],
      });
      console.log('[PDF] Email sent successfully');
    } catch (emailError) {
      console.error('[PDF] Email sending failed:', emailError);
      // Don't fail the whole request - PDF is still generated
    }

    // Update PDF report status
    if (purchaseId) {
      await supabase
        .from('pdf_reports')
        .update({
          status: 'completed',
          pdf_url: pdfUrl,
          completed_at: new Date().toISOString(),
        })
        .eq('purchase_id', purchaseId);
    }

    console.log(`[PDF] Generation complete for ${analysis.domain}`);

    return NextResponse.json({
      success: true,
      pdfUrl,
      message: 'PDF generated and sent successfully',
    });
  } catch (error) {
    console.error('[PDF] Generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
