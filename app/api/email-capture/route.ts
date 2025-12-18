import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, analysisId, companyName, marketingConsent, privacyAccepted, consentTimestamp, utmParams } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Check if this analysis already has a lead
    if (analysisId) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('analysis_id', analysisId)
        .single();

      if (existingLead) {
        // Update existing lead
        const { error: updateError } = await supabase
          .from('leads')
          .update({
            email,
            company_name: companyName || null,
            marketing_consent: marketingConsent || false,
          })
          .eq('id', existingLead.id);

        if (updateError) {
          console.error('Lead update error:', updateError);
          return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: 'Lead updated',
          leadId: existingLead.id,
        });
      }
    }

    // Create new lead with consent tracking
    const { data: lead, error: insertError } = await supabase
      .from('leads')
      .insert({
        email,
        analysis_id: analysisId || null,
        company_name: companyName || null,
        marketing_consent: marketingConsent || false,
        privacy_accepted: privacyAccepted || false,
        consent_timestamp: consentTimestamp || new Date().toISOString(),
        utm_source: utmParams?.utm_source || null,
        utm_medium: utmParams?.utm_medium || null,
        utm_campaign: utmParams?.utm_campaign || null,
        utm_term: utmParams?.utm_term || null,
        utm_content: utmParams?.utm_content || null,
        referrer: utmParams?.referrer || null,
      })
      .select('id')
      .single();

    if (insertError) {
      console.error('Lead insert error:', insertError);
      return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Lead captured',
      leadId: lead.id,
    });
  } catch (error) {
    console.error('Email capture error:', error);
    return NextResponse.json({ error: 'Failed to capture email' }, { status: 500 });
  }
}
