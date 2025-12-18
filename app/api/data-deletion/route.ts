import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, reason } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Find leads with this email
    const { data: leads, error: findError } = await supabase
      .from('leads')
      .select('id, analysis_id')
      .eq('email', email);

    if (findError) {
      console.error('Error finding leads:', findError);
      return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
    }

    if (!leads || leads.length === 0) {
      // No data found - still return success (don't leak whether email exists)
      return NextResponse.json({
        success: true,
        message: 'If we have any data associated with this email, it will be deleted within 30 days.',
      });
    }

    // Delete leads
    const leadIds = leads.map(l => l.id);
    const { error: deleteLeadsError } = await supabase
      .from('leads')
      .delete()
      .in('id', leadIds);

    if (deleteLeadsError) {
      console.error('Error deleting leads:', deleteLeadsError);
      return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }

    // Optionally delete associated analyses (if no other leads reference them)
    const analysisIds = leads.map(l => l.analysis_id).filter(Boolean);
    if (analysisIds.length > 0) {
      // Check if any other leads reference these analyses
      const { data: otherLeads } = await supabase
        .from('leads')
        .select('analysis_id')
        .in('analysis_id', analysisIds);

      const analysisIdsWithOtherLeads = new Set(otherLeads?.map(l => l.analysis_id) || []);
      const analysisIdsToDelete = analysisIds.filter(id => !analysisIdsWithOtherLeads.has(id));

      if (analysisIdsToDelete.length > 0) {
        await supabase
          .from('analyses')
          .delete()
          .in('id', analysisIdsToDelete);
      }
    }

    // Log the deletion request for compliance records
    console.log(`[DATA-DELETION] Email: ${email}, Reason: ${reason || 'Not specified'}, Deleted ${leads.length} lead(s)`);

    return NextResponse.json({
      success: true,
      message: 'Your data has been deleted.',
      deletedRecords: leads.length,
    });
  } catch (error) {
    console.error('Data deletion error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
