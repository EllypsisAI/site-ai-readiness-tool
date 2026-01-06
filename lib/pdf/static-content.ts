// Static educational content and templates for the AI Readiness PDF report
// Philosophy: "Give them the fishing rod, not the fish"

export interface MetricGuide {
  id: string;
  label: string;
  whatItIs: string;
  whyItMatters: string;
  howToFix: string[];
  template?: string;
  caveat?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  taskType: 'Self-service' | 'Developer';
}

export const metricGuides: Record<string, MetricGuide> = {
  'llms-txt': {
    id: 'llms-txt',
    label: 'LLMs.txt File',
    whatItIs:
      'An llms.txt file is a proposed standard (created Sept 2024) that provides AI systems with a structured summary of your website. Similar to robots.txt, it sits at your root domain and tells AI crawlers what your site is about.',
    whyItMatters:
      'While no AI system has confirmed reading llms.txt yet, early adopters like Anthropic, Stripe, and Cloudflare have implemented it. It\'s a low-cost way to future-proof your site for AI discovery.',
    howToFix: [
      'Create a file named llms.txt in your website root (e.g., example.com/llms.txt)',
      'Include your site name, description, and key pages',
      'Link to your most important content pages',
      'Keep it concise - AI systems prefer structured, scannable content',
    ],
    template: `# {domain}

> {description}

## About
{about}

## Key Pages
- [Homepage](/)
- [Products](/products)
- [Pricing](/pricing)
- [Contact](/contact)

## What We Offer
{offerings}`,
    caveat:
      'Note: llms.txt is an emerging standard (~950 adopters) with no confirmed AI system reading it yet. However, implementation is simple and positions you for future AI discovery.',
    difficulty: 'Easy',
    taskType: 'Self-service',
  },

  'robots-txt': {
    id: 'robots-txt',
    label: 'Robots.txt Configuration',
    whatItIs:
      'Robots.txt is a file that tells web crawlers (including AI bots) which pages they can and cannot access. It sits at your root domain and controls crawler behavior.',
    whyItMatters:
      'There are 226+ identified AI crawlers. Most respect robots.txt directives. Proper configuration ensures AI systems can access your important content while blocking private areas.',
    howToFix: [
      'Review your current robots.txt (if it exists)',
      'Ensure important pages are NOT blocked',
      'Allow known AI crawlers: GPTBot, Claude-Web, Anthropic, Bingbot',
      'Block only sensitive areas like admin panels and private content',
    ],
    template: `# AI-Friendly Robots.txt Configuration

User-agent: *
Allow: /

# Allow AI crawlers explicitly
User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: Anthropic
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GoogleOther
Allow: /

# Block only sensitive areas
Disallow: /admin/
Disallow: /private/
Disallow: /api/

# Sitemap location
Sitemap: https://{domain}/sitemap.xml`,
    difficulty: 'Easy',
    taskType: 'Self-service',
  },

  sitemap: {
    id: 'sitemap',
    label: 'XML Sitemap',
    whatItIs:
      'A sitemap.xml file lists all the pages on your website that you want search engines and AI systems to discover. It helps crawlers understand your site structure.',
    whyItMatters:
      'AI systems use sitemaps to discover and prioritize content. Without a sitemap, AI crawlers may miss important pages or not understand which content is most valuable.',
    howToFix: [
      'Generate a sitemap.xml file with all public pages',
      'Include lastmod dates to indicate content freshness',
      'Submit to Google Search Console for faster indexing',
      'Reference it in your robots.txt file',
    ],
    template: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://{domain}/</loc>
    <lastmod>2024-01-15</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://{domain}/products</loc>
    <lastmod>2024-01-10</lastmod>
    <priority>0.8</priority>
  </url>
  <!-- Add all public pages -->
</urlset>`,
    difficulty: 'Medium',
    taskType: 'Developer',
  },

  'heading-structure': {
    id: 'heading-structure',
    label: 'Heading Structure',
    whatItIs:
      'Heading structure refers to how you use H1, H2, H3, etc. tags to organize your content. AI systems use headings to parse and chunk content for understanding.',
    whyItMatters:
      'AI systems rely heavily on heading structure to understand content hierarchy. Proper headings help AI accurately comprehend and quote your content. This is one of the most validated factors for AI comprehension.',
    howToFix: [
      'Use exactly one H1 tag per page (your main title)',
      'Use H2 tags for major sections',
      'Use H3-H6 for subsections in logical hierarchy',
      'Make headings descriptive - AI uses them for context',
      'Avoid skipping heading levels (e.g., H1 → H3)',
    ],
    difficulty: 'Medium',
    taskType: 'Self-service',
  },

  readability: {
    id: 'readability',
    label: 'Content Readability',
    whatItIs:
      'Readability measures how easy your content is to read, typically using metrics like Flesch-Kincaid. A score of 60+ is considered readable by the general public.',
    whyItMatters:
      'AI systems prefer clear, well-structured content. While AI can understand complex text, clearer writing leads to more accurate AI understanding and better verbatim quotes.',
    howToFix: [
      'Use short sentences (15-20 words average)',
      'Break up long paragraphs (3-4 sentences max)',
      'Use common words over jargon when possible',
      'Use active voice instead of passive',
      'Include bullet points and lists for scannable content',
    ],
    difficulty: 'Medium',
    taskType: 'Self-service',
  },

  'meta-tags': {
    id: 'meta-tags',
    label: 'Meta Tags',
    whatItIs:
      'Meta tags are HTML elements that provide information about your page, including title, description, and Open Graph tags for social sharing.',
    whyItMatters:
      'Meta descriptions are often quoted VERBATIM by AI chatbots. When an AI recommends your product, it frequently uses your meta description as the summary. This is one of the most critical factors.',
    howToFix: [
      'Write compelling meta descriptions (150-160 characters)',
      'Include your unique value proposition in the description',
      'Use descriptive, keyword-rich page titles',
      'Add Open Graph tags for social/AI previews',
      'Make descriptions factual - AI will quote them directly',
    ],
    difficulty: 'Easy',
    taskType: 'Self-service',
  },

  'semantic-html': {
    id: 'semantic-html',
    label: 'Semantic HTML',
    whatItIs:
      'Semantic HTML uses meaningful tags like <article>, <nav>, <main>, <section>, and <aside> instead of generic <div> tags. It tells AI what each part of your page represents.',
    whyItMatters:
      'Semantic HTML has a major impact on AI comprehension. When AI systems crawl your page, semantic tags help them understand which content is primary (article) vs navigation vs supplementary (aside).',
    howToFix: [
      'Use <main> for primary page content',
      'Use <article> for self-contained content blocks',
      'Use <nav> for navigation menus',
      'Use <section> for thematic groupings',
      'Use <aside> for related but separate content',
      'Use <header> and <footer> appropriately',
    ],
    difficulty: 'Hard',
    taskType: 'Developer',
  },

  accessibility: {
    id: 'accessibility',
    label: 'Accessibility (Alt Text)',
    whatItIs:
      'Accessibility includes providing alt text for images, proper ARIA labels, and ensuring content is accessible to screen readers.',
    whyItMatters:
      'Alt text helps AI understand images on your page. Multimodal AI systems can read images, but alt text provides explicit context that improves accuracy. It also improves SEO and user accessibility.',
    howToFix: [
      'Add descriptive alt text to all images',
      'Describe what the image shows, not just "image of..."',
      'For product images, include product name and key features',
      'Use ARIA labels for interactive elements',
      'Ensure form inputs have associated labels',
    ],
    difficulty: 'Medium',
    taskType: 'Self-service',
  },
};

// JSON-LD / Structured Data guidance
export const structuredDataGuide = {
  whatItIs:
    'JSON-LD (Linked Data) is structured data embedded in your HTML that helps search engines understand your content. It uses schema.org vocabulary.',
  whyItMatters:
    'Important caveat: AI chatbots do NOT read JSON-LD directly during retrieval. However, structured data helps with indexing (Google AI Overviews, Bing) which can indirectly improve AI visibility. Critical information should also appear in visible HTML.',
  templates: {
    organization: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "{name}",
  "url": "https://{domain}",
  "description": "{description}",
  "logo": "https://{domain}/logo.png"
}
</script>`,
    product: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{productName}",
  "description": "{productDescription}",
  "brand": "{brand}",
  "offers": {
    "@type": "Offer",
    "price": "{price}",
    "priceCurrency": "USD"
  }
}
</script>`,
  },
};

// Resources section content
export const resources = {
  tools: [
    {
      name: 'Screaming Frog SEO Spider',
      url: 'https://www.screamingfrog.co.uk/seo-spider/',
      description: 'Crawl your site to find missing meta tags, broken links, and heading issues',
    },
    {
      name: 'Google Search Console',
      url: 'https://search.google.com/search-console',
      description: 'Submit sitemaps, monitor indexing, and check how Google sees your site',
    },
    {
      name: 'Schema.org Validator',
      url: 'https://validator.schema.org/',
      description: 'Test your structured data / JSON-LD markup',
    },
    {
      name: 'Hemingway Editor',
      url: 'https://hemingwayapp.com/',
      description: 'Improve content readability with real-time suggestions',
    },
    {
      name: 'WAVE Accessibility Tool',
      url: 'https://wave.webaim.org/',
      description: 'Check accessibility issues including missing alt text',
    },
  ],
  documentation: [
    {
      name: 'llms.txt Specification',
      url: 'https://llmstxt.org/',
      description: 'Official llms.txt proposal and format guide',
    },
    {
      name: 'Robots.txt Specification',
      url: 'https://developers.google.com/search/docs/crawling-indexing/robots/intro',
      description: 'Google\'s guide to robots.txt',
    },
    {
      name: 'Schema.org',
      url: 'https://schema.org/',
      description: 'Structured data vocabulary documentation',
    },
  ],
};

// Self-improvement prompts (the "fishing rod")
export const improvementPrompts = {
  metaDescription: `Use this prompt with ChatGPT or Claude to improve your meta descriptions:

"I need a compelling meta description for my [page type] page. My business is [brief description]. The page is about [page topic]. Key features/benefits are: [list 3-4 points].

Write a meta description that:
- Is 150-160 characters
- Includes our unique value proposition
- Uses active, engaging language
- Would make someone want to click"`,

  contentReadability: `Use this prompt to improve your content readability:

"Rewrite the following content to be clearer and more readable. Target a Flesch reading score of 60+. Use:
- Short sentences (15-20 words)
- Active voice
- Common words over jargon
- Bullet points where appropriate

[Paste your content here]"`,

  altText: `Use this prompt to write better alt text:

"Write alt text for an image of [describe what the image shows]. The image is on a page about [page topic]. The alt text should:
- Describe what's visible in the image
- Be concise but descriptive (10-15 words)
- Include relevant context for the page
- NOT start with 'image of' or 'picture of'"`,
};
