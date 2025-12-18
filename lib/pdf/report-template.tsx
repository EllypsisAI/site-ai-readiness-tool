import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

// Types
interface CheckResult {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  details: string;
  recommendation: string;
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
}

interface ReportProps {
  analysis: AnalysisData;
  email: string;
}

// Color palette
const colors = {
  black: '#0D0D0D',
  white: '#FFFFFF',
  gray100: '#F5F5F5',
  gray200: '#E5E5E5',
  gray400: '#A3A3A3',
  gray600: '#525252',
  green: '#22C55E',
  yellow: '#EAB308',
  red: '#EF4444',
  accent: '#0D0D0D',
};

// Styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.white,
    padding: 40,
    fontFamily: 'Helvetica',
  },
  // Header
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: colors.black,
    paddingBottom: 20,
  },
  logo: {
    fontSize: 24,
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
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 28,
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
    marginBottom: 30,
    padding: 20,
    backgroundColor: colors.gray100,
    borderRadius: 8,
  },
  scoreCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.white,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.white,
  },
  scoreDetails: {
    flex: 1,
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 4,
  },
  scoreDescription: {
    fontSize: 11,
    color: colors.gray600,
    lineHeight: 1.4,
  },
  // Executive Summary
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: 12,
    marginTop: 20,
  },
  summaryBox: {
    padding: 16,
    backgroundColor: colors.gray100,
    borderRadius: 6,
    marginBottom: 20,
  },
  summaryText: {
    fontSize: 11,
    color: colors.gray600,
    lineHeight: 1.6,
  },
  // Metrics
  metricCard: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.black,
  },
  metricScore: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricDetails: {
    fontSize: 10,
    color: colors.gray600,
    marginBottom: 8,
    lineHeight: 1.4,
  },
  metricRecommendation: {
    fontSize: 10,
    color: colors.black,
    backgroundColor: colors.gray100,
    padding: 8,
    borderRadius: 4,
    lineHeight: 1.4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  // Action Items
  actionItem: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 4,
  },
  actionNumber: {
    width: 20,
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.black,
  },
  actionText: {
    flex: 1,
    fontSize: 10,
    color: colors.gray600,
    lineHeight: 1.4,
  },
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
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: colors.gray400,
  },
  // Page number
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 10,
    color: colors.gray400,
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

function getScoreSummary(score: number, domain: string): string {
  if (score >= 80) {
    return `${domain} is well-optimized for AI discovery. Your site follows best practices for semantic structure, metadata, and machine readability. Focus on the recommendations below to reach excellence.`;
  }
  if (score >= 60) {
    return `${domain} has a solid foundation but needs improvements. AI agents can find your site, but may struggle to understand your content fully. Address the high-priority items below.`;
  }
  if (score >= 40) {
    return `${domain} needs significant work to be AI-ready. Current issues may prevent AI agents from properly understanding and recommending your content. Follow the action plan below.`;
  }
  return `${domain} has critical AI readiness issues. AI agents may not be able to properly discover or understand your content. Immediate action is required on the items below.`;
}

function generateActionItems(checks: CheckResult[]): { priority: 'high' | 'medium' | 'low'; text: string }[] {
  const items: { priority: 'high' | 'medium' | 'low'; text: string; score: number }[] = [];

  for (const check of checks) {
    if (check.status === 'fail') {
      items.push({
        priority: 'high',
        text: `${check.label}: ${check.recommendation}`,
        score: check.score,
      });
    } else if (check.status === 'warning') {
      items.push({
        priority: 'medium',
        text: `${check.label}: ${check.recommendation}`,
        score: check.score,
      });
    } else if (check.score < 100) {
      items.push({
        priority: 'low',
        text: `${check.label}: ${check.recommendation}`,
        score: check.score,
      });
    }
  }

  // Sort by priority and score
  return items
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return a.score - b.score;
    })
    .map(({ priority, text }) => ({ priority, text }));
}

// PDF Document Component
export function AIReadinessReport({ analysis, email }: ReportProps) {
  const actionItems = generateActionItems(analysis.checks);
  const passedChecks = analysis.checks.filter(c => c.status === 'pass').length;
  const totalChecks = analysis.checks.length;

  return (
    <Document>
      {/* Page 1: Executive Summary */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>AI Readiness Report</Text>
          <Text style={styles.subtitle}>Powered by EllypsisAI</Text>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Website Analysis</Text>
          <Text style={styles.domainText}>{analysis.domain}</Text>
          <Text style={styles.dateText}>
            Generated on {new Date(analysis.metadata.analyzedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        {/* Overall Score */}
        <View style={styles.scoreSection}>
          <View style={[styles.scoreCircle, { backgroundColor: getScoreColor(analysis.overall_score) }]}>
            <Text style={styles.scoreNumber}>{analysis.overall_score}</Text>
            <Text style={styles.scoreLabel}>/ 100</Text>
          </View>
          <View style={styles.scoreDetails}>
            <Text style={styles.scoreTitle}>
              {getScoreGrade(analysis.overall_score)} AI Readiness
            </Text>
            <Text style={styles.scoreDescription}>
              {passedChecks} of {totalChecks} checks passed
            </Text>
          </View>
        </View>

        {/* Executive Summary */}
        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            {getScoreSummary(analysis.overall_score, analysis.domain)}
          </Text>
        </View>

        {/* Top Priority Actions */}
        <Text style={styles.sectionTitle}>Top Priority Actions</Text>
        {actionItems.slice(0, 5).map((item, index) => (
          <View key={index} style={styles.actionItem}>
            <Text style={styles.actionNumber}>{index + 1}.</Text>
            <Text style={styles.actionText}>
              <Text style={
                item.priority === 'high' ? styles.priorityHigh :
                item.priority === 'medium' ? styles.priorityMedium :
                styles.priorityLow
              }>
                [{item.priority.toUpperCase()}]
              </Text>
              {' '}{item.text}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Prepared for {email}</Text>
          <Text style={styles.footerText}>{analysis.url}</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>

      {/* Page 2: Detailed Metrics */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Detailed Metrics</Text>

        {analysis.checks.map((check, index) => (
          <View key={check.id} style={styles.metricCard} wrap={false}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>{check.label}</Text>
              <View style={styles.statusBadge}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: getScoreColor(check.score) }
                ]} />
                <Text style={[
                  styles.metricScore,
                  { color: getScoreColor(check.score) }
                ]}>
                  {check.score}%
                </Text>
              </View>
            </View>
            <Text style={styles.metricDetails}>{check.details}</Text>
            <Text style={styles.metricRecommendation}>
              Recommendation: {check.recommendation}
            </Text>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Prepared for {email}</Text>
          <Text style={styles.footerText}>{analysis.url}</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>

      {/* Page 3: Complete Action Plan */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.sectionTitle}>Complete Action Plan</Text>
        <Text style={[styles.summaryText, { marginBottom: 20 }]}>
          Below is your prioritized list of improvements. Work through these in order for maximum impact on your AI readiness score.
        </Text>

        {actionItems.map((item, index) => (
          <View key={index} style={styles.actionItem} wrap={false}>
            <Text style={styles.actionNumber}>{index + 1}.</Text>
            <Text style={styles.actionText}>
              <Text style={
                item.priority === 'high' ? styles.priorityHigh :
                item.priority === 'medium' ? styles.priorityMedium :
                styles.priorityLow
              }>
                [{item.priority.toUpperCase()}]
              </Text>
              {' '}{item.text}
            </Text>
          </View>
        ))}

        {actionItems.length === 0 && (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>
              Congratulations! Your site passed all checks. Continue monitoring your AI readiness as you make updates to your site.
            </Text>
          </View>
        )}

        {/* Next Steps */}
        <Text style={[styles.sectionTitle, { marginTop: 30 }]}>Next Steps</Text>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>
            1. Start with the HIGH priority items - these have the biggest impact.{'\n\n'}
            2. Re-run your analysis after making changes to track your progress.{'\n\n'}
            3. Share this report with your development team for implementation.{'\n\n'}
            4. Questions? Contact us at support@ellypsis.ai
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Prepared for {email}</Text>
          <Text style={styles.footerText}>{analysis.url}</Text>
        </View>

        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
          `${pageNumber} / ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
}
