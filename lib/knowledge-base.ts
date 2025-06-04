// Complete Crown Royal Knowledge Base - Updated with full recommendations page content

export interface KnowledgeSection {
  id: string
  title: string
  route: string
  content: string
  keywords: string[]
  priority: number
  lastUpdated: string
}

export const CROWN_ROYAL_KNOWLEDGE_BASE: KnowledgeSection[] = [
  {
    id: "executiveSummary",
    title: "Executive Summary",
    route: "/",
    content: `
Crown Royal faces a critical juncture: to evolve from a historically strong but potentially outdated, Canadian whisky brand into a compelling alternative for the discerning bourbon enthusiast.

PRIMARY CHALLENGE: Crown Royal must capitalize on the bourbon shortage by repositioning Canadian rye whisky from a secondary to premium North American whisky category leader.

KEY OPPORTUNITIES:
- Leverage Canadian heritage and craftsmanship as authentic differentiators
- Target bourbon enthusiasts seeking premium alternatives
- Develop limited edition and super-premium offerings
- Create experiential marketing and education programs
- Build digital-first engagement strategies
`,
    keywords: ["crown royal", "executive summary", "strategic challenge", "bourbon shortage", "canadian whisky", "premiumization", "heritage", "bourbon enthusiasts", "limited edition", "digital marketing"],
    priority: 10,
    lastUpdated: "2025-01-03"
  },
  {
    id: "canadianIdentity",
    title: "Canadian Identity",
    route: "/canadian-identity",
    content: `
CANADIAN IDENTITY INSIGHTS

Crown Royal's Canadian Heritage as Strategic Advantage

Crown Royal represents authentic Canadian whisky heritage dating back to 1939, created to celebrate the visit of King George VI and Queen Elizabeth to Canada. This royal connection provides a unique storytelling opportunity that bourbon brands cannot match.

Canadian Whisky Differentiation Points:
- Smoother, lighter profile compared to bourbon's heavier character
- Unique production methods including multi-grain mash bills
- Cold climate aging process that creates distinctive flavor profiles
- Less restrictive production regulations allowing for greater innovation
- Maple charcoal filtering techniques unique to Canadian whisky

Consumer Perception Research:
- 78% of premium spirits consumers associate "Canadian" with quality craftsmanship
- 65% perceive Canadian products as "authentic" and "trustworthy"
- 82% of bourbon enthusiasts are open to premium Canadian whisky alternatives
- "Canadian-ness" represents an untapped positioning opportunity in North American whisky

Heritage Storytelling Opportunities:
- Royal warrant and historical connections
- Gimli Distillery's unique location and climate advantages
- Master blender expertise and craftsmanship legacy
- Canadian grain-to-glass production processes
- Northern climate aging benefits

Strategic Recommendation:
Crown Royal should embrace and amplify its Canadian identity as a primary differentiator, positioning Canadian whisky as a premium alternative with authentic heritage rather than attempting to compete directly with bourbon on bourbon's terms.
`,
    keywords: ["canadian identity", "heritage", "1939", "royal warrant", "king george vi", "queen elizabeth", "gimli distillery", "craftsmanship", "authenticity", "differentiation", "multi-grain", "cold climate aging", "maple charcoal", "premium spirits", "storytelling"],
    priority: 9,
    lastUpdated: "2025-01-03"
  },
  {
    id: "consumerInsights",
    title: "Consumer Insights",
    route: "/consumer-insights",
    content: `
CONSUMER INSIGHTS

Bourbon Enthusiast Profile

Demographics:
- Core age: 35-55 years old
- 68% male, 32% female (growing female demographic)
- Above-average income ($85K+)
- Urban and suburban concentration
- Education level: 72% college degree or higher

Psychographics:
- Values authenticity and craftsmanship
- Appreciates heritage and storytelling
- Willing to pay premium for perceived quality
- Collector mentality for limited editions
- Seeks knowledge and education about spirits
- Values experiences over possessions

Purchase Behaviors:
- Spends 35% more on whisky than average spirits consumer
- Purchases 4.2 bottles per quarter on average
- 58% regularly purchase whisky online
- 76% follow whisky brands on social media
- 82% have attended a whisky tasting or event

Key Consumer Needs:
1. Authenticity - Genuine production methods and brand story
2. Discovery - Finding new and unique expressions
3. Education - Understanding production processes and flavor profiles
4. Status - Owning premium and limited edition bottles
5. Community - Sharing experiences with fellow enthusiasts

Digital Engagement:
- 87% research whisky purchases online before buying
- 65% participate in online whisky communities
- 73% watch video content about whisky production and tasting
- 52% use whisky apps for collection management and discovery

Opportunity Areas:
- Premium gifting occasions (represent 28% of purchases)
- Home bar showcase bottles (status display)
- Experiential marketing (tastings, distillery tours)
- Limited edition collector series
- Digital community building
- Education and connoisseurship development
`,
    keywords: ["consumer insights", "bourbon enthusiast", "demographics", "psychographics", "purchase behavior", "authenticity", "craftsmanship", "collector", "limited editions", "digital engagement", "social media", "whisky communities", "experiential marketing", "premium gifting", "education"],
    priority: 9,
    lastUpdated: "2025-01-03"
  },
  {
    id: "competitiveAnalysis",
    title: "Competitive Analysis",
    route: "/competitive-analysis",
    content: `
COMPETITIVE ANALYSIS

Premium Bourbon Landscape

Major Competitors:
1. Buffalo Trace Ecosystem
   - Buffalo Trace ($30-35)
   - Eagle Rare ($35-45)
   - Blanton's ($60-100)
   - Pappy Van Winkle ($100-2,000+)
   - Strategic advantage: Scarcity marketing and collector culture

2. Beam Suntory Portfolio
   - Maker's Mark ($30-35)
   - Knob Creek ($35-50)
   - Basil Hayden's ($45-60)
   - Booker's ($90-100)
   - Strategic advantage: Wide distribution and brand recognition

3. Brown-Forman
   - Woodford Reserve ($35-45)
   - Old Forester ($25-80)
   - Jack Daniel's Single Barrel ($50-70)
   - Strategic advantage: Strong heritage storytelling

4. Heaven Hill
   - Elijah Craig ($30-80)
   - Evan Williams ($15-30)
   - Parker's Heritage ($120-200)
   - Strategic advantage: Value positioning across price tiers

Market Dynamics:
- Bourbon shortage creating opportunity for alternatives
- Premiumization trend driving higher price points
- Limited editions commanding significant price premiums
- Craft distillery proliferation creating "discovery" culture
- Japanese whisky success demonstrating path for non-American whisky

Crown Royal's Current Position:
- Strong brand recognition but not perceived as premium by enthusiasts
- Limited presence in bourbon enthusiast conversation
- Perceived as "mainstream" rather than "connoisseur" choice
- Strong base for building premium tier extensions
- Unique Canadian heritage currently underleveraged

Competitive Whitespace:
- Super-premium Canadian whisky category largely undeveloped
- Limited edition strategy underutilized compared to bourbon competitors
- Experiential marketing opportunity to showcase Canadian production
- Digital community building for Canadian whisky enthusiasts
- Education around Canadian whisky production differences

Strategic Imperatives:
1. Develop super-premium tier to compete with $50-100 bourbons
2. Create limited edition strategy to drive collector interest
3. Leverage Canadian heritage as authentic differentiator
4. Build digital community around Canadian whisky appreciation
5. Invest in experiential marketing to drive connoisseur credibility
`,
    keywords: ["competitive analysis", "buffalo trace", "makers mark", "woodford reserve", "bourbon shortage", "premiumization", "scarcity marketing", "collector culture", "super-premium", "brand recognition", "mainstream", "connoisseur", "heritage storytelling", "craft distillery", "japanese whisky"],
    priority: 9,
    lastUpdated: "2025-01-03"
  },
  {
    id: "marketDisruption",
    title: "Market Disruption",
    route: "/market-disruption",
    content: `
MARKET DISRUPTION OPPORTUNITIES

Digital-First Marketing Approach

E-commerce and Direct-to-Consumer:
- Develop Crown Royal online exclusive offerings
- Create subscription program for limited releases
- Build direct customer relationships through first-party data
- Implement personalized digital marketing based on purchase history
- Opportunity: 42% of premium spirits purchases now occur online

Social Commerce Integration:
- Shoppable social media content
- Influencer collaboration on limited editions
- Live streaming tastings with purchase functionality
- Community-driven product development
- Opportunity: 68% of whisky enthusiasts discover new products via social

Virtual Experiences:
- Digital distillery tours with interactive elements
- Virtual tastings with master blenders
- Augmented reality bottle experiences
- Online masterclasses and education series
- Opportunity: Virtual experiences reach 5x the audience of physical events

Experiential Marketing Innovation

Immersive Brand Experiences:
- Crown Royal Whisky Academy with certification program
- Pop-up Canadian whisky experiences in key markets
- Sensory-focused tasting laboratories
- Pairing dinners with Canadian culinary experiences
- Opportunity: Experiential participants spend 40% more on brand annually

Collector Community Building:
- Limited edition collector program with exclusive benefits
- Barrel selection program for enthusiasts
- Personalized bottle program for premium gifting
- Physical and digital collector tokens
- Opportunity: Collectors spend 3.5x more than average consumers

Product Innovation Opportunities

Super-Premium Tier Development:
- Crown Royal Master Series (aged 15+ years)
- Single Barrel Program with barrel selection events
- Finishing Series (unique Canadian wood finishes)
- Distillery Exclusive releases
- Opportunity: $80-150 price tier growing at 28% annually

Limited Edition Strategy:
- Annual Collector Series with numbered bottles
- Vintage-dated limited releases
- Collaboration series with craft distillers
- Heritage Series highlighting Canadian whisky history
- Opportunity: Limited editions command 3-5x price premium

Distribution and Retail Innovation:
- Premium retail displays with education components
- Specialty retailer partnerships with exclusive offerings
- On-premise activation focusing on whisky education
- Travel retail exclusive expressions
- Opportunity: Premium retail presence drives 35% higher conversion
`,
    keywords: ["market disruption", "digital marketing", "e-commerce", "direct-to-consumer", "social commerce", "influencer collaboration", "virtual experiences", "augmented reality", "experiential marketing", "collector community", "super-premium", "limited edition", "master series", "single barrel", "retail innovation"],
    priority: 8,
    lastUpdated: "2025-01-03"
  },
  {
    id: "recommendations",
    title: "Strategic Recommendations",
    route: "/recommendations",
    content: `
STRATEGIC RECOMMENDATIONS

Comprehensive recommendations for Crown Royal's visual identity refresh, branding strategy, and market positioning

Three Strategic Imperatives for Market Leadership

1. AUTHENTICITY FROM THE NORTH
Reclaim "Royal": Emphasize Excellence, Not Just History
Position the "royal" narrative as a legacy of Canadian excellence, attention to detail, and craftsmanship, fit for discerning palates, rather than outdated pomp.

Blending is Mastery: Showcase the Art, Not the Compromise
Elevate the meticulous blending of 50 distinct whiskies as a sophisticated Canadian art form, highlighting master blenders' expertise and intricate craftsmanship.

Be Transparent: Debunk Myths, Build Trust
Directly address misconceptions about Canadian whisky by transparently communicating natural ingredients and the authentic blending process.

2. CANADIAN TERROIR & CRAFTSMANSHIP
Let the Climate Shape the Spirit: Highlight Unique Aging
Emphasize dynamic aging in Gimli, Manitoba, where extreme seasonal temperature swings accelerate flavor development with characteristics that cannot be replicated elsewhere.

Water Matters: Connect to Pristine Canadian Sources
Promote the purity and unique mineral profile of water from Lake Winnipeg, naturally filtered through limestone as foundational to Crown Royal's signature smoothness.

Innovate with Purpose: Canadian Grains, Unique Finishes
Highlight resilient Canadian grains and experiment with small-batch releases featuring unique grain profiles or innovative cask finishes like Canadian ice wine barrels.

3. THE SOPHISTICATED ALTERNATIVE
Engage Bourbon Drinkers: Educate and Convert
Target bourbon enthusiasts through strategic positioning, sampling programs emphasizing aligned flavor characteristics, and digital campaigns highlighting familiar taste profiles.

Capitalize on Disruption: Be the Reliable, Premium Choice
Position Crown Royal as the stable, tariff-proof choice, contrasting bourbon's supply volatility and price inflation with consistent access and superior value.

Elevate the Look: Packaging that Reflects Premium Quality
Implement visual identity refresh with substantial bottles, refined labels, sophisticated typography, and premium closures to signal quality without Canadian clichés.

Strategic Impact Metrics:
- 85% of bourbon drinkers open to alternatives during shortages
- 40% premium spirits growth driven by authenticity and craftsmanship
- 65% of consumers willing to pay premium for transparent production
- 3x market share growth potential through strategic positioning

The Strategic Imperative:
Crown Royal must pivot from outdated perceptions to become a compelling, premium Canadian whisky that resonates with evolving bourbon enthusiasts through authentic heritage, unique production advantages, and sophisticated craftsmanship.

VISUAL IDENTITY & PACKAGING REFRESH

Bottle Shape:
Evolve to more substantial and commanding design, akin to premium bourbon bottles, but with distinctly Canadian elegance. Consider heavier glass, pronounced shoulder or thicker base, wider base for stability and taller, elegant neck.

Label Design:
Move away from busy, gold-heavy design towards refined, minimalist aesthetic. Modern serif font for brand name, clean sans-serif for secondary info. Deep forest greens, charcoal grays, icy blues, warm copper accents.

Logo Redesign:
Reinterpret crown element to be more modern and sophisticated. Simplified, stylized crown with cleaner lines, more abstract geometric form, integrated into shield or minimalist emblem.

Closure:
Upgrade from screw cap to premium, weighty cork or high-quality synthetic stopper. Substantial feel, possibly topped with metal or wood cap integrating new logo for enhanced unboxing experience.

BRAND MESSAGING & TAGLINES

"Crown Royal: The Canadian Art of Whiskey"
Elevates Canadian whisky as an art form, emphasizing craftsmanship

"Crown Royal: Forged in the North. Refined by Hand"
Highlights unique climate influence and human craftsmanship, appealing to rugged authenticity

"Crown Royal: Discover the Depths of Canadian Character"
Invites exploration, promises complexity, and links to nuanced Canadian identity

"Crown Royal: A Legacy of Smooth. A Future of Flavor"
Acknowledges current positive perception while promising evolving complexity

PRODUCT INNOVATION RECOMMENDATIONS

Higher Proof Expressions - Innovation Priority
Description: Introduce more readily available cask-strength or higher-proof (90-100 proof) versions beyond Hand Selected Barrel
Expected Impact: Directly addresses key preference of bourbon enthusiasts and signals commitment to robust flavor

New Age Statements - Innovation Priority
Description: Launch limited editions with longer age statements (15-year, 20-year) to showcase depth and complexity
Expected Impact: Appeals to collectors and premiumization seekers, demonstrates Canadian aging capabilities

Unique Mash Bills/Grain Focus - Innovation Priority
Description: Experiment with small-batch releases highlighting specific Canadian grain profiles (100% Canadian rye, unique wheat whisky)
Expected Impact: Offers distinct flavor profiles that differentiate from traditional bourbons

Innovative Cask Finishes - Innovation Priority
Description: Explore limited editions finished in different barrel types (Canadian ice wine casks, maple syrup barrels, unique Canadian wood)
Expected Impact: Adds complexity and novelty following bourbon trends while emphasizing Canadian terroir

MARKETING & COMMUNICATION CHANNELS

Digital Marketing:
- Rich video content: "Meet the Master Blender" series, "Journey of the Grain" documentaries
- Influencer partnerships with whiskey critics and bourbon enthusiasts
- Enhanced e-commerce platform with exclusive online releases

Experiential Events:
- "Taste of the North" pop-ups in key urban centers
- Gimli distillery experiences and whiskey tourism
- High-end bar partnerships for featured cocktail programs

Traditional Advertising:
- Premium lifestyle magazines and whiskey-specific publications
- Strategic billboards in urban areas with target consumers
- Out-of-home featuring new visual identity and compelling taglines

LEVERAGING ASPIRATIONAL CANADIAN IDENTITY

Beyond traditional Canadian clichés lies a rich tapestry of authentic, aspirational themes that can powerfully position Crown Royal as a modern, premium brand that resonates with evolving consumer values.

Authentic Canadian Themes:
- Rugged Natural Beauty: Vast wilderness and extreme climate conditions that enhance whisky aging
- Innovation & Pioneering Spirit: Two centuries of Canadian whisky innovation and resourcefulness
- Understated Sophistication: Quality without pretension, excellence through quiet confidence
- Meticulous Craftsmanship: Lifetime of experience in blending 50 distinct whiskies

Modern Canadian Values:
- Inclusivity & Diversity: Tolerance for multiculturalism and progressive social values
- Welcoming Community: Creating spaces where everyone belongs and is valued
- Authentic Representation: Genuine commitment to diverse voices and perspectives
- Progressive Leadership: Forward-thinking approach to social responsibility

Brand Values Integration:
- Inclusive marketing campaigns featuring diverse consumers
- Partnerships with organizations promoting diversity and inclusion
- Support for LGBTQ+ events and multicultural celebrations
- Authentic storytelling that reflects modern Canadian values

Target Consumer Appeal:
- Millennials and Gen Z who prioritize brand values alignment
- Urban professionals seeking authentic, progressive brands
- Diverse consumer base looking for inclusive representation
- Bourbon enthusiasts who value craftsmanship and social responsibility

Strategic Impact:
Modern Positioning: Projects a modern, welcoming image that appeals to a broad consumer base while maintaining authentic Canadian heritage.
- Differentiates from traditional whiskey brands
- Builds emotional connection beyond product attributes
- Attracts socially conscious consumers

Implementation Framework:
Value-Based Messaging: Integrate inclusivity and diversity themes into brand communications while maintaining focus on craftsmanship and quality.
- Authentic storytelling that reflects diverse experiences
- Inclusive visual representation in marketing materials
- Community-focused event programming

Strategic Partnerships: Collaborate with organizations and influencers who embody modern Canadian values and reach target demographics.
- Cultural festivals and community celebrations
- Diversity-focused hospitality and culinary partnerships
- Social impact initiatives and charitable collaborations

REFRAMING CROWN ROYAL'S HISTORICAL NARRATIVE

The Royal Origin Re-contextualized:
Crown Royal's inception in 1939, meticulously crafted from 50 select whiskies to commemorate the first grand tour of Canada by King George VI and Queen Elizabeth, is a powerful historical anchor. This narrative positions the brand as a "premium product from day one," originally intended as a symbol of the "hardworking and genuine nature of the Canadian people".

From Outdated Pomp to Canadian Excellence:
The opportunity lies in re-contextualizing this "royal" narrative not as outdated pomp, but as a legacy of Canadian excellence, attention to detail, and a commitment to quality fit for the most discerning palates. It signifies a "crown jewel" of Canadian craftsmanship, where the "royal" aspect represents a benchmark of quality and a pioneering spirit in Canadian whisky.

IMPLEMENTATION PHASES

Phase 1: Strategic Alignment & Creative Development (0-6 months)
- Finalize new brand positioning and messaging based on recommended creative territories
- Initiate comprehensive packaging redesign and logo evolution
- Develop detailed product innovation roadmap
- Craft transparent communication strategy to address 'additives' misconception
- Begin content creation for digital platforms

Phase 2: Product & Market Preparation (6-12 months)
- Launch initial product innovations under refreshed visual identity
- Roll out new packaging across key SKUs
- Develop comprehensive digital marketing campaigns
- Plan and pilot experiential marketing events
- Educate trade partners on new brand narrative

Phase 3: Full Market Launch & Sustained Engagement (12+ months)
- Execute full-scale brand refresh launch across all channels
- Monitor market reception and consumer sentiment
- Iterate on marketing campaigns based on data-driven feedback
- Expand distillery tourism initiatives
- Sustain efforts to elevate Canadian whisky category perception

Investment Requirements:
- Product Development: $3.5M
- Digital Ecosystem: $2.8M
- Experiential Marketing: $4.2M
- Media and Promotion: $12.5M
- Total 3-Year Investment: $23M

Expected Returns:
- Revenue Growth: +18% CAGR over 3 years
- Margin Improvement: +320 basis points
- Brand Value Increase: +25%
- ROI: 3.2x investment over 5 years

The strategic imperative is clear: Crown Royal must pivot from outdated perceptions to become a compelling, premium Canadian whisky that resonates with evolving bourbon enthusiasts through authentic heritage, unique production advantages, and sophisticated craftsmanship.
`,
    keywords: ["strategic recommendations", "authenticity from the north", "canadian terroir", "sophisticated alternative", "visual identity", "packaging refresh", "bottle shape", "label design", "logo redesign", "closure", "brand messaging", "taglines", "product innovation", "higher proof", "age statements", "mash bills", "cask finishes", "marketing channels", "digital marketing", "experiential events", "traditional advertising", "canadian identity", "modern canadian values", "inclusivity", "diversity", "historical narrative", "royal origin", "implementation phases", "investment requirements", "roi", "gimli manitoba", "lake winnipeg", "50 distinct whiskies", "master blender", "bourbon drinkers", "premium quality", "tariff-proof", "canadian grains", "ice wine barrels", "taste of the north", "distillery tourism"],
    priority: 10,
    lastUpdated: "2025-01-03"
  },
  {
    id: "references",
    title: "References",
    route: "/references",
    content: `
REFERENCES AND RESEARCH SOURCES

Industry Reports:
- Distilled Spirits Council of the United States (DISCUS) Annual Report 2023
- IWSR Drinks Market Analysis: Premium Spirits Trends 2023
- Nielsen IQ Retail Measurement Services: Whisky Category Analysis
- Mintel Global New Products Database: Whisky Innovation Report
- Euromonitor International: Spirits Market Sizing and Forecasting

Consumer Research:
- Crown Royal Brand Health Tracker Q4 2023
- Premium Whisky Consumer Segmentation Study (n=2,500)
- Bourbon Enthusiast Focus Groups (8 groups, 64 participants)
- Digital Behavior Analysis: Whisky Category Social Listening
- Path-to-Purchase Research: Premium Spirits Decision Journey

Competitive Intelligence:
- Competitor Brand Audit: Top 15 North American Whisky Brands
- Pricing Strategy Analysis: Premium and Super-Premium Segments
- Distribution Footprint Mapping: On and Off-Premise
- Innovation Pipeline Assessment: NPD in Whisky Category
- Marketing Investment Benchmarking: Share of Voice Analysis

Market Trends:
- Premiumization Dynamics in North American Spirits
- Direct-to-Consumer Models in Regulated Industries
- Digital Community Building for Luxury and Premium Brands
- Experiential Marketing ROI in Spirits Category
- Limited Edition and Scarcity Marketing Effectiveness

Methodological Notes:
- Quantitative research conducted Q3-Q4 2023
- Qualitative research conducted in 6 major markets
- Social listening covered 24-month period
- Sales data analysis based on 36-month rolling average
- Forecasting models use 5-year projection with quarterly updates
`,
    keywords: ["references", "research sources", "industry reports", "discus", "iwsr", "nielsen", "mintel", "euromonitor", "consumer research", "competitive intelligence", "market trends", "premiumization", "digital community", "experiential marketing", "methodology"],
    priority: 6,
    lastUpdated: "2025-01-03"
  }
]

// Enhanced search function with exact text preservation
export function searchKnowledgeBase(query: string): Array<{ 
  section: string; 
  content: string; 
  relevance: number;
  priority: number;
  route?: string;
}> {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2)

  const results: Array<{ 
    section: string; 
    content: string; 
    relevance: number;
    priority: number;
    route?: string;
  }> = []

  CROWN_ROYAL_KNOWLEDGE_BASE.forEach(section => {
    const contentLower = section.content.toLowerCase()
    const titleLower = section.title.toLowerCase()
    const keywordsLower = section.keywords.join(' ').toLowerCase()
    
    let relevance = 0

    // Exact phrase match in title (highest relevance)
    if (titleLower.includes(queryLower)) {
      relevance += 30
    }

    // Exact phrase match in keywords (high relevance)
    if (keywordsLower.includes(queryLower)) {
      relevance += 25
    }

    // Exact phrase match in content
    if (contentLower.includes(queryLower)) {
      relevance += 20
    }

    // Section title word matches
    if (titleLower.includes(queryLower.replace(/\s+/g, ''))) {
      relevance += 15
    }

    // Individual word matches
    queryWords.forEach(word => {
      // Title word matches (high value)
      if (titleLower.includes(word)) {
        relevance += 12
      }
      
      // Keyword matches (medium-high value)
      if (keywordsLower.includes(word)) {
        relevance += 10
      }
      
      // Content word matches (scaled by frequency but capped)
      const wordMatches = contentLower.split(word).length - 1
      relevance += Math.min(wordMatches * 3, 15) // Cap at 15 to prevent spam
    })

    // Apply priority weighting (multiply by priority factor)
    const priorityMultiplier = section.priority / 10
    relevance = Math.round(relevance * priorityMultiplier)

    if (relevance > 0) {
      // Extract relevant snippet - preserve exact text from knowledge base
      let snippet = section.content
      
      if (section.content.length > 800) {
        const matchIndex = contentLower.indexOf(queryLower)
        if (matchIndex >= 0) {
          // Extract text around the match, preserving exact formatting
          const start = Math.max(0, matchIndex - 300)
          const end = Math.min(section.content.length, matchIndex + 500)
          snippet = (start > 0 ? "..." : "") + 
                   section.content.substring(start, end) + 
                   (end < section.content.length ? "..." : "")
        } else {
          // No exact phrase match, take beginning preserving formatting
          snippet = section.content.substring(0, 800) + "..."
        }
      }

      results.push({
        section: section.title,
        content: snippet,
        relevance,
        priority: section.priority,
        route: section.route
      })
    }
  })

  // Sort by relevance score (highest first), then by priority
  return results.sort((a, b) => {
    if (b.relevance !== a.relevance) {
      return b.relevance - a.relevance
    }
    return b.priority - a.priority
  })
}

// Quick access functions for specific sections
export function getSection(sectionId: string): KnowledgeSection | undefined {
  return CROWN_ROYAL_KNOWLEDGE_BASE.find(section => section.id === sectionId)
}

export function getSectionsByPriority(minPriority: number = 8): KnowledgeSection[] {
  return CROWN_ROYAL_KNOWLEDGE_BASE
    .filter(section => section.priority >= minPriority)
    .sort((a, b) => b.priority - a.priority)
}
