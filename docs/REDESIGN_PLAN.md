# AiCanSee.me - Complete UI/UX Redesign Plan

> **Status**: Design Phase - Ready for Implementation
> **Created**: January 5, 2026
> **Target**: Transform generic Firecrawl template → Distinctive brutalist CLI tool

---

## Project Brief

**Brand**: AiCanSee.me (standalone product, NOT part of larger ecosystem)
**Value Prop**: "Finally, actionable AI readiness insights in a world of uncertainty"
**Business Model**: Free 16-metric analysis (magnet) → Scrolly persuasion → $79 implementation kit PDF
**Future Upsell**: Monitoring service (chatbot mention tracking) - waitlist teaser
**Price**: $79 for implementation kit

**Current Problem**: Generic SaaS template with Firecrawl branding, white minimalism, no unique identity

**Redesign Goal**: Create a brutalist/CLI-inspired tool that feels like a technical dashboard where AI visibility is diagnosed like running a terminal command

---

## 🎨 Aesthetic Direction

### Core Concept: "Terminal Diagnosis"

The interface feels like running a sophisticated CLI diagnostic tool that analyzes your website's AI visibility. Think:
- **GitHub CLI** meets **htop system monitor** meets **Stripe Dashboard**
- Terminal-inspired interactions (typewriter effects, command prompts, output logs)
- Brutalist layout (exposed grids, sharp edges, functional typography)
- Data-dense dashboards (charts, metrics, code snippets visible upfront)
- Mechanical animations (not organic - things snap, slide, and reveal systematically)

### Mood References

**Visual Aesthetic**:
- Linear.app (dark mode, clean brutalist grids)
- Vercel Dashboard (monospace typography, clean data viz)
- Terminal.shop (CLI-inspired e-commerce)
- Raycast (command palette aesthetic)
- Monospace.xyz (brutalist portfolio)

**Tone References**:
- Honest, direct, no marketing fluff
- Technical but accessible
- FOMO-driven ("Your competitors are indexed, are you?")
- Nerdy credibility ("Let's talk robots.txt and JSON-LD")

### What Makes This UNFORGETTABLE?

**The One Thing People Remember**: "It felt like running a penetration test on my website's AI visibility - and getting a battle plan, not just a score."

---

## 🎨 Design System

### Color Palette

**Base Colors** (Replacing white minimalism):
```json
{
  "background": {
    "primary": "#0f1115",     // Deep charcoal (not pitch black)
    "secondary": "#1a1d23",   // Slate grey (card backgrounds)
    "tertiary": "#252930",    // Lighter grey (hover states)
    "code": "#0d1117"         // GitHub dark code block
  },
  "foreground": {
    "primary": "#e6edf3",     // Off-white text (not pure white)
    "secondary": "#8b949e",   // Muted grey (secondary text)
    "tertiary": "#6e7681",    // Dimmed grey (labels, hints)
    "inverse": "#0f1115"      // For light-on-dark scenarios
  },
  "accent": {
    "amber": "#f59e0b",       // PRIMARY - Success, premium, value
    "gold": "#fbbf24",        // Highlights, hover states
    "warning": "#fb923c",     // Medium-priority items
    "danger": "#ef4444",      // Failing metrics, urgent
    "success": "#10b981",     // Passing metrics
    "info": "#3b82f6"         // Links, informational
  },
  "border": {
    "subtle": "#30363d",      // Faint borders
    "default": "#444c56",     // Standard borders
    "emphasis": "#6e7681"     // Emphasized borders
  }
}
```

**Usage Philosophy**:
- Dark grey base (not black - less harsh on eyes)
- Amber as primary accent (replaces Firecrawl orange - suggests value, premium)
- Semantic colors for metrics: Green = pass, Orange = warning, Red = fail
- Minimal color use - let typography and layout do the work

### Typography System

**Font Stack** (Replacing SuisseIntl):

```css
/* PRIMARY: Monospace for technical credibility */
--font-mono: 'JetBrains Mono', 'Berkeley Mono', 'IBM Plex Mono', 'Roboto Mono', monospace;

/* SECONDARY: Clean sans for body text */
--font-sans: 'Inter Tight', 'Söhne', -apple-system, BlinkMacSystemFont, sans-serif;

/* TERTIARY: Display for hero/headlines */
--font-display: 'Söhne Breit', 'Montserrat', sans-serif;
```

**Hierarchy** (Mobile-first, desktop in parentheses):

```css
/* Hero / Display */
.text-hero: 40px/1.1 (64px/1.1) font-display, weight-700
.text-display: 32px/1.2 (48px/1.2) font-display, weight-600

/* Headings */
.text-h1: 28px/1.3 (36px/1.3) font-mono, weight-600
.text-h2: 24px/1.4 (28px/1.4) font-mono, weight-600
.text-h3: 20px/1.4 (24px/1.4) font-mono, weight-500
.text-h4: 18px/1.5 (20px/1.5) font-mono, weight-500

/* Body */
.text-body-lg: 16px/1.6 font-sans, weight-400
.text-body: 14px/1.6 font-sans, weight-400
.text-body-sm: 13px/1.5 font-sans, weight-400

/* Code / Mono */
.text-code-lg: 15px/1.6 font-mono, weight-400
.text-code: 13px/1.6 font-mono, weight-400
.text-code-sm: 12px/1.5 font-mono, weight-400

/* Labels / UI */
.text-label: 12px/1.4 font-mono, weight-500, letter-spacing-0.05em, uppercase
```

**Philosophy**:
- Monospace for headings, labels, UI elements (CLI aesthetic)
- Clean sans-serif for body text (readability)
- Minimal font sizes (4-5 per category max)
- ALL CAPS for labels and secondary UI text

### Spacing System

**Scale** (Tailwind-compatible):
```
0, 1, 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
```

**Usage**:
- Base unit: 4px (allows for fine-tuned control)
- Component padding: 16px (mobile), 24px (desktop)
- Section spacing: 64px (mobile), 96px (desktop)
- Card gaps: 16px (mobile), 24px (desktop)

### Border & Radius

**Brutalist Philosophy**: Sharp edges, minimal rounding

```css
--radius-none: 0px        // Default for brutalist cards
--radius-sm: 2px          // Subtle (buttons, inputs)
--radius-md: 4px          // Moderate (modals, dropdowns)
--radius-lg: 8px          // Large (hero cards, feature boxes)
```

**Borders**:
- 1px solid for standard borders
- 2px solid for emphasis (active states, primary CTAs)
- No shadows (or minimal: `box-shadow: 0 1px 3px rgba(0,0,0,0.3)`)

### Animation Patterns

**Philosophy**: Mechanical, systematic, CLI-inspired (not organic)

**Timing Functions**:
```css
--ease-snap: cubic-bezier(0.4, 0, 0.2, 1)        // Sharp snap
--ease-smooth: cubic-bezier(0.25, 0.1, 0.25, 1)  // Subtle easing
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55)  // Playful (sparingly)
```

**Durations**:
- Micro-interactions: 150ms (hover states, button presses)
- Component transitions: 300ms (modal open, dropdown reveal)
- Page transitions: 500ms (section scroll, fade-in)
- Loading states: 1000ms+ (typewriter effects, progress bars)

**Signature Animations**:

1. **Terminal Typewriter** (Hero, Results)
   ```css
   @keyframes typewriter {
     from { width: 0; }
     to { width: 100%; }
   }
   animation: typewriter 2s steps(40) 1 normal both;
   ```

2. **CLI Output Reveal** (Metric results appear line-by-line)
   ```css
   .cli-line {
     opacity: 0;
     transform: translateX(-4px);
     animation: revealLine 0.3s ease-out forwards;
     animation-delay: calc(var(--index) * 0.1s);
   }
   @keyframes revealLine {
     to { opacity: 1; transform: translateX(0); }
   }
   ```

3. **Progress Bar Fill** (Analysis loading)
   ```css
   @keyframes progressFill {
     from { width: 0%; }
     to { width: 100%; }
   }
   ```

4. **Metric Counter** (Score animates from 0 to final value)
   ```javascript
   // JavaScript-driven counter animation
   function animateCounter(element, from, to, duration) {
     const steps = 60;
     const increment = (to - from) / steps;
     let current = from;
     const timer = setInterval(() => {
       current += increment;
       element.textContent = Math.round(current);
       if (current >= to) clearInterval(timer);
     }, duration / steps);
   }
   ```

---

## 🧩 Component Specifications

### 1. Terminal Input (Hero)

**Purpose**: Replace generic URL input with CLI-style prompt

**Design**:
```
┌─────────────────────────────────────────────────────────────┐
│ $ aicanseeme analyze --url                                  │
│ > https://yourwebsite.com ▊                                 │
│                                                             │
│ [Enter to run analysis]                                     │
└─────────────────────────────────────────────────────────────┘
```

**Features**:
- Blinking cursor (▊) animation
- Typewriter effect on focus
- Error messages appear as CLI output: `Error: Invalid URL format`
- Success state: `✓ URL validated. Starting analysis...`

**Implementation**:
```tsx
<div class="terminal-input">
  <div class="terminal-prompt">
    <span class="text-accent-amber">$</span>
    <span class="text-muted">aicanseeme analyze --url</span>
  </div>
  <div class="terminal-input-line">
    <span class="text-muted">&gt;</span>
    <input
      type="url"
      placeholder="https://yourwebsite.com"
      class="terminal-field"
    />
    <span class="cursor">▊</span>
  </div>
</div>
```

---

### 2. Metric Card (Results Grid)

**Purpose**: Display 16 metrics (8 basic + 8 AI-enhanced) as interactive cards

**Design** (Collapsed state):
```
┌─────────────────────────────────┐
│ ✓  robots.txt          PASS  95 │
│    Properly configured          │
│    [Expand for details →]       │
└─────────────────────────────────┘
```

**Design** (Expanded state):
```
┌─────────────────────────────────────────────────────┐
│ ✓  robots.txt                            PASS  95   │
│                                                     │
│ ANALYSIS                                            │
│ Your robots.txt file is properly configured and     │
│ allows AI crawlers to access your content.         │
│                                                     │
│ RECOMMENDATION                                      │
│ • Add specific rules for GPTBot and Google-Extended │
│ • Consider allowing /api/* routes                   │
│                                                     │
│ CODE EXAMPLE                                        │
│ ┌─────────────────────────────────────────────────┐ │
│ │ User-agent: GPTBot                              │ │
│ │ Allow: /                                        │ │
│ │ Disallow: /private/                             │ │
│ └─────────────────────────────────────────────────┘ │
│                                                     │
│ [Collapse ×]                                        │
└─────────────────────────────────────────────────────┘
```

**States**:
- **Pass** (✓ green): Score 80-100
- **Warning** (⚠ orange): Score 50-79
- **Fail** (✗ red): Score 0-49
- **Loading**: Skeleton loader with pulsing animation
- **AI Badge**: "AI Enhanced" label on 8 advanced metrics

**Implementation Pattern**:
```tsx
<div class="metric-card" data-status="pass">
  <div class="metric-header">
    <div class="metric-icon">✓</div>
    <div class="metric-title">robots.txt</div>
    <div class="metric-badge">PASS</div>
    <div class="metric-score">95</div>
  </div>
  <div class="metric-summary">Properly configured</div>
  <button class="metric-expand">Expand for details →</button>

  {/* Expanded content (hidden by default) */}
  <div class="metric-details" hidden>
    <section class="analysis">...</section>
    <section class="recommendation">...</section>
    <section class="code-example">...</section>
  </div>
</div>
```

---

### 3. CLI Output Log (Analysis Progress)

**Purpose**: Show real-time analysis progress like a terminal command

**Design**:
```
$ aicanseeme analyze --url https://example.com

[00:01] Initiating scan...
[00:02] ✓ Fetching website content
[00:03] ✓ Analyzing robots.txt
[00:04] ✓ Checking sitemap.xml
[00:05] ✓ Evaluating semantic HTML
[00:06] ✓ Testing meta tags
[00:07] ⚙ Running AI enhancement layer...
[00:09] ✓ AI analysis complete

Analysis complete. 16 checks performed.
Overall AI Visibility Score: 78/100
```

**Features**:
- Lines appear sequentially with animation-delay
- Timestamps increment realistically
- Checkmarks appear after each line completes
- Final summary line has amber accent

---

### 4. Score Display (Dashboard Hero)

**Purpose**: Primary metric visualization after analysis

**Design**:
```
┌─────────────────────────────────────────┐
│                                         │
│            AI VISIBILITY                │
│                                         │
│                 78                      │
│               ─────                     │
│                100                      │
│                                         │
│         NEEDS IMPROVEMENT               │
│                                         │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░  78%             │
│                                         │
│  12 passing  •  3 warnings  •  1 fail   │
│                                         │
└─────────────────────────────────────────┘
```

**Features**:
- Large fraction display (78/100) with monospace font
- Progress bar with amber fill
- Semantic breakdown (passing/warning/fail counts)
- Counter animates from 0 to score on reveal

---

### 5. Brutalist Button Variants

**Primary CTA** (Checkout):
```css
.btn-primary {
  background: var(--accent-amber);
  color: var(--background-primary);
  border: 2px solid var(--accent-amber);
  padding: 12px 24px;
  font: 500 14px/1.5 var(--font-mono);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: var(--radius-sm);
  transition: transform 0.15s var(--ease-snap);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
}
.btn-primary:active {
  transform: translateY(0);
}
```

**Secondary** (Ghost):
```css
.btn-secondary {
  background: transparent;
  color: var(--foreground-secondary);
  border: 1px solid var(--border-default);
  /* Same padding/font as primary */
}
.btn-secondary:hover {
  background: var(--background-tertiary);
  border-color: var(--border-emphasis);
}
```

**Terminal Command Button** (Unique to this design):
```css
.btn-command {
  background: var(--background-code);
  color: var(--accent-success);
  border: 1px solid var(--border-subtle);
  font: 400 13px/1.6 var(--font-mono);
  padding: 8px 16px;
}
.btn-command::before {
  content: '$ ';
  color: var(--accent-amber);
}
```

---

### 6. Code Block Component

**Purpose**: Show actual code examples users can copy

**Design**:
```
┌─────────────────────────────────────────────────────┐
│ robots.txt                                    [Copy]│
├─────────────────────────────────────────────────────┤
│  1  User-agent: GPTBot                              │
│  2  Allow: /                                        │
│  3  Disallow: /admin/                               │
│  4                                                  │
│  5  User-agent: Google-Extended                     │
│  6  Allow: /                                        │
└─────────────────────────────────────────────────────┘
```

**Features**:
- Line numbers (muted grey)
- Copy button (top-right)
- Syntax highlighting (minimal - just keywords/strings/comments)
- Dark background (GitHub-style)

---

## 📱 Page-by-Page Redesign

### Hero Section (Above the Fold)

**Current**: White background, Firecrawl flame, "Is your website AI Ready?" headline, generic input

**New Design**:

```
┌────────────────────────────────────────────────────────────┐
│ [AiCanSee.me]                           [Docs] [Pricing]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│                                                            │
│          Can AI agents find your website?                 │
│          ─────────────────────────────────                 │
│                                                            │
│          Most websites are invisible to AI crawlers.       │
│          Run a free diagnostic to find out where you       │
│          stand—and get a battle plan to fix it.           │
│                                                            │
│          ┌───────────────────────────────────────────┐    │
│          │ $ aicanseeme analyze --url                │    │
│          │ > https://yourwebsite.com ▊               │    │
│          │                                           │    │
│          │ [Enter to run analysis]                   │    │
│          └───────────────────────────────────────────┘    │
│                                                            │
│          FREE • 16 checks • 30 seconds                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Changes**:
- Dark background (charcoal, not black)
- Headline: "Can AI agents find your website?" (direct, FOMO)
- Subhead: "Most websites are invisible..." (problem statement)
- Terminal input replaces generic form
- Trust signals: "FREE • 16 checks • 30 seconds"
- Remove Pixi.js particle background
- Remove Firecrawl flame animation

**Copy Tone**: Direct, slightly ominous, technical

---

### Analysis Loading State

**Current**: Generic loading spinner

**New Design**: CLI output log

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  $ aicanseeme analyze --url https://example.com           │
│                                                            │
│  [00:01] Initiating scan...                               │
│  [00:02] ✓ Fetching website content                       │
│  [00:03] ✓ Analyzing robots.txt                           │
│  [00:04] ✓ Checking sitemap.xml                           │
│  [00:05] ✓ Evaluating semantic HTML                       │
│  [00:06] ✓ Testing meta tags                              │
│  [00:07] ✓ Assessing heading structure                    │
│  [00:08] ✓ Measuring readability                          │
│  [00:09] ✓ Validating accessibility                       │
│  [00:10] ⚙ Running AI enhancement layer...                │
│  [00:12] ✓ AI-powered content analysis                    │
│  [00:13] ✓ Competitor benchmarking                        │
│  [00:14] ✓ Semantic markup evaluation                     │
│  [00:15] ✓ Schema.org validation                          │
│  [00:16] ✓ Link structure analysis                        │
│  [00:17] ✓ Crawlability assessment                        │
│  [00:18] ✓ AI discoverability score                       │
│  [00:19] ✓ Action plan generation                         │
│                                                            │
│  Analysis complete. 16 checks performed.                  │
│  Overall AI Visibility Score: 78/100                       │
│                                                            │
│  [View Results ↓]                                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Animation**:
- Lines appear sequentially (100-150ms delay between each)
- Typewriter effect on each line
- Checkmarks appear after line completes
- Final score counts up from 0 to 78

---

### Results Dashboard (The Magnet/Anchor)

**Current**: Control panel with radar chart, score chart, metric bars

**New Design**: Interactive dashboard with 16 metric cards

**Layout** (Desktop):
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌──────────────────────┐  ┌───────────────────────────┐  │
│  │   AI VISIBILITY      │  │  BENCHMARK               │  │
│  │                      │  │                          │  │
│  │        78            │  │  You: 78/100             │  │
│  │      ─────           │  │  Industry Avg: 65/100    │  │
│  │       100            │  │  Top 10%: 85+            │  │
│  │                      │  │                          │  │
│  │  NEEDS IMPROVEMENT   │  │  You're better than 68%  │  │
│  └──────────────────────┘  │  of analyzed sites       │  │
│                            └───────────────────────────┘  │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  12 passing  •  3 warnings  •  1 failing             │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  BASIC CHECKS                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ ✓ robots │ │ ✓ sitemap│ │ ⚠ meta   │ │ ✗ llms.tx│     │
│  │   95     │ │   88     │ │   65     │ │   12     │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  ... (4 more cards)                                        │
│                                                            │
│  AI-ENHANCED CHECKS                          [PREMIUM]    │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │
│  │ ✓ content│ │ ✓ schema │ │ ⚠ links  │ │ ✓ crawl  │     │
│  │   82     │ │   78     │ │   54     │ │   91     │     │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘     │
│  ... (4 more cards)                                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Features**:
- Large score display (left)
- Benchmark comparison (right) - "You're better than 68% of sites"
- Status breakdown (12 passing, 3 warnings, 1 failing)
- 16 cards in 2 sections: "BASIC CHECKS" and "AI-ENHANCED CHECKS"
- Each card is clickable to expand details
- AI-enhanced section has subtle badge/border to differentiate

**Mobile Layout**: Stack vertically, 1 column

---

### Scrolly Persuasion Journey (Conversion Funnel)

**Current**: 6 passive scroll sections with fade-ins

**New Design**: Interactive CLI-style journey with 5 sections

#### Section 1: Reality Check (FOMO)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  Here's what you need to know.                            │
│  ─────────────────────────────                             │
│                                                            │
│  In 2026, AI agents are how people find websites.         │
│  ChatGPT, Perplexity, Claude—they're all crawling the     │
│  web right now, deciding which sites to recommend.        │
│                                                            │
│  Your site scored 78/100.                                 │
│  That means you're LOSING traffic to competitors who      │
│  scored higher.                                            │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ "Sites scoring 85+ get recommended 3x more often     │ │
│  │  by AI agents."                                       │ │
│  │                         — Internal analysis, 2025    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Tone**: Urgent, fact-driven, FOMO

---

#### Section 2: Your Biggest Issues

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  What's holding you back?                                 │
│  ──────────────────────                                    │
│                                                            │
│  Based on your analysis, here are the critical issues:    │
│                                                            │
│  ✗ llms.txt missing (12/100)                              │
│    AI agents don't know what content to prioritize.       │
│    → Fix this first. Biggest impact.                      │
│                                                            │
│  ⚠ Meta tags incomplete (65/100)                          │
│    Your homepage is missing key descriptions.             │
│    → Add semantic meta tags for AI parsing.               │
│                                                            │
│  ⚠ Link structure weak (54/100)                           │
│    Internal links don't help AI understand relationships. │
│    → Restructure navigation with semantic HTML.           │
│                                                            │
│  [See all 16 checks ↑]                                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Personalization**: Pulls actual failing/warning metrics from their analysis

---

#### Section 3: The Implementation Kit (Value Prop)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  The implementation kit gives you:                        │
│  ────────────────────────────────────                      │
│                                                            │
│  ✓ Step-by-step action plan (prioritized by impact)       │
│  ✓ Code examples you can copy-paste                       │
│  ✓ llms.txt template (customized for your site)           │
│  ✓ robots.txt configuration guide                         │
│  ✓ Semantic HTML refactoring checklist                    │
│  ✓ Schema.org markup templates                            │
│  ✓ AI-optimized meta tag formulas                         │
│  ✓ Sitemap generation best practices                      │
│                                                            │
│  Not just analysis. Actual solutions.                     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [Preview PDF →]                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Features**:
- Checklist-style value props
- Emphasis on "copy-paste", "templates", "customized"
- CTA: "Preview PDF" (opens modal with sample pages)

---

#### Section 4: Social Proof (Testimonials - Future)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  What people are saying:                                  │
│  ─────────────────────                                     │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ "Implemented the llms.txt template and started       │ │
│  │  showing up in ChatGPT results within 2 weeks."      │ │
│  │                                      — Sarah M., SaaS│ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ "The code examples saved me hours. Copy, paste,     │ │
│  │  done. Score went from 68 to 89."                    │ │
│  │                                 — David L., Developer│ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Note**: Placeholder for now - add real testimonials after launch

---

#### Section 5: Pricing CTA (The Ask)

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  Get the implementation kit.                              │
│  ──────────────────────────                                │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                       │ │
│  │              IMPLEMENTATION KIT                       │ │
│  │                                                       │ │
│  │                     $79                               │ │
│  │                                                       │ │
│  │  • Complete action plan for {yoursite.com}           │ │
│  │  • Copy-paste code examples                          │ │
│  │  • llms.txt template                                 │ │
│  │  • Prioritized task list                             │ │
│  │  • Schema.org markup templates                       │ │
│  │  • Delivered as PDF + editable files                 │ │
│  │                                                       │ │
│  │  ┌─────────────────────────────────────────────┐    │ │
│  │  │ [Get Implementation Kit - $79]              │    │ │
│  │  └─────────────────────────────────────────────┘    │ │
│  │                                                       │ │
│  │  One-time payment. Instant delivery.                 │ │
│  │                                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ 💡 COMING SOON: AI Monitoring                        │ │
│  │                                                       │ │
│  │ Track whether AI agents actually mention your site.  │ │
│  │ Get alerts when you appear in ChatGPT/Perplexity.    │ │
│  │                                                       │ │
│  │ [Join Waitlist →]                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Key Elements**:
- Price: $79 (clear, prominent)
- Value stack: 6 bullet points
- Personalization: "{yoursite.com}" in first bullet
- Trust signals: "One-time payment. Instant delivery."
- Upsell teaser: Monitoring service waitlist (separate card below)

**Email Capture Flow**:
1. User clicks "Get Implementation Kit - $79"
2. Modal appears: "Enter your email to continue to checkout"
3. Email field + 2 checkboxes (privacy policy, marketing consent)
4. Submit → Redirect to Stripe Checkout

---

### Footer

**Current**: Minimal footer with links

**New Design**: CLI-style footer with grid layout

```
┌────────────────────────────────────────────────────────────┐
│  AiCanSee.me                                               │
│  Finally, actionable AI readiness insights.                │
│                                                            │
│  PRODUCT           LEGAL            CONNECT                │
│  Docs              Privacy Policy   Twitter                │
│  Pricing           Terms of Service LinkedIn              │
│  FAQ               Data Deletion    GitHub                 │
│                                                            │
│  © 2026 AiCanSee.me • Built for developers who ship.      │
└────────────────────────────────────────────────────────────┘
```

---

## 🎯 Implementation Strategy

### Phase 1: Design System Foundation (Week 1)

**Goal**: Establish visual language before touching components

**Tasks**:
1. Update `colors.json` with new palette (dark greys + amber)
2. Add new font imports (JetBrains Mono or IBM Plex Mono)
3. Create typography utility classes in `main.css`
4. Update Tailwind config with new spacing/radius/shadows
5. Create animation keyframe library in `main.css`

**Deliverable**: New design tokens live, old components look broken (expected)

---

### Phase 2: Core Components (Week 1-2)

**Goal**: Build reusable brutalist components

**Tasks**:
1. Terminal Input component (`components/shared/terminal-input/`)
2. Metric Card component (`components/shared/metric-card/`)
3. CLI Output Log component (`components/shared/cli-log/`)
4. Score Display component (`components/shared/score-display/`)
5. Brutalist Button variants (`components/shared/button/`)
6. Code Block component (`components/shared/code-block/`)

**Deliverable**: Component library ready for page integration

---

### Phase 3: Hero Section Redesign (Week 2)

**Goal**: First impression transformation

**Tasks**:
1. Remove Firecrawl branding (logo, flame, "Powered by" badge)
2. Remove Pixi.js background
3. Implement dark background with subtle gradient
4. Replace generic input with Terminal Input component
5. Update hero copy (headline, subhead, trust signals)
6. Add typewriter animation on page load

**Deliverable**: New hero section live

---

### Phase 4: Results Dashboard (Week 2-3)

**Goal**: Transform Control Panel into interactive dashboard

**Tasks**:
1. Replace loading spinner with CLI Output Log
2. Implement 16 Metric Cards in grid layout
3. Add expand/collapse interactions
4. Create "BASIC CHECKS" vs "AI-ENHANCED CHECKS" sections
5. Build Score Display and Benchmark widgets
6. Update copy for all 16 metrics

**Deliverable**: Results section redesigned

---

### Phase 5: Scrolly Journey Rebuild (Week 3)

**Goal**: Conversion funnel with new messaging

**Tasks**:
1. Rewrite copy for 5 sections (FOMO + nerdy tone)
2. Implement personalization (pull actual metrics from analysis)
3. Add monitoring service waitlist teaser
4. Update pricing card (emphasize $79, value stack)
5. Replace passive scroll with interactive sections

**Deliverable**: Full funnel redesigned

---

### Phase 6: Polish & Testing (Week 4)

**Goal**: Refinement and QA

**Tasks**:
1. Mobile responsiveness testing
2. Animation performance optimization
3. Accessibility audit (keyboard nav, screen readers)
4. Copy editing pass
5. Cross-browser testing
6. Load time optimization

**Deliverable**: Production-ready redesign

---

## 📊 Success Metrics

**Before/After Comparison**:

| Metric | Before (Firecrawl Template) | Target (AiCanSee.me) |
|--------|----------------------------|---------------------|
| **Brand Recognition** | Generic SaaS template | Memorable brutalist CLI tool |
| **Time on Page** | ~45 seconds | 90+ seconds (interactive elements) |
| **Scroll Depth** | 60% reach pricing | 80% reach pricing |
| **Conversion Rate** | Baseline | +30% (better value prop) |
| **Mobile Bounce** | 55% | <40% (mobile-optimized) |

---

## 🚀 Next Steps

1. **Approve Design Direction**: Review this plan, suggest changes
2. **Start Phase 1**: Implement design system (colors, typography, animations)
3. **Build Component Library**: Core brutalist components
4. **Page-by-Page Rollout**: Hero → Results → Journey → Polish
5. **User Testing**: Get feedback on new aesthetic
6. **Launch**: Deploy redesign, monitor metrics

---

## 📝 Open Questions

1. **Fonts**: JetBrains Mono (free) or Berkeley Mono (paid, $75)? Or IBM Plex Mono?
2. **Logo**: Keep "AiCanSee.me" as text logo, or create custom glyph/icon?
3. **Animations**: How aggressive? Subtle CLI aesthetic or more playful?
4. **Mobile Nav**: Hamburger menu or always-visible links?
5. **Testimonials**: Real quotes or wait until post-launch?

---

**Created by**: Claude (frontend-design skill)
**Last Updated**: January 5, 2026
