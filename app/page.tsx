"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Import shared components
import { HeaderProvider } from "@/components/shared/header/HeaderContext";
import { TerminalInput } from "@/components/shared/terminal-input";

// Import hero section components
import HomeHero from "@/components/app/(home)/sections/hero/Hero";
import { Endpoint } from "@/components/shared/Playground/Context/types";
import ControlPanel from "@/components/app/(home)/sections/ai-readiness/ControlPanel";
import ScrollyJourney from "@/components/app/(home)/sections/scrolly/ScrollyJourney";

// Import header components
import HeaderBrandKit from "@/components/shared/header/BrandKit/BrandKit";
import HeaderWrapper from "@/components/shared/header/Wrapper/Wrapper";
import HeaderDropdownWrapper from "@/components/shared/header/Dropdown/Wrapper/Wrapper";
import GithubIcon from "@/components/shared/header/Github/_svg/GithubIcon";
import ButtonUI from "@/components/ui/shadcn/button";

export default function StyleGuidePage() {
  const [tab, setTab] = useState<Endpoint>(Endpoint.Scrape);
  const [url, setUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [hasOpenAIKey, setHasOpenAIKey] = useState(false);
  const [urlError, setUrlError] = useState<string>("");
  
  // Check for API keys on mount
  useEffect(() => {
    fetch('/api/check-config')
      .then(res => res.json())
      .then(data => {
        setHasOpenAIKey(data.hasOpenAIKey || false);
      })
      .catch(() => setHasOpenAIKey(false));
  }, []);
  
  const handleAnalysis = async () => {
    if (!url) return;
    
    // Auto-prepend https:// if no protocol is provided
    let processedUrl = url.trim();
    if (!processedUrl.match(/^https?:\/\//i)) {
      processedUrl = 'https://' + processedUrl;
    }
    
    // Validate URL format
    try {
      const urlObj = new URL(processedUrl);
      // Check if it's http or https
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        setUrlError('Please enter a valid URL (e.g., example.com)');
        return;
      }
    } catch (error) {
      // If URL constructor throws, it's not a valid URL
      setUrlError('Please enter a valid URL (e.g., example.com)');
      return;
    }
    
    setIsAnalyzing(true);
    setShowResults(false);
    setAnalysisData(null);
    
    try {
      // Start basic analysis
      const basicAnalysisPromise = fetch('/api/ai-readiness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: processedUrl }),
      });
      
      // Disable automatic AI analysis for now - user will click button
      let aiAnalysisPromise = null;
      
      // Wait for basic analysis
      const response = await basicAnalysisPromise;
      const data = await response.json();
      
      if (data.success) {
        setAnalysisData({
          ...data,
          aiAnalysisPromise: null, // No auto AI analysis
          hasOpenAIKey: false, // Disable auto AI
          autoStartAI: false // Don't auto-start
        });
        setIsAnalyzing(false);
        setShowResults(true);
      } else {
        console.error('Analysis failed:', data.error);
        setIsAnalyzing(false);
        alert('Failed to analyze website. Please check the URL and try again.');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setIsAnalyzing(false);
      alert('An error occurred while analyzing the website.');
    }
  };

  return (
    <HeaderProvider>
      <div className="min-h-screen bg-background-primary">
        {/* Header/Navigation Section */}
        <HeaderDropdownWrapper />

        <div className="sticky top-0 left-0 w-full z-[101] bg-background-primary/80 backdrop-blur-sm border-b border-border-subtle">
          <HeaderWrapper>
            <div className="max-w-6xl mx-auto w-full flex justify-between items-center px-6">
              <div className="flex gap-6 items-center">
                <Link href="/" className="font-mono text-lg font-bold text-accent-amber">
                  AiCanSee.me
                </Link>
              </div>

              <div className="flex gap-4">
                <Link href="/pricing" className="font-mono text-sm text-foreground-secondary hover:text-foreground-primary transition-colors">
                  Pricing
                </Link>
                <Link href="/docs" className="font-mono text-sm text-foreground-secondary hover:text-foreground-primary transition-colors">
                  Docs
                </Link>
              </div>
            </div>
          </HeaderWrapper>
        </div>

        {/* Hero Section */}
        <AnimatePresence mode="wait">
          {!isAnalyzing && !showResults ? (
            <motion.div
              key="hero"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <HomeHero />

              {/* Terminal Input Section */}
              <div className="relative -mt-12 pb-20 bg-background-primary">
                <div className="container mx-auto px-6 max-w-4xl">
                  <TerminalInput
                    onSubmit={async (submittedUrl) => {
                      setUrl(submittedUrl);
                      setUrlError("");

                      // Trigger analysis with the submitted URL
                      let processedUrl = submittedUrl.trim();
                      if (!processedUrl.match(/^https?:\/\//i)) {
                        processedUrl = 'https://' + processedUrl;
                      }

                      try {
                        const urlObj = new URL(processedUrl);
                        if (!['http:', 'https:'].includes(urlObj.protocol)) {
                          setUrlError('Please enter a valid URL (e.g., example.com)');
                          return;
                        }
                      } catch (error) {
                        setUrlError('Please enter a valid URL (e.g., example.com)');
                        return;
                      }

                      setIsAnalyzing(true);
                      setShowResults(false);
                      setAnalysisData(null);

                      try {
                        const response = await fetch('/api/ai-readiness', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ url: processedUrl }),
                        });

                        const data = await response.json();

                        if (data.success) {
                          setAnalysisData({
                            ...data,
                            aiAnalysisPromise: null,
                            hasOpenAIKey: false,
                            autoStartAI: false
                          });
                          setIsAnalyzing(false);
                          setShowResults(true);
                        } else {
                          console.error('Analysis failed:', data.error);
                          setIsAnalyzing(false);
                          setUrlError(data.error || 'Failed to analyze website. Please try again.');
                        }
                      } catch (error) {
                        console.error('Analysis error:', error);
                        setIsAnalyzing(false);
                        setUrlError('An error occurred while analyzing the website.');
                      }
                    }}
                    isLoading={isAnalyzing}
                    error={urlError || null}
                  />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="control-panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative pt-24 pb-12 bg-background-primary"
            >
              <div className="container mx-auto px-6 max-w-7xl">
                <ControlPanel
                    isAnalyzing={isAnalyzing}
                    showResults={showResults}
                    url={url}
                    analysisData={analysisData}
                    onReset={() => {
                      setIsAnalyzing(false);
                      setShowResults(false);
                      setAnalysisStep(0);
                      setAnalysisData(null);
                      setUrl("");
                    }}
                    onAIAnalysisComplete={(aiData) => {
                      // Update analysisData with AI insights
                      setAnalysisData((prev: any) => ({
                        ...prev,
                        aiInsights: aiData.aiInsights,
                        overallAIReadiness: aiData.overallAIReadiness,
                        topPriorities: aiData.topPriorities,
                        enhancedScore: aiData.enhancedScore,
                      }));
                    }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        {/* Scrolly Journey - Show after results */}
        {showResults && analysisData && (
          <ScrollyJourney
            analysisData={{
              id: analysisData.analysisId,
              url: analysisData.url,
              overallScore: analysisData.enhancedScore || analysisData.overallScore,
              checks: analysisData.checks,
              metadata: analysisData.metadata,
              // AI insights data for enhanced journey
              aiInsights: analysisData.aiInsights,
              overallAIReadiness: analysisData.overallAIReadiness,
              topPriorities: analysisData.topPriorities,
            }}
            onEmailCapture={(email) => {
              console.log('Email captured:', email);
            }}
            onCheckout={() => {
              console.log('Checkout initiated');
            }}
          />
        )}
      </div>
    </HeaderProvider>
  );
}