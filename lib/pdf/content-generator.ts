// LLM content generation for personalized PDF reports
// Single API call generates all dynamic content

interface CheckResult {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  details: string;
  recommendation: string;
}

interface AIInsight {
  id: string;
  label: string;
  score: number;
  status: 'pass' | 'fail' | 'warning';
  details: string;
  recommendation: string;
  actionItems: string[];
}

interface AnalysisData {
  id: string;
  url: string;
  domain: string;
  overall_score: number;
  checks: CheckResult[];
  metadata: {
    title?: string;
    description?: string;
    analyzedAt: string;
  };
  ai_insights?: AIInsight[];
  ai_overall_readiness?: string;
  ai_top_priorities?: string[];
  enhanced_score?: number;
}

export interface GeneratedContent {
  executiveSummary: string;
  llmsTxtContent: string;
  prioritizedActions: PrioritizedAction[];
}

export interface PrioritizedAction {
  order: number;
  metric: string;
  action: string;
  why: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  taskType: 'Self-service' | 'Developer';
  isQuickWin: boolean;
}

export async function generateReportContent(
  analysis: AnalysisData
): Promise<GeneratedContent> {
  const prompt = buildPrompt(analysis);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an AI readiness consultant creating personalized PDF reports. Generate content that is professional, actionable, and honest. Be transparent about emerging standards vs proven techniques.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2500,
        response_format: { type: 'json_object' },
      }),
    });

    const data = await response.json();

    if (data.choices?.[0]?.message?.content) {
      let content = data.choices[0].message.content;
      // Remove markdown code blocks if present
      content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      try {
        const parsed = JSON.parse(content);
        return validateAndClean(parsed, analysis);
      } catch (parseError) {
        console.error('[PDF-CONTENT] Failed to parse LLM response:', parseError);
        return generateFallbackContent(analysis);
      }
    }

    return generateFallbackContent(analysis);
  } catch (error) {
    console.error('[PDF-CONTENT] LLM API error:', error);
    return generateFallbackContent(analysis);
  }
}

function buildPrompt(analysis: AnalysisData): string {
  // Collect all failing/warning checks for prioritization
  const issues = [
    ...analysis.checks
      .filter((c) => c.status !== 'pass')
      .map((c) => ({
        metric: c.label,
        score: c.score,
        status: c.status,
        details: c.details,
        recommendation: c.recommendation,
      })),
    ...(analysis.ai_insights || [])
      .filter((c) => c.status !== 'pass')
      .map((c) => ({
        metric: c.label,
        score: c.score,
        status: c.status,
        details: c.details,
        recommendation: c.recommendation,
      })),
  ];

  return `Generate personalized content for an AI Readiness PDF report.

WEBSITE ANALYZED:
- Domain: ${analysis.domain}
- URL: ${analysis.url}
- Title: ${analysis.metadata.title || 'Not found'}
- Description: ${analysis.metadata.description || 'Not found'}
- Overall Score: ${analysis.overall_score}/100
${analysis.enhanced_score ? `- Enhanced Score: ${analysis.enhanced_score}/100` : ''}

ISSUES FOUND (sorted by severity):
${JSON.stringify(issues.sort((a, b) => a.score - b.score), null, 2)}

PASSING CHECKS:
${analysis.checks
  .filter((c) => c.status === 'pass')
  .map((c) => `- ${c.label}: ${c.score}%`)
  .join('\n')}

Generate a JSON object with:

1. "executiveSummary": A 3-4 sentence personalized summary for stakeholders. Mention their specific domain. Highlight their top 2-3 issues and their score. Be professional but direct about what needs improvement.

2. "llmsTxtContent": Generate an llms.txt file content for their domain. Use this format:
# {domain}
> {one-line description based on their meta description or inferred from title}

## About
{2-3 sentences about what the site does}

## Key Pages
- [Homepage](/)
- [add 2-3 other likely pages based on site type]

## What We Offer
{brief list of likely offerings}

3. "prioritizedActions": An array of objects for their action roadmap. Order by: FAIL status first, then WARNING, then by lowest score. Each object has:
- "order": number (1-based)
- "metric": string (metric name)
- "action": string (specific action to take, 1-2 sentences)
- "why": string (why this matters for AI, 1 sentence)
- "difficulty": "Easy" | "Medium" | "Hard"
- "taskType": "Self-service" | "Developer"
- "isQuickWin": boolean (true if Easy + high impact)

Return ONLY valid JSON. Do not include markdown or explanation.`;
}

function validateAndClean(
  parsed: Record<string, unknown>,
  analysis: AnalysisData
): GeneratedContent {
  return {
    executiveSummary:
      typeof parsed.executiveSummary === 'string'
        ? parsed.executiveSummary
        : generateFallbackSummary(analysis),
    llmsTxtContent:
      typeof parsed.llmsTxtContent === 'string'
        ? parsed.llmsTxtContent
        : generateFallbackLlmsTxt(analysis),
    prioritizedActions: Array.isArray(parsed.prioritizedActions)
      ? (parsed.prioritizedActions as PrioritizedAction[])
      : generateFallbackActions(analysis),
  };
}

function generateFallbackContent(analysis: AnalysisData): GeneratedContent {
  return {
    executiveSummary: generateFallbackSummary(analysis),
    llmsTxtContent: generateFallbackLlmsTxt(analysis),
    prioritizedActions: generateFallbackActions(analysis),
  };
}

function generateFallbackSummary(analysis: AnalysisData): string {
  const failCount = analysis.checks.filter((c) => c.status === 'fail').length;
  const warningCount = analysis.checks.filter((c) => c.status === 'warning').length;

  if (analysis.overall_score >= 80) {
    return `${analysis.domain} demonstrates strong AI readiness with an overall score of ${analysis.overall_score}/100. The site follows most best practices for AI discovery and comprehension. Focus on the ${warningCount} minor improvements identified to achieve excellence.`;
  } else if (analysis.overall_score >= 60) {
    return `${analysis.domain} has a moderate AI readiness score of ${analysis.overall_score}/100. While the foundation is solid, there are ${failCount} critical issues and ${warningCount} warnings that should be addressed to improve AI visibility. This report provides a prioritized action plan.`;
  } else {
    return `${analysis.domain} requires significant improvements to be AI-ready, with a current score of ${analysis.overall_score}/100. There are ${failCount} critical issues preventing AI systems from properly discovering and understanding your content. Immediate action on the priorities below is recommended.`;
  }
}

function generateFallbackLlmsTxt(analysis: AnalysisData): string {
  const description = analysis.metadata.description || `Website at ${analysis.domain}`;
  const title = analysis.metadata.title || analysis.domain;

  return `# ${title}

> ${description}

## About
${title} provides information and services at ${analysis.domain}. Visit our website to learn more about what we offer.

## Key Pages
- [Homepage](/)
- [About](/about)
- [Contact](/contact)

## What We Offer
Visit ${analysis.domain} to explore our offerings.`;
}

function generateFallbackActions(analysis: AnalysisData): PrioritizedAction[] {
  const actions: PrioritizedAction[] = [];
  let order = 1;

  // Get all checks (basic + AI) with issues, sorted by score
  const allIssues = [
    ...analysis.checks.filter((c) => c.status !== 'pass'),
    ...(analysis.ai_insights || []).filter((c) => c.status !== 'pass'),
  ].sort((a, b) => {
    // Fail first, then warning
    if (a.status === 'fail' && b.status !== 'fail') return -1;
    if (b.status === 'fail' && a.status !== 'fail') return 1;
    // Then by score (lowest first)
    return a.score - b.score;
  });

  const difficultyMap: Record<string, 'Easy' | 'Medium' | 'Hard'> = {
    'llms-txt': 'Easy',
    'robots-txt': 'Easy',
    'meta-tags': 'Easy',
    sitemap: 'Medium',
    'heading-structure': 'Medium',
    readability: 'Medium',
    'semantic-html': 'Hard',
    accessibility: 'Medium',
  };

  const taskTypeMap: Record<string, 'Self-service' | 'Developer'> = {
    'llms-txt': 'Self-service',
    'robots-txt': 'Self-service',
    'meta-tags': 'Self-service',
    sitemap: 'Developer',
    'heading-structure': 'Self-service',
    readability: 'Self-service',
    'semantic-html': 'Developer',
    accessibility: 'Self-service',
  };

  for (const issue of allIssues.slice(0, 10)) {
    const difficulty = difficultyMap[issue.id] || 'Medium';
    actions.push({
      order: order++,
      metric: issue.label,
      action: issue.recommendation,
      why: `Currently scoring ${issue.score}%. Improving this will help AI systems better understand your content.`,
      difficulty,
      taskType: taskTypeMap[issue.id] || 'Developer',
      isQuickWin: difficulty === 'Easy' && issue.score < 50,
    });
  }

  return actions;
}
