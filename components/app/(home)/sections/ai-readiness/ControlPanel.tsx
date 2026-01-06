"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  FileText,
  Code,
  Shield,
  Search,
  Zap,
  Database,
  Lock,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  Bot,
  Sparkles,
  FileCode,
  Network,
  Info,
  Eye
} from "lucide-react";
import { useEffect, useState } from "react";
import ScoreChart from "./ScoreChart";
import RadarChart from "./RadarChart";
import MetricBars from "./MetricBars";
import { MetricCard } from "@/components/shared/metric-card";
import { ScoreDisplay } from "@/components/shared/score-display";

interface ControlPanelProps {
  isAnalyzing: boolean;
  showResults: boolean;
  url: string;
  analysisData?: any;
  onReset: () => void;
  onAIAnalysisComplete?: (aiData: {
    aiInsights: any[];
    overallAIReadiness: string;
    topPriorities: string[];
    enhancedScore: number;
  }) => void;
}

interface CheckItem {
  id: string;
  label: string;
  description: string;
  icon: any;
  status: 'pending' | 'checking' | 'pass' | 'fail' | 'warning';
  score?: number;
  details?: string;
  recommendation?: string;
  actionItems?: string[];
  tooltip?: string;
}

export default function ControlPanel({
  isAnalyzing,
  showResults,
  url,
  analysisData,
  onReset,
  onAIAnalysisComplete,
}: ControlPanelProps) {
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);
  const [aiInsights, setAiInsights] = useState<CheckItem[]>([]);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [combinedChecks, setCombinedChecks] = useState<CheckItem[]>([]);
  const [checks, setChecks] = useState<CheckItem[]>([
    {
      id: 'heading-structure',
      label: 'Heading Hierarchy',
      description: 'H1-H6 structure',
      icon: FileText,
      status: 'pending',
    },
    {
      id: 'readability',
      label: 'Readability',
      description: 'Content clarity',
      icon: Globe,
      status: 'pending',
    },
    {
      id: 'meta-tags',
      label: 'Metadata Quality',
      description: 'Title, desc, author',
      icon: FileCode,
      status: 'pending',
    },
    {
      id: 'semantic-html',
      label: 'Semantic HTML',
      description: 'Proper HTML5 tags',
      icon: Code,
      status: 'pending',
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      description: 'Alt text & ARIA',
      icon: Eye,
      status: 'pending',
    },
    {
      id: 'llms-txt',
      label: 'LLMs.txt',
      description: 'AI permissions',
      icon: Bot,
      status: 'pending',
    },
    {
      id: 'robots-txt',
      label: 'Robots.txt',
      description: 'Crawler rules',
      icon: Shield,
      status: 'pending',
    },
    {
      id: 'sitemap',
      label: 'Sitemap',
      description: 'Site structure',
      icon: Network,
      status: 'pending',
    },
  ]);

  const [overallScore, setOverallScore] = useState(0);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(-1);
  const [selectedCheck, setSelectedCheck] = useState<string | null>(null);
  const [hoveredCheck, setHoveredCheck] = useState<string | null>(null);
  const [enhancedScore, setEnhancedScore] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'chart' | 'bars'>('grid');

  useEffect(() => {
    if (analysisData && analysisData.checks && showResults) {
      // Use real data from API
      const mappedChecks = analysisData.checks.map((check: any) => ({
        ...check,
        icon: checks.find(c => c.id === check.id)?.icon || FileText,
        description: check.details || checks.find(c => c.id === check.id)?.description,
      }));
      setChecks(mappedChecks);

      // Only reset combinedChecks if we don't already have AI insights
      // This prevents wiping out AI cards when onAIAnalysisComplete updates parent state
      setCombinedChecks(prev => {
        const hasAICards = prev.some(c => (c as any).isAI);
        if (hasAICards) {
          // Keep AI cards, but update basic checks in case scores changed
          const basicChecks = prev.filter(c => !(c as any).isAI);
          return [...mappedChecks, ...prev.filter(c => (c as any).isAI)];
        }
        return mappedChecks;
      });

      setOverallScore(analysisData.overallScore || 0);
      setCurrentCheckIndex(-1);
      
      // If AI analysis should auto-start, handle the promise
      if (analysisData.autoStartAI && analysisData.aiAnalysisPromise) {
        console.log('Auto-starting AI analysis with promise');
        setIsAnalyzingAI(true);
        setShowAIAnalysis(true);
        
        // Add placeholder AI tiles immediately with actual titles
        const placeholderAIChecks = [
          {
            id: 'ai-loading-0',
            label: 'Content Quality for AI',
            description: 'Analyzing content signal ratio...',
            icon: Sparkles,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          },
          {
            id: 'ai-loading-1',
            label: 'Information Architecture',
            description: 'Evaluating page structure...',
            icon: Bot,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          },
          {
            id: 'ai-loading-2',
            label: 'Crawlability Patterns',
            description: 'Checking JavaScript usage...',
            icon: Database,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          },
          {
            id: 'ai-loading-3',
            label: 'AI Training Value',
            description: 'Assessing training potential...',
            icon: Network,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          },
          {
            id: 'ai-loading-4',
            label: 'Knowledge Extraction',
            description: 'Analyzing entity definitions...',
            icon: FileCode,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          },
          {
            id: 'ai-loading-5',
            label: 'Template Quality',
            description: 'Reviewing semantic structure...',
            icon: Shield,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          },
          {
            id: 'ai-loading-6',
            label: 'Content Depth',
            description: 'Measuring content richness...',
            icon: Zap,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          },
          {
            id: 'ai-loading-7',
            label: 'Machine Readability',
            description: 'Testing extraction reliability...',
            icon: Globe,
            status: 'checking' as const,
            score: 0,
            isAI: true,
            isLoading: true
          }
        ];
        
        // Add loading AI tiles with staggered animation
        placeholderAIChecks.forEach((check, idx) => {
          setTimeout(() => {
            setCombinedChecks(prev => [...prev, check]);
          }, 100 * (idx + 1));
        });
        
        // Handle the AI analysis promise
        analysisData.aiAnalysisPromise
          .then(async (aiResponse: any) => {
            if (aiResponse) {
              const data = await aiResponse.json();
              if (data.success && data.insights) {
                // Convert AI insights to CheckItem format
                const aiChecks: CheckItem[] = data.insights.map((insight: any, idx: number) => ({
                  ...insight,
                  icon: [Sparkles, Bot, Database, Network, FileCode, Shield, Zap, Globe][idx % 8],
                  description: insight.details?.substring(0, 60) + '...' || 'AI Analysis',
                  isAI: true,
                }));
                
                setAiInsights(aiChecks);
                
                // Replace loading tiles with real AI tiles
                setCombinedChecks(prev => {
                  // Remove loading tiles
                  const withoutLoading = prev.filter(c => !(c as any).isLoading);
                  // Add real AI tiles
                  return [...withoutLoading, ...aiChecks];
                });
                
                // Calculate enhanced score
                if (data.insights.length > 0) {
                  const aiScores = data.insights.map((i: any) => i.score || 0);
                  const avgAiScore = aiScores.reduce((a: number, b: number) => a + b, 0) / aiScores.length;
                  const combinedScore = Math.round((overallScore * 0.6) + (avgAiScore * 0.4));
                  setEnhancedScore(combinedScore);
                }
              }
            }
          })
          .catch(error => {
            console.error('AI analysis error:', error);
            // Remove loading tiles on error
            setCombinedChecks(prev => prev.filter(c => !(c as any).isLoading));
          })
          .finally(() => {
            setIsAnalyzingAI(false);
          });
      }
    } else if (isAnalyzing) {
      // Reset all checks when starting analysis
      const resetChecks = checks.map(check => ({ ...check, status: 'pending' as const }));
      setChecks(resetChecks);
      setCombinedChecks(resetChecks); // Reset combined checks too
      setCurrentCheckIndex(0);
      setOverallScore(0);
      
      // Visual animation while waiting for real results
      const checkInterval = setInterval(() => {
        setCurrentCheckIndex(prev => {
          if (prev >= checks.length - 1) {
            clearInterval(checkInterval);
            return prev;
          }
          return prev + 1;
        });
      }, 200);

      return () => clearInterval(checkInterval);
    }
  }, [isAnalyzing, showResults, analysisData]);

  useEffect(() => {
    if (currentCheckIndex >= 0 && currentCheckIndex < checks.length && isAnalyzing) {
      // Mark current as checking during animation
      setChecks(prev => prev.map((check, index) => {
        if (index === currentCheckIndex) {
          return { ...check, status: 'checking' };
        }
        if (index < currentCheckIndex) {
          return { ...check, status: 'checking' };
        }
        return check;
      }));
      
      // Update combinedChecks to show the animation
      setCombinedChecks(prev => prev.map((check, index) => {
        if (index === currentCheckIndex) {
          return { ...check, status: 'checking' };
        }
        if (index < currentCheckIndex) {
          return { ...check, status: 'checking' };
        }
        return check;
      }));
    }
  }, [currentCheckIndex, checks.length, isAnalyzing]);

  const getStatusIcon = (status: CheckItem['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="w-16 h-16 text-heat-100 animate-spin" />;
      case 'pass':
        return <CheckCircle2 className="w-16 h-16 text-accent-black" />;
      case 'fail':
        return <XCircle className="w-16 h-16 text-heat-200" />;
      case 'warning':
        return <AlertCircle className="w-16 h-16 text-heat-100" />;
      default:
        return <div className="w-16 h-16 rounded-full border border-black-alpha-8" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-accent-black";
    if (score >= 60) return "text-accent-black";
    return "text-accent-black";
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[1200px] mx-auto"
    >
      {/* Header */}
      <motion.div 
        className="text-center mb-48 pt-24 md:pt-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-title-h2 text-accent-black mb-12">AI Readiness Analysis</h2>
        <p className="text-body-large text-black-alpha-64">Single-page snapshot of {url}</p>
        
        {showResults && (
          <>
            {/* View Mode Toggle - Moved above score */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-24 mb-20 flex justify-center gap-4"
            >
              <button
                onClick={() => setViewMode('grid')}
                className={`px-16 py-8 rounded-8 text-label-medium font-medium transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-accent-black text-white shadow-md' 
                    : 'bg-black-alpha-4 text-black-alpha-64 hover:bg-black-alpha-8'
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('chart')}
                className={`px-16 py-8 rounded-8 text-label-medium font-medium transition-all ${
                  viewMode === 'chart' 
                    ? 'bg-accent-black text-white shadow-md' 
                    : 'bg-black-alpha-4 text-black-alpha-64 hover:bg-black-alpha-8'
                }`}
              >
                Radar Chart
              </button>
              <button
                onClick={() => setViewMode('bars')}
                className={`px-16 py-8 rounded-8 text-label-medium font-medium transition-all ${
                  viewMode === 'bars' 
                    ? 'bg-accent-black text-white shadow-md' 
                    : 'bg-black-alpha-4 text-black-alpha-64 hover:bg-black-alpha-8'
                }`}
              >
                Bar Chart
              </button>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 }}
              className="flex justify-center"
            >
              <ScoreChart 
                score={enhancedScore > 0 ? enhancedScore : overallScore}
                enhanced={enhancedScore > 0}
                size={180}
              />
            </motion.div>
          </>
        )}
      </motion.div>

      {/* Score Display - Brutalist Style */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <ScoreDisplay
            score={enhancedScore > 0 ? enhancedScore : overallScore}
            totalChecks={combinedChecks.length}
            passedChecks={combinedChecks.filter(c => c.status === 'pass').length}
            warningChecks={combinedChecks.filter(c => c.status === 'warning').length}
            failedChecks={combinedChecks.filter(c => c.status === 'fail').length}
            url={url}
          />
        </motion.div>
      )}

      {/* Conditional rendering based on view mode */}
      {viewMode === 'grid' && (
        <div>
          {/* Section: Basic Checks */}
          {combinedChecks.filter(c => !(c as any).isAI).length > 0 && (
            <div className="mb-8">
              <h2 className="font-mono text-lg font-bold text-foreground-primary mb-4 uppercase tracking-wide">
                Basic Checks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {combinedChecks
                  .filter(c => !(c as any).isAI)
                  .map((check) => (
                    <MetricCard
                      key={check.id}
                      id={check.id}
                      label={check.label}
                      description={check.description || ''}
                      icon={check.icon}
                      status={check.status}
                      score={check.score}
                      details={check.details}
                      recommendation={check.recommendation}
                      actionItems={check.actionItems}
                      isAI={false}
                      onClick={() => {
                        if (check.status !== 'pending' && check.status !== 'checking') {
                          setSelectedCheck(selectedCheck === check.id ? null : check.id);
                        }
                      }}
                      isExpanded={selectedCheck === check.id}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Section: AI-Enhanced Checks */}
          {combinedChecks.filter(c => (c as any).isAI).length > 0 && (
            <div>
              <h2 className="font-mono text-lg font-bold text-foreground-primary mb-4 uppercase tracking-wide flex items-center gap-2">
                AI-Enhanced Checks
                <span className="text-xs font-normal text-accent-amber bg-accent-amber/10 px-2 py-0.5 rounded">
                  PREMIUM
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {combinedChecks
                  .filter(c => (c as any).isAI)
                  .map((check) => (
                    <MetricCard
                      key={check.id}
                      id={check.id}
                      label={check.label}
                      description={check.description || ''}
                      icon={check.icon}
                      status={check.status}
                      score={check.score}
                      details={check.details}
                      recommendation={check.recommendation}
                      actionItems={check.actionItems}
                      isAI={true}
                      onClick={() => {
                        if (check.status !== 'pending' && check.status !== 'checking') {
                          setSelectedCheck(selectedCheck === check.id ? null : check.id);
                        }
                      }}
                      isExpanded={selectedCheck === check.id}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Radar Chart View */}
      {viewMode === 'chart' && showResults && (
        <div>
          <motion.div 
            className="flex justify-center gap-40 mb-40"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Basic Analysis Chart */}
            <div className="flex flex-col items-center">
              <h3 className="text-label-large text-accent-black mb-16 font-medium">Basic Analysis</h3>
              <RadarChart 
                data={checks
                  .filter(check => check.status !== 'pending' && check.status !== 'checking')
                  .slice(0, 8)
                  .map(check => ({
                    label: check.label.length > 12 ? check.label.substring(0, 12) + '...' : check.label,
                    score: check.score || 0
                  }))}
                size={350}
              />
              <div className="mt-16 text-center">
                <div className="text-title-h3 text-accent-black">{overallScore}%</div>
                <div className="text-label-small text-black-alpha-48">Overall Score</div>
              </div>
            </div>
            
            {/* VS Indicator */}
            {aiInsights.length > 0 && (
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <div className="text-label-large text-black-alpha-32 font-medium">VS</div>
              </motion.div>
            )}
            
            {/* AI Analysis Chart - Only show if AI insights exist */}
            {aiInsights.length > 0 && (
              <motion.div 
                className="flex flex-col items-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-label-large text-heat-100 mb-16 font-medium">AI Enhanced Analysis</h3>
                <RadarChart 
                  data={aiInsights
                    .filter(check => check.status !== 'pending' && check.status !== 'checking')
                    .slice(0, 8)
                    .map(check => ({
                      label: check.label.length > 12 ? check.label.substring(0, 12) + '...' : check.label,
                      score: check.score || 0
                    }))}
                  size={350}
                />
                <div className="mt-16 text-center">
                  <div className="text-title-h3 text-heat-100">
                    {Math.round(aiInsights.reduce((sum, check) => sum + (check.score || 0), 0) / aiInsights.length)}%
                  </div>
                  <div className="text-label-small text-heat-100 opacity-60">AI Score</div>
                </div>
              </motion.div>
            )}
          </motion.div>
          
          {/* Comparison Summary */}
          {aiInsights.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-8 px-16 py-8 bg-heat-4 rounded-8">
                <span className="text-label-medium text-accent-black">
                  AI analysis found {aiInsights.filter(i => i.score && i.score < 50).length} additional areas for improvement
                </span>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* Bar Chart View */}
      {viewMode === 'bars' && showResults && (
        <motion.div 
          className="px-40 mb-40"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MetricBars 
            metrics={combinedChecks
              .filter(check => check.status !== 'pending' && check.status !== 'checking')
              .map(check => ({
                label: check.label,
                score: check.score || 0,
                status: check.status as 'pass' | 'warning' | 'fail',
                category: (check as any).isAI ? 'ai' : 
                  ['robots-txt', 'sitemap', 'llms-txt'].includes(check.id) ? 'domain' : 'page',
                details: check.details,
                recommendation: check.recommendation,
                actionItems: check.actionItems
              }))}
          />
        </motion.div>
      )}

      {/* Action Buttons */}
      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-12 justify-center"
        >
          <button
            onClick={onReset}
            className="px-20 py-10 bg-accent-white border border-black-alpha-8 hover:bg-black-alpha-4 rounded-8 text-label-medium transition-all"
          >
            Analyze Another Site
          </button>
          {true && ( 
            <button 
              onClick={async () => {
              setIsAnalyzingAI(true);
              setShowAIAnalysis(true);
              
              // Add placeholder AI tiles immediately with actual titles
              const placeholderAIChecks = [
                {
                  id: 'ai-loading-0',
                  label: 'Content Quality for AI',
                  description: 'Analyzing content signal ratio...',
                  icon: Sparkles,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                },
                {
                  id: 'ai-loading-1',
                  label: 'Information Architecture',
                  description: 'Evaluating page structure...',
                  icon: Bot,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                },
                {
                  id: 'ai-loading-2',
                  label: 'Crawlability Patterns',
                  description: 'Checking JavaScript usage...',
                  icon: Database,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                },
                {
                  id: 'ai-loading-3',
                  label: 'AI Training Value',
                  description: 'Assessing training potential...',
                  icon: Network,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                },
                {
                  id: 'ai-loading-4',
                  label: 'Knowledge Extraction',
                  description: 'Analyzing entity definitions...',
                  icon: FileCode,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                },
                {
                  id: 'ai-loading-5',
                  label: 'Template Quality',
                  description: 'Reviewing semantic structure...',
                  icon: Shield,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                },
                {
                  id: 'ai-loading-6',
                  label: 'Content Depth',
                  description: 'Measuring content richness...',
                  icon: Zap,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                },
                {
                  id: 'ai-loading-7',
                  label: 'Machine Readability',
                  description: 'Testing extraction reliability...',
                  icon: Globe,
                  status: 'checking' as const,
                  score: 0,
                  isAI: true,
                  isLoading: true
                }
              ];
              
              // Add loading AI tiles with staggered animation immediately
              placeholderAIChecks.forEach((check, idx) => {
                setTimeout(() => {
                  setCombinedChecks(prev => [...prev, check]);
                }, 100 * (idx + 1));
              });
              
              try {
                const response = await fetch('/api/ai-analysis', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    url,
                    htmlContent: analysisData?.htmlContent || '',
                    currentChecks: checks,
                    analysisId: analysisData?.analysisId // Pass analysisId to save to DB
                  })
                });

                const data = await response.json();
                if (data.success && data.insights) {
                  // Convert AI insights to CheckItem format with AI flag
                  const aiChecks: CheckItem[] = data.insights.map((insight: any, idx: number) => ({
                    ...insight,
                    icon: [Sparkles, Bot, Database, Network, FileCode, Shield, Zap, Globe][idx % 8],
                    description: insight.details?.substring(0, 60) + '...' || 'AI Analysis',
                    isAI: true, // Mark as AI-generated
                  }));

                  setAiInsights(aiChecks);

                  // Replace loading tiles with real AI tiles
                  setCombinedChecks(prev => {
                    // Remove loading tiles
                    const withoutLoading = prev.filter(c => !(c as any).isLoading);
                    // Add real AI tiles
                    return [...withoutLoading, ...aiChecks];
                  });

                  // Calculate enhanced score
                  let calculatedEnhancedScore = overallScore;
                  if (data.insights.length > 0) {
                    const aiScores = data.insights.map((i: any) => i.score || 0);
                    const avgAiScore = aiScores.reduce((a: number, b: number) => a + b, 0) / aiScores.length;
                    calculatedEnhancedScore = data.enhancedScore || Math.round((overallScore * 0.6) + (avgAiScore * 0.4));
                    setEnhancedScore(calculatedEnhancedScore);
                  }

                  // Notify parent component with AI analysis results
                  onAIAnalysisComplete?.({
                    aiInsights: data.insights,
                    overallAIReadiness: data.overallAIReadiness || '',
                    topPriorities: data.topPriorities || [],
                    enhancedScore: calculatedEnhancedScore,
                  });
                }
              } catch (error) {
                console.error('AI analysis error:', error);
                // Remove loading tiles on error
                setCombinedChecks(prev => prev.filter(c => !(c as any).isLoading));
              } finally {
                setIsAnalyzingAI(false);
              }
            }}
            disabled={isAnalyzingAI}
            className="px-20 py-10 bg-accent-black hover:bg-black-alpha-80 text-white rounded-8 text-label-medium transition-all disabled:opacity-50"
          >
              {isAnalyzingAI ? 'Analyzing...' : 'Analyze with AI'}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}