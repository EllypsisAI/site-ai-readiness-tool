import { useMemo } from 'react';

interface CheckResult {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  details?: string;
  recommendation?: string;
}

interface AIInsight {
  id: string;
  label: string;
  score: number;
  status: 'pass' | 'warning' | 'fail';
  details?: string;
  recommendation?: string;
  actionItems?: string[];
}

interface AnalysisData {
  url: string;
  domain: string;
  overallScore: number;
  checks: CheckResult[];
  metadata?: {
    title?: string;
    description?: string;
  };
  // AI insights data
  aiInsights?: AIInsight[];
  overallAIReadiness?: string;
  topPriorities?: string[];
}

interface PersonalizedContent {
  // Score-based messaging
  scoreMessage: string;
  scoreContext: string;
  urgencyLevel: 'low' | 'medium' | 'high';

  // Top issues
  topFailingMetrics: CheckResult[];
  topPassingMetrics: CheckResult[];

  // Personalized copy
  problemStatement: string;
  competitorContext: string;
  ctaMessage: string;

  // Stats
  passCount: number;
  warningCount: number;
  failCount: number;

  // Domain-specific
  domainName: string;
  isDocsSite: boolean;
  isTechSite: boolean;

  // AI-enhanced content
  hasAIInsights: boolean;
  aiReadinessSummary?: string;
  topAIPriorities?: string[];
  topAIFailingInsights: AIInsight[];
}

export function usePersonalization(analysisData: AnalysisData | null): PersonalizedContent | null {
  return useMemo(() => {
    if (!analysisData) return null;

    const { overallScore, checks, domain, aiInsights, overallAIReadiness, topPriorities } = analysisData;

    // Check if we have AI insights
    const hasAIInsights = aiInsights && aiInsights.length > 0;

    // Categorize metrics
    const passCount = checks.filter(c => c.status === 'pass').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    const failCount = checks.filter(c => c.status === 'fail').length;

    // Sort by score to find top issues
    const sortedByScore = [...checks].sort((a, b) => a.score - b.score);
    const topFailingMetrics = sortedByScore.slice(0, 3).filter(c => c.score < 70);
    const topPassingMetrics = [...checks].sort((a, b) => b.score - a.score).slice(0, 3);

    // Get top failing AI insights if available
    const topAIFailingInsights = hasAIInsights
      ? [...aiInsights!].sort((a, b) => a.score - b.score).slice(0, 3).filter(i => i.score < 70)
      : [];

    // Domain analysis
    const domainName = domain.replace('www.', '');
    const isDocsSite = domain.includes('docs.') || domain.includes('developer.');
    const isTechSite = domain.includes('github') || domain.includes('vercel') ||
                       domain.includes('netlify') || domain.includes('aws');

    // Score-based messaging
    let scoreMessage: string;
    let scoreContext: string;
    let urgencyLevel: 'low' | 'medium' | 'high';

    if (overallScore >= 80) {
      scoreMessage = "Your site is performing well";
      scoreContext = "You're ahead of most websites, but there's still room for optimization.";
      urgencyLevel = 'low';
    } else if (overallScore >= 60) {
      scoreMessage = "Your site needs attention";
      scoreContext = "You're missing opportunities to be discovered by AI systems.";
      urgencyLevel = 'medium';
    } else if (overallScore >= 40) {
      scoreMessage = "Your site has significant gaps";
      scoreContext = "AI systems are likely struggling to understand and recommend your content.";
      urgencyLevel = 'high';
    } else {
      scoreMessage = "Your site needs urgent improvements";
      scoreContext = "Your content is largely invisible to AI-powered discovery tools.";
      urgencyLevel = 'high';
    }

    // Problem statement based on failing metrics
    // Use AI insights if available for more specific messaging
    const aiFailingLabels = topAIFailingInsights.map(i => i.label.toLowerCase());
    const failingLabels = topFailingMetrics.map(m => m.label.toLowerCase());
    const allFailingLabels = [...aiFailingLabels, ...failingLabels];

    let problemStatement: string;

    // Use AI-generated summary if available
    if (hasAIInsights && overallAIReadiness) {
      problemStatement = overallAIReadiness;
    } else if (allFailingLabels.some(l => l.includes('heading') || l.includes('structure') || l.includes('architecture'))) {
      problemStatement = `AI systems can't understand ${domainName}'s content hierarchy. When ChatGPT or Perplexity scans your pages, they see disorganized information that's hard to extract and recommend.`;
    } else if (allFailingLabels.some(l => l.includes('meta') || l.includes('description') || l.includes('content quality'))) {
      problemStatement = `${domainName} lacks the metadata AI systems use to understand page context. This makes it harder for AI to accurately describe your content to users.`;
    } else if (allFailingLabels.some(l => l.includes('llms') || l.includes('robots') || l.includes('discovery'))) {
      problemStatement = `${domainName} hasn't signaled to AI crawlers how to interact with your content. Modern AI assistants look for these signals to know what's safe to reference.`;
    } else if (allFailingLabels.some(l => l.includes('knowledge') || l.includes('semantic') || l.includes('extraction'))) {
      problemStatement = `${domainName} has content that AI systems struggle to extract meaningful knowledge from. Structured data and clear entity relationships would help AI better understand your content.`;
    } else {
      problemStatement = `${domainName} is missing key signals that AI systems use to discover, understand, and recommend content to users.`;
    }

    // Competitor context
    let competitorContext: string;
    if (overallScore < 60) {
      competitorContext = `Sites scoring 80+ are 3x more likely to appear in AI-generated answers. Your competitors who optimize for AI readiness are capturing traffic you're missing.`;
    } else if (overallScore < 80) {
      competitorContext = `You're close to the top performers. Sites in the 80+ range see significantly higher AI referral traffic. A few targeted fixes could put you there.`;
    } else {
      competitorContext = `You're already performing well. The detailed report will help you maintain this advantage and address the remaining optimization opportunities.`;
    }

    // CTA message based on urgency
    let ctaMessage: string;
    if (urgencyLevel === 'high') {
      ctaMessage = `Get your ${domainName} action plan`;
    } else if (urgencyLevel === 'medium') {
      ctaMessage = `Optimize ${domainName} for AI`;
    } else {
      ctaMessage = `Fine-tune ${domainName}`;
    }

    return {
      scoreMessage,
      scoreContext,
      urgencyLevel,
      topFailingMetrics,
      topPassingMetrics,
      problemStatement,
      competitorContext,
      ctaMessage,
      passCount,
      warningCount,
      failCount,
      domainName,
      isDocsSite,
      isTechSite,
      // AI-enhanced content
      hasAIInsights: hasAIInsights || false,
      aiReadinessSummary: overallAIReadiness,
      topAIPriorities: topPriorities,
      topAIFailingInsights,
    };
  }, [analysisData]);
}
