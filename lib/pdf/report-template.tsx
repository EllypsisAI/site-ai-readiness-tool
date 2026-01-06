import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import { metricGuides, structuredDataGuide, resources, improvementPrompts } from './static-content';
import type { GeneratedContent, PrioritizedAction } from './content-generator';

// Types
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
  enhanced_score?: number;
}

interface ReportProps {
  analysis: AnalysisData;
  email: string;
  generatedContent: GeneratedContent;
}

// Color palette
const colors = {
  black: '#0D0D0D',
  white: '#FFFFFF',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray300: '#D4D4D4',
  gray400: '#A3A3A3',
  gray600: '#525252',
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
  blue: '#3B82F6',
  accent: '#0D0D0D',
};

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 40,
    paddingBottom: 60,
    fontFamily: 'Helvetica',
  },
  // Header
  header: {
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
    paddingBottom: 16,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: colors.gray600,
  },
  // Title section
  titleSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
  },
  domainText: {
    fontSize: 14,
    color: colors.gray600,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 10,
    color: colors.gray400,
  },
  // Score section
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.gray100,
    borderRadius: 8,
  },
  scoreCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  scoreNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.white,
  },
  scoreLabel: {
    fontSize: 9,
    color: colors.white,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 10,
    color: colors.gray600,
    lineHeight: 1.4,
  },
  // Section titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
    marginTop: 16,
  },
  sectionSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 8,
    marginTop: 12,
  },
  // Summary box
  summaryBox: {
    padding: 14,
    backgroundColor: colors.gray100,
    borderRadius: 6,
    marginBottom: 16,
  },
  summaryText: {
    fontSize: 10,
    color: colors.gray600,
    lineHeight: 1.6,
  },
  // Metric cards
  metricCard: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.black,
  },
  metricScore: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  metricDetails: {
    fontSize: 9,
    color: colors.gray600,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  metricRecommendation: {
    fontSize: 9,
    color: colors.black,
    backgroundColor: colors.gray100,
    padding: 6,
    borderRadius: 4,
    lineHeight: 1.4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  // Action items
  actionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 4,
  },
  actionNumber: {
    width: 18,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.black,
  },
  actionText: {
    flex: 1,
    fontSize: 9,
    color: colors.gray600,
    lineHeight: 1.4,
  },
  // Priority badges
  priorityHigh: {
    color: colors.red,
    fontWeight: 'bold',
  },
  priorityMedium: {
    color: colors.yellow,
    fontWeight: 'bold',
  },
  priorityLow: {
    color: colors.green,
    fontWeight: 'bold',
  },
  // Roadmap action card
  roadmapCard: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    borderLeftWidth: 3,
  },
  roadmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roadmapOrder: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.black,
  },
  roadmapBadges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    fontSize: 7,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
    backgroundColor: colors.gray200,
    color: colors.gray600,
  },
  quickWinBadge: {
    backgroundColor: colors.green,
    color: colors.white,
  },
  roadmapMetric: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 2,
  },
  roadmapAction: {
    fontSize: 9,
    color: colors.gray600,
    lineHeight: 1.4,
    marginBottom: 2,
  },
  roadmapWhy: {
    fontSize: 8,
    color: colors.gray400,
    fontStyle: 'italic',
  },
  // Template/code boxes
  templateBox: {
    backgroundColor: colors.gray100,
    padding: 10,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 12,
  },
  templateText: {
    fontSize: 8,
    fontFamily: 'Courier',
    color: colors.black,
    lineHeight: 1.5,
  },
  // Guide sections
  guideSection: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 6,
  },
  guideLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.gray600,
    marginBottom: 2,
    marginTop: 6,
  },
  guideText: {
    fontSize: 9,
    color: colors.gray600,
    lineHeight: 1.5,
  },
  caveatBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  caveatText: {
    fontSize: 8,
    color: '#92400E',
    lineHeight: 1.4,
  },
  // Bullet list
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet: {
    width: 12,
    fontSize: 9,
    color: colors.gray600,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: colors.gray600,
    lineHeight: 1.4,
  },
  // Resources
  resourceCard: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: colors.gray100,
    borderRadius: 4,
  },
  resourceName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.blue,
    marginBottom: 2,
  },
  resourceDescription: {
    fontSize: 8,
    color: colors.gray600,
  },
  // Footer
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: colors.gray400,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: colors.gray400,
  },
  // Page break hint
  pageBreakHint: {
    marginTop: 20,
    fontSize: 8,
    color: colors.gray400,
    textAlign: 'center',
  },
});

// Helper functions
function getScoreColor(score: number): string {
  if (score >= 80) return colors.green;
  if (score >= 50) return colors.yellow;
  return colors.red;
}

function getScoreGrade(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 80) return 'Good';
  if (score >= 70) return 'Fair';
  if (score >= 50) return 'Needs Work';
  return 'Critical';
}

function getBorderColor(action: PrioritizedAction): string {
  if (action.isQuickWin) return colors.green;
  if (action.difficulty === 'Hard') return colors.red;
  if (action.difficulty === 'Medium') return colors.yellow;
  return colors.green;
}

// Page Header Component
function PageHeader({ title }: { title: string }) {
  return (
    <View style={styles.header}>
      <Text style={styles.logo}>AI Readiness Report</Text>
      <Text style={styles.subtitle}>{title} | Powered by EllypsisAI</Text>
    </View>
  );
}

// Page Footer Component
function PageFooter({ email, domain }: { email: string; domain: string }) {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Prepared for {email}</Text>
      <Text style={styles.footerText}>{domain}</Text>
    </View>
  );
}

// PDF Document Component
export function AIReadinessReport({ analysis, email, generatedContent }: ReportProps) {
  const passedChecks = analysis.checks.filter((c) => c.status === 'pass').length;
  const totalChecks = analysis.checks.length;
  const displayScore = analysis.enhanced_score || analysis.overall_score;

  // Get relevant metric guides based on failing/warning checks
  const relevantGuides = analysis.checks
    .filter((c) => c.status !== 'pass')
    .map((c) => metricGuides[c.id])
    .filter(Boolean);

  return (
    <Document>
      {/* ===== PAGE 1: EXECUTIVE SUMMARY ===== */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Executive Summary" />

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>AI Readiness Analysis</Text>
          <Text style={styles.domainText}>{analysis.domain}</Text>
          <Text style={styles.dateText}>
            Generated on{' '}
            {new Date(analysis.metadata.analyzedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Overall Score */}
        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, { backgroundColor: getScoreColor(displayScore) }]}>
            <Text style={styles.scoreNumber}>{displayScore}</Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreTitle}>{getScoreGrade(displayScore)} AI Readiness</Text>
            <Text style={styles.scoreDescription}>
              {passedChecks} of {totalChecks} basic checks passed
              {analysis.ai_insights &&
                ` | ${analysis.ai_insights.filter((c) => c.status === 'pass').length} of ${analysis.ai_insights.length} advanced checks passed`}
            </Text>
          </View>
        </View>

        {/* Executive Summary - LLM Generated */}
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>{generatedContent.executiveSummary}</Text>
        </View>

        {/* Top 3 Priorities */}
        <Text style={styles.sectionTitle}>Top 3 Priorities</Text>
        {generatedContent.prioritizedActions.slice(0, 3).map((action, index) => (
          <View key={index} style={styles.actionItem}>
            <Text style={styles.actionNumber}>{index + 1}.</Text>
            <Text style={styles.actionText}>
              <Text
                style={
                  action.difficulty === 'Hard'
                    ? styles.priorityHigh
                    : action.difficulty === 'Medium'
                      ? styles.priorityMedium
                      : styles.priorityLow
                }
              >
                [{action.difficulty.toUpperCase()}]
              </Text>{' '}
              <Text style={{ fontWeight: 'bold' }}>{action.metric}:</Text> {action.action}
            </Text>
          </View>
        ))}

        {/* Key Takeaways */}
        <Text style={styles.sectionTitle}>Key Takeaways for Your Team</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            {displayScore >= 80
              ? '• Your site is well-positioned for AI discovery. Focus on the minor improvements in this report to reach excellence.\n• Share the Implementation Guides section with your team for specific fixes.\n• Re-run your analysis after implementing changes to track progress.'
              : displayScore >= 50
                ? '• Address the high-priority items first - they have the biggest impact on AI visibility.\n• The Implementation Guides section provides templates and examples you can implement today.\n• Most fixes are straightforward and can be done without developer help.'
                : '• Immediate action is needed on the critical items in this report.\n• Start with the "Quick Wins" marked in the Action Roadmap - easy fixes with high impact.\n• Consider engaging a developer for the technical improvements marked as "Developer" tasks.'}
          </Text>
        </View>

        <PageFooter email={email} domain={analysis.domain} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* ===== PAGE 2-3: PRIORITIZED ACTION ROADMAP ===== */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Action Roadmap" />

        <Text style={styles.sectionTitle}>Prioritized Action Roadmap</Text>
        <Text style={[styles.summaryText, { marginBottom: 16 }]}>
          Actions are ordered by priority: critical issues first, then by impact. Quick wins are
          highlighted in green.
        </Text>

        {generatedContent.prioritizedActions.map((action, index) => (
          <View
            key={index}
            style={[styles.roadmapCard, { borderLeftColor: getBorderColor(action) }]}
            wrap={false}
          >
            <View style={styles.roadmapHeader}>
              <Text style={styles.roadmapOrder}>#{action.order}</Text>
              <View style={styles.roadmapBadges}>
                <Text style={styles.badge}>{action.difficulty}</Text>
                <Text style={styles.badge}>{action.taskType}</Text>
                {action.isQuickWin && (
                  <Text style={[styles.badge, styles.quickWinBadge]}>Quick Win</Text>
                )}
              </View>
            </View>
            <Text style={styles.roadmapMetric}>{action.metric}</Text>
            <Text style={styles.roadmapAction}>{action.action}</Text>
            <Text style={styles.roadmapWhy}>{action.why}</Text>
          </View>
        ))}

        <PageFooter email={email} domain={analysis.domain} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* ===== PAGE 4-5: IMPLEMENTATION GUIDES - LLMS.TXT & ROBOTS.TXT ===== */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Implementation Guides" />

        <Text style={styles.sectionTitle}>Implementation Guides</Text>
        <Text style={[styles.summaryText, { marginBottom: 16 }]}>
          Ready-to-use templates and guidance for improving your AI readiness. Copy and customize
          these for your site.
        </Text>

        {/* LLMs.txt Guide */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>1. LLMs.txt File</Text>

          <Text style={styles.guideLabel}>What It Is</Text>
          <Text style={styles.guideText}>{metricGuides['llms-txt'].whatItIs}</Text>

          <Text style={styles.guideLabel}>Why It Matters</Text>
          <Text style={styles.guideText}>{metricGuides['llms-txt'].whyItMatters}</Text>

          <View style={styles.caveatBox}>
            <Text style={styles.caveatText}>{metricGuides['llms-txt'].caveat}</Text>
          </View>

          <Text style={styles.guideLabel}>Your llms.txt (Generated)</Text>
          <View style={styles.templateBox}>
            <Text style={styles.templateText}>{generatedContent.llmsTxtContent}</Text>
          </View>

          <Text style={styles.guideLabel}>How to Implement</Text>
          {metricGuides['llms-txt'].howToFix.map((step, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Robots.txt Guide */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>2. Robots.txt Configuration</Text>

          <Text style={styles.guideLabel}>What It Is</Text>
          <Text style={styles.guideText}>{metricGuides['robots-txt'].whatItIs}</Text>

          <Text style={styles.guideLabel}>Why It Matters</Text>
          <Text style={styles.guideText}>{metricGuides['robots-txt'].whyItMatters}</Text>

          <Text style={styles.guideLabel}>Recommended Template</Text>
          <View style={styles.templateBox}>
            <Text style={styles.templateText}>
              {metricGuides['robots-txt'].template?.replace('{domain}', analysis.domain)}
            </Text>
          </View>
        </View>

        <PageFooter email={email} domain={analysis.domain} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* ===== PAGE 6: IMPLEMENTATION GUIDES - META TAGS & HEADINGS ===== */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Implementation Guides" />

        {/* Meta Tags Guide */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>3. Meta Tags</Text>

          <Text style={styles.guideLabel}>Why It Matters</Text>
          <Text style={styles.guideText}>{metricGuides['meta-tags'].whyItMatters}</Text>

          <Text style={styles.guideLabel}>How to Improve</Text>
          {metricGuides['meta-tags'].howToFix.map((step, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{step}</Text>
            </View>
          ))}

          <Text style={styles.guideLabel}>Self-Improvement Prompt</Text>
          <View style={styles.templateBox}>
            <Text style={styles.templateText}>{improvementPrompts.metaDescription}</Text>
          </View>
        </View>

        {/* Heading Structure Guide */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>4. Heading Structure</Text>

          <Text style={styles.guideLabel}>Why It Matters</Text>
          <Text style={styles.guideText}>{metricGuides['heading-structure'].whyItMatters}</Text>

          <Text style={styles.guideLabel}>Best Practices</Text>
          {metricGuides['heading-structure'].howToFix.map((step, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Readability Guide */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>5. Content Readability</Text>

          <Text style={styles.guideLabel}>Why It Matters</Text>
          <Text style={styles.guideText}>{metricGuides['readability'].whyItMatters}</Text>

          <Text style={styles.guideLabel}>Self-Improvement Prompt</Text>
          <View style={styles.templateBox}>
            <Text style={styles.templateText}>{improvementPrompts.contentReadability}</Text>
          </View>
        </View>

        <PageFooter email={email} domain={analysis.domain} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* ===== PAGE 7: IMPLEMENTATION GUIDES - SEMANTIC HTML & ACCESSIBILITY ===== */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Implementation Guides" />

        {/* Semantic HTML Guide */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>6. Semantic HTML</Text>

          <Text style={styles.guideLabel}>Why It Matters</Text>
          <Text style={styles.guideText}>{metricGuides['semantic-html'].whyItMatters}</Text>

          <Text style={styles.guideLabel}>Key Elements to Use</Text>
          {metricGuides['semantic-html'].howToFix.map((step, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Accessibility Guide */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>7. Accessibility (Alt Text)</Text>

          <Text style={styles.guideLabel}>Why It Matters</Text>
          <Text style={styles.guideText}>{metricGuides['accessibility'].whyItMatters}</Text>

          <Text style={styles.guideLabel}>How to Improve</Text>
          {metricGuides['accessibility'].howToFix.map((step, i) => (
            <View key={i} style={styles.bulletItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>{step}</Text>
            </View>
          ))}

          <Text style={styles.guideLabel}>Alt Text Prompt</Text>
          <View style={styles.templateBox}>
            <Text style={styles.templateText}>{improvementPrompts.altText}</Text>
          </View>
        </View>

        {/* Structured Data */}
        <View style={styles.guideSection} wrap={false}>
          <Text style={styles.guideTitle}>8. Structured Data (JSON-LD)</Text>

          <Text style={styles.guideLabel}>Important Caveat</Text>
          <View style={styles.caveatBox}>
            <Text style={styles.caveatText}>{structuredDataGuide.whyItMatters}</Text>
          </View>

          <Text style={styles.guideLabel}>Organization Schema Template</Text>
          <View style={styles.templateBox}>
            <Text style={styles.templateText}>
              {structuredDataGuide.templates.organization
                .replace(/{domain}/g, analysis.domain)
                .replace(/{name}/g, analysis.metadata.title || analysis.domain)
                .replace(
                  /{description}/g,
                  analysis.metadata.description || 'Website description'
                )}
            </Text>
          </View>
        </View>

        <PageFooter email={email} domain={analysis.domain} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* ===== PAGE 8-9: FULL ANALYSIS DETAILS ===== */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Analysis Details" />

        <Text style={styles.sectionTitle}>Basic Checks ({analysis.checks.length} metrics)</Text>

        {analysis.checks.map((check) => (
          <View key={check.id} style={styles.metricCard} wrap={false}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{check.label}</Text>
              <View style={styles.statusBadge}>
                <View style={[styles.statusDot, { backgroundColor: getScoreColor(check.score) }]} />
                <Text style={[styles.metricScore, { color: getScoreColor(check.score) }]}>
                  {check.score}%
                </Text>
              </View>
            </View>
            <Text style={styles.metricDetails}>{check.details}</Text>
            <Text style={styles.metricRecommendation}>Recommendation: {check.recommendation}</Text>
          </View>
        ))}

        {analysis.ai_insights && analysis.ai_insights.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              AI Insights ({analysis.ai_insights.length} advanced checks)
            </Text>

            {analysis.ai_insights.map((insight) => (
              <View key={insight.id} style={styles.metricCard} wrap={false}>
                <View style={styles.metricHeader}>
                  <Text style={styles.metricLabel}>{insight.label}</Text>
                  <View style={styles.statusBadge}>
                    <View
                      style={[styles.statusDot, { backgroundColor: getScoreColor(insight.score) }]}
                    />
                    <Text style={[styles.metricScore, { color: getScoreColor(insight.score) }]}>
                      {insight.score}%
                    </Text>
                  </View>
                </View>
                <Text style={styles.metricDetails}>{insight.details}</Text>
                {insight.actionItems && insight.actionItems.length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    <Text style={[styles.guideLabel, { marginTop: 0 }]}>Action Items:</Text>
                    {insight.actionItems.slice(0, 3).map((item, i) => (
                      <View key={i} style={styles.bulletItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.bulletText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </>
        )}

        <PageFooter email={email} domain={analysis.domain} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* ===== PAGE 10: RESOURCES ===== */}
      <Page size="A4" style={styles.page}>
        <PageHeader title="Resources" />

        <Text style={styles.sectionTitle}>Recommended Tools</Text>
        {resources.tools.map((tool, i) => (
          <View key={i} style={styles.resourceCard}>
            <Link src={tool.url}>
              <Text style={styles.resourceName}>{tool.name}</Text>
            </Link>
            <Text style={styles.resourceDescription}>{tool.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Documentation & Standards</Text>
        {resources.documentation.map((doc, i) => (
          <View key={i} style={styles.resourceCard}>
            <Link src={doc.url}>
              <Text style={styles.resourceName}>{doc.name}</Text>
            </Link>
            <Text style={styles.resourceDescription}>{doc.description}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Next Steps</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            1. Start with the Quick Wins in your Action Roadmap - easy fixes with high impact.
            {'\n\n'}
            2. Use the templates in this report to implement llms.txt and robots.txt.
            {'\n\n'}
            3. Re-run your analysis after making changes to track your progress.
            {'\n\n'}
            4. Share this report with your development team for technical implementations.
            {'\n\n'}
            Questions? Contact us at support@ellypsis.ai
          </Text>
        </View>

        <View style={[styles.summaryBox, { backgroundColor: colors.gray200, marginTop: 20 }]}>
          <Text style={[styles.summaryText, { textAlign: 'center' }]}>
            Thank you for using the AI Readiness Tool.
            {'\n'}
            Your journey to AI visibility starts here.
          </Text>
        </View>

        <PageFooter email={email} domain={analysis.domain} />
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}
