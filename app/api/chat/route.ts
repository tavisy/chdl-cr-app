import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages } from "ai"
import { createClient } from "@supabase/supabase-js"
import { searchKnowledgeBase } from "@/lib/knowledge-base"

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

    // Search the knowledge base for relevant content
    const relevantContent = searchKnowledgeBase(userQuery)

    // Log the interaction
    try {
      await supabase.from("chat_logs").insert({
        user_id: "anonymous", // In production, get from auth
        message: userQuery,
        response_preview: "AI response generated",
        sources_count: relevantContent.length,
        created_at: new Date().toISOString(),
      })
    } catch (logError) {
      console.warn("Failed to log chat interaction:", logError)
      // Continue with chat even if logging fails
    }

    // Create context from relevant content
    const contextSections = relevantContent
      .slice(0, 3)
      .map((item) => `[${item.section}]\n${item.content}`)
      .join("\n\n")

    // Get the section names for source attribution
    const sourceSections = relevantContent.slice(0, 3).map((item) => item.section)

    // Create enhanced system prompt with microsite content priority
    const systemPrompt = `You are an AI assistant specialized in Crown Royal's strategic positioning and bourbon market analysis. You have access to comprehensive research about Crown Royal's market position, consumer insights, competitive landscape, and strategic recommendations.

CRITICAL INSTRUCTION: You MUST include source citations in your responses using this exact format: [Source: Section Name]

When referencing information from the microsite, you MUST cite the source using these exact section names:
- [Source: Executive Summary]
- [Source: Canadian Identity] 
- [Source: Consumer Insights]
- [Source: Competitive Analysis]
- [Source: Market Disruption]
- [Source: Strategic Recommendations]
- [Source: References]

Relevant microsite content for this query:
${contextSections}

Available sources for this response: ${sourceSections.join(", ")}

Instructions:
1. ALWAYS prioritize information from the Crown Royal microsite content provided above
2. MUST include [Source: Section Name] citations when referencing specific information
3. Provide detailed, strategic insights based on the microsite research
4. Reference specific data points and recommendations from the research
5. Be conversational but professional
6. If asked about topics outside Crown Royal/whisky strategy, politely redirect to relevant strategic topics
7. End your response with a summary of sources used

Example response format:
"According to our research [Source: Consumer Insights], bourbon enthusiasts value authenticity and craftsmanship. The strategic analysis shows [Source: Strategic Recommendations] that Crown Royal should leverage its Canadian heritage..."

Remember: You're helping stakeholders understand Crown Royal's strategic opportunities and market positioning based on the official microsite content. ALWAYS include source citations.`

    const result = await streamText({
      model: openai("gpt-4o-mini"), // Using mini model for better reliability
      messages: [{ role: "system", content: systemPrompt }, ...convertToCoreMessages(messages)],
      temperature: 0.7,
      maxTokens: 800,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Chat API error:", error)

    // Return a more detailed error response
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
