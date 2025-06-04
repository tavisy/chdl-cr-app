// Content indexing system for better search capabilities

export interface ContentSection {
  id: string
  title: string
  url: string
  content: string
  keywords: string[]
  section: string
  lastUpdated: Date
}

// In-memory content store (in production, use a vector database)
const contentStore: ContentSection[] = [
  {
    id: "canadian-identity-1",
    title: "Canadian Heritage Differentiation",
    url: "/canadian-identity",
    content: `Crown Royal's Canadian heritage provides a unique differentiation opportunity in the North American whisky market. Unlike American bourbon, Crown Royal can leverage its Canadian craftsmanship story, maple syrup aging processes, and northern climate advantages. This authenticity resonates with consumers seeking premium experiences beyond traditional bourbon offerings.`,
    keywords: ["canadian", "heritage", "differentiation", "authenticity", "craftsmanship"],
    section: "Canadian Identity",
    lastUpdated: new Date(),
  },
  {
    id: "consumer-insights-1",
    title: "Bourbon Enthusiast Preferences",
    url: "/consumer-insights",
    content: `Research shows bourbon enthusiasts value three key factors: authenticity of production methods, heritage storytelling, and unique flavor profiles. They're willing to pay premium prices for limited editions and seek educational experiences about distillation processes. Social media engagement and influencer recommendations significantly impact purchase decisions.`,
    keywords: ["bourbon", "enthusiasts", "premium", "authenticity", "limited editions"],
    section: "Consumer Insights",
    lastUpdated: new Date(),
  },
  {
    id: "competitive-analysis-1",
    title: "Premium Bourbon Competitive Landscape",
    url: "/competitive-analysis",
    content: `Crown Royal competes against established premium bourbon brands including Buffalo Trace, Maker's Mark, and Woodford Reserve. Key competitive advantages include Canadian provenance, unique aging processes, and opportunity for super-premium positioning. Market gaps exist in the $80-150 price segment for limited edition releases.`,
    keywords: ["competition", "buffalo trace", "makers mark", "premium", "pricing"],
    section: "Competitive Analysis",
    lastUpdated: new Date(),
  },
  {
    id: "market-disruption-1",
    title: "Digital Marketing Opportunities",
    url: "/market-disruption",
    content: `Digital-first marketing strategies present significant opportunities for Crown Royal. Virtual distillery tours, bourbon education content, influencer partnerships, and limited edition drops through digital channels can capture younger demographics. Social commerce and direct-to-consumer sales models show strong growth potential.`,
    keywords: ["digital marketing", "virtual tours", "influencers", "social commerce", "dtc"],
    section: "Market Disruption",
    lastUpdated: new Date(),
  },
  {
    id: "recommendations-1",
    title: "Strategic Premiumization Roadmap",
    url: "/recommendations",
    content: `Seven strategic recommendations for Crown Royal's premiumization: 1) Leverage Canadian heritage storytelling, 2) Develop super-premium product lines, 3) Create bourbon enthusiast engagement programs, 4) Invest in experiential marketing, 5) Build digital education platform, 6) Partner with bourbon influencers, 7) Launch limited edition collector series.`,
    keywords: ["strategy", "premiumization", "recommendations", "roadmap", "implementation"],
    section: "Strategic Recommendations",
    lastUpdated: new Date(),
  },
]

export function searchContent(query: string, limit = 5): ContentSection[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(" ").filter((word) => word.length > 2)

  // Score content based on relevance
  const scoredContent = contentStore.map((content) => {
    let score = 0

    // Title matches (highest weight)
    if (content.title.toLowerCase().includes(queryLower)) score += 10

    // Keyword matches
    content.keywords.forEach((keyword) => {
      if (queryLower.includes(keyword)) score += 5
    })

    // Content matches
    queryWords.forEach((word) => {
      if (content.content.toLowerCase().includes(word)) score += 2
    })

    // Section matches
    if (content.section.toLowerCase().includes(queryLower)) score += 3

    return { ...content, score }
  })

  // Return top results
  return scoredContent
    .filter((content) => content.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function getContentBySection(section: string): ContentSection[] {
  return contentStore.filter((content) => content.section.toLowerCase().includes(section.toLowerCase()))
}

export function getAllContent(): ContentSection[] {
  return contentStore
}
