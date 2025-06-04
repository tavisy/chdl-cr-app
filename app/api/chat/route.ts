import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages } from "ai"
import { createClient } from "@supabase/supabase-js"
import { searchKnowledgeBase, getSectionsByPriority } from "@/lib/knowledge-base"

// Create Supabase client for logging
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const lastMessage = messages[messages.length - 1]
    const userQuery = lastMessage?.content || ""

    // Enhanced search with the updated knowledge base
    const relevantContent = searchKnowledgeBase(userQuery)
    
    // Get high-priority sections as additional context
    const prioritySections = getSectionsByPriority(9)

    // Log the interaction with enhanced metadata
    try {
      await supabase.from("chat_logs").insert({
        user_id: "anonymous", // In production, get from auth
        message: userQuery,
        response_preview: "AI response generated",
        sources_count: relevantContent.length,
        top_source: relevantContent[0]?.section || null,
        relevance_score: relevantContent[0]?.relevance || 0,
        priority_level: relevantContent[0]?.priority || 0,
        created_at: new Date().toISOString(),
      })
    } catch (logError) {
      console.warn("Failed to log chat interaction:", logError)
    }

    // Create hierarchical context with clear priority distinction
    const primarySources = relevantContent
      .filter(item => item.relevance > 20 && item.priority >= 9)
      .slice(0, 2) // Top 2 most relevant high-priority sources

    const secondarySources = relevantContent
      .filter(item => (item.relevance <= 20 || item.priority < 9) && item.relevance > 8)
      .slice(0, 2) // Additional supporting sources

    // Format context with clear source hierarchy - preserve exact text
    const contextSections = [
      // Primary sources (highest relevance + priority)
      ...primarySources.map(item => 
        `[PRIMARY SOURCE - ${item.section}] (Relevance: ${item.relevance}, Priority: ${item.priority})
${item.content}
[END PRIMARY SOURCE]`
      ),
      // Secondary sources (lower relevance or priority)
      ...secondarySources.map(item => 
        `[SECONDARY SOURCE - ${item.section}] (Relevance: ${item.relevance}, Priority: ${item.priority})
${item.content}
[END SECONDARY SOURCE]`
      )
    ].join('\n\n')

    // Collect all source information for citation requirements
    const allSources = [...primarySources, ...secondarySources]
    const sourceSections = allSources.map(item => item.section)

    // Enhanced system prompt with EXACT TEXT preservation requirements
    const systemPrompt = `You are the official Crown Royal Strategic Analysis AI Assistant with exclusive access to Crown Royal's microsite content.

🔥 ABSOLUTE REQUIREMENTS FOR EXACT TEXT PRESERVATION:
1. PRESERVE EXACT TEXT - Use the EXACT wording, formatting, and punctuation from the microsite content
2. NO PARAPHRASING - Do not rephrase, summarize, or alter the original text in any way
3. DIRECT QUOTES ONLY - When referencing content, use direct verbatim quotes with quotation marks
4. EXACT STATISTICS - Preserve all numbers, percentages, and data points exactly as written
5. MAINTAIN FORMATTING - Preserve bullet points, dashes, colons, and list structures exactly
6. EXACT TERMINOLOGY - Use the precise terms and phrases from the microsite (e.g., "bourbon enthusiast", "Canadian terroir", "authentic differentiators")

AVAILABLE MICROSITE CONTENT (Use EXACT text from these sources):
${contextSections}

AVAILABLE SOURCES FOR CITATION: ${sourceSections.join(", ")}

CRITICAL RESPONSE REQUIREMENTS:
✅ MUST: Use EXACT quotes with quotation marks when referencing specific content
✅ MUST: Preserve original formatting (bullet points, dashes, numbers)
✅ MUST: Cite every quote with [Source: Section Name]
✅ MUST: Use PRIMARY SOURCES first, then SECONDARY SOURCES
✅ MUST: End with "Sources: [list all sources used in this response]"

❌ NEVER: Paraphrase or rephrase the original content
❌ NEVER: Change numbers, percentages, or statistics
❌ NEVER: Alter bullet point formatting or list structures
❌ NEVER: Add information not explicitly stated in the sources
❌ NEVER: Use synonyms or alternative phrasing

RESPONSE FORMAT:
1. Answer using EXACT quotes from PRIMARY SOURCES
2. Support with EXACT quotes from SECONDARY SOURCES if needed
3. Maintain original formatting and punctuation exactly
4. List all sources used

EXACT CITATION EXAMPLES:
- "According to [Source: Strategic Recommendations], Crown Royal should 'Position the royal narrative as a legacy of Canadian excellence, attention to detail, and craftsmanship, fit for discerning palates, rather than outdated pomp.'"
- "The research shows [Source: Consumer Insights] that '82% of bourbon enthusiasts are open to premium Canadian whisky alternatives.'"

REMEMBER: You are representing Crown Royal's official research. Every word must be exactly as written in the microsite content. Preserve all formatting, punctuation, and precise terminology.`

    const result = await streamText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt }, 
        ...convertToCoreMessages(messages)
      ],
      temperature: 0.1, // Very low temperature for maximum consistency and exact text preservation
      maxTokens: 1500, // Increased for comprehensive responses with exact quotes
      presencePenalty: 0, // No penalty to encourage exact reproduction
      frequencyPenalty: 0, // No penalty to maintain exact text
      topP: 0.9, // Slightly reduced for more deterministic responses
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
