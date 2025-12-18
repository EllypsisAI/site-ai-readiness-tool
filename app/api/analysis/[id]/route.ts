import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Analysis ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !analysis) {
      console.error('Analysis fetch error:', error);
      return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysis.id,
        url: analysis.url,
        domain: analysis.domain,
        overallScore: analysis.overall_score,
        checks: analysis.checks,
        metadata: analysis.metadata,
        aiInsights: analysis.ai_insights,
        aiOverallReadiness: analysis.ai_overall_readiness,
        aiTopPriorities: analysis.ai_top_priorities,
        enhancedScore: analysis.enhanced_score,
        createdAt: analysis.created_at
      }
    });
  } catch (error) {
    console.error('Get analysis error:', error);
    return NextResponse.json({ error: 'Failed to fetch analysis' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Analysis ID is required' }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Build update object from allowed fields
    const updateData: Record<string, unknown> = {};

    if (body.aiInsights !== undefined) {
      updateData.ai_insights = body.aiInsights;
    }
    if (body.aiOverallReadiness !== undefined) {
      updateData.ai_overall_readiness = body.aiOverallReadiness;
    }
    if (body.aiTopPriorities !== undefined) {
      updateData.ai_top_priorities = body.aiTopPriorities;
    }
    if (body.enhancedScore !== undefined) {
      updateData.enhanced_score = body.enhancedScore;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data: analysis, error } = await supabase
      .from('analyses')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Analysis update error:', error);
      return NextResponse.json({ error: 'Failed to update analysis' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysis: {
        id: analysis.id,
        url: analysis.url,
        domain: analysis.domain,
        overallScore: analysis.overall_score,
        checks: analysis.checks,
        metadata: analysis.metadata,
        aiInsights: analysis.ai_insights,
        aiOverallReadiness: analysis.ai_overall_readiness,
        aiTopPriorities: analysis.ai_top_priorities,
        enhancedScore: analysis.enhanced_score,
        createdAt: analysis.created_at
      }
    });
  } catch (error) {
    console.error('Update analysis error:', error);
    return NextResponse.json({ error: 'Failed to update analysis' }, { status: 500 });
  }
}
