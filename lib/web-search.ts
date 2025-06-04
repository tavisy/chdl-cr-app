// Real-time web search integration

export interface SearchResult {
  title: string
  url: string
  snippet: string
  publishedDate?: string
  source?: string
}

// Mock search function - replace with actual search API
export async function searchWeb(query: string, limit = 5): Promise<SearchResult[]> {
  // In production, integrate with:
  // - Serper API (Google Search)
  // - Tavily Search API
  // - Exa Search API
  // - Bing Search API

  // Mock implementation for demonstration
  const mockResults: SearchResult[] = [
    {
      title: "Crown Royal Launches New Premium Line 2024",
      url: "https://example.com/crown-royal-premium-2024",
      snippet:
        "Crown Royal announces expansion into super-premium segment with limited edition releases targeting bourbon enthusiasts...",
      publishedDate: "2024-01-15",
      source: "Spirits Business",
    },
    {
      title: "Canadian Whisky Market Growth Trends",
      url: "https://example.com/canadian-whisky-trends",
      snippet:
        "Market analysis shows Canadian whisky gaining ground against American bourbon, with premium segments showing strongest growth...",
      publishedDate: "2024-01-10",
      source: "Whisky Magazine",
    },
    {
      title: "Bourbon vs Canadian Whisky Consumer Study",
      url: "https://example.com/bourbon-vs-canadian-study",
      snippet:
        "Recent consumer research reveals shifting preferences toward Canadian whisky among premium spirit consumers...",
      publishedDate: "2024-01-05",
      source: "Drinks International",
    },
  ]

  // Filter and return relevant results
  return mockResults
    .filter(
      (result) =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.snippet.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, limit)
}

// Function to combine website content and web search
export async function performHybridSearch(query: string): Promise<{
  websiteResults: Array<{ title: string; url: string; snippet: string }>
  webResults: SearchResult[]
}> {
  // Import here to avoid circular dependencies
  const { searchContent } = await import("./content-indexer")

  // Search website content
  const websiteContent = searchContent(query, 3)
  const websiteResults = websiteContent.map((content) => ({
    title: content.title,
    url: content.url,
    snippet: content.content.substring(0, 150) + "...",
  }))

  // Search web for current information
  const webResults = await searchWeb(query, 3)

  return {
    websiteResults,
    webResults,
  }
}
