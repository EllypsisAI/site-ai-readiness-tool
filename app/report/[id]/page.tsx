import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServiceClient } from '@/lib/supabase/server';
import ReportClient from './ReportClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata for SEO and social sharing
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: analysis } = await supabase
    .from('analyses')
    .select('domain, overall_score, metadata')
    .eq('id', id)
    .single();

  if (!analysis) {
    return {
      title: 'Analysis Not Found | AI Readiness',
    };
  }

  const score = analysis.overall_score;
  const domain = analysis.domain;
  const title = `${domain} - AI Readiness Score: ${score}%`;
  const description = `See how ${domain} scores on AI readiness. Analyzed across 8 key metrics including heading structure, metadata quality, and semantic HTML.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function ReportPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = createServiceClient();

  const { data: analysis, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !analysis) {
    notFound();
  }

  // Transform for client component
  const analysisData = {
    id: analysis.id,
    url: analysis.url,
    domain: analysis.domain,
    overallScore: analysis.overall_score,
    checks: analysis.checks as Array<{
      id: string;
      label: string;
      status: 'pass' | 'fail' | 'warning';
      score: number;
      details: string;
      recommendation: string;
    }>,
    metadata: analysis.metadata as { title?: string; description?: string; analyzedAt?: string } | null,
    aiInsights: analysis.ai_insights,
    aiOverallReadiness: analysis.ai_overall_readiness,
    aiTopPriorities: analysis.ai_top_priorities,
    enhancedScore: analysis.enhanced_score,
    createdAt: analysis.created_at,
  };

  return <ReportClient analysis={analysisData} />;
}
