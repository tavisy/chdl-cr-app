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

    // Create enhanced system prompt with microsite content priority
    const systemPrompt = `You are an AI assistant specialized in Crown Royal's strategic positioning and bourbon market analysis. You have access to comprehensive research about Crown Royal's market position, consumer insights, competitive landscape, and strategic recommendations.

IMPORTANT: You must prioritize information from the Crown Royal microsite when answering questions. The microsite contains the most accurate and up-to-date information about Crown Royal's strategy.

Relevant microsite content for this query:
${contextSections}

Complete knowledge base sections available:
- Executive Summary: Overview of Crown Royal's strategic challenges and opportunities
- Canadian Identity: How Crown Royal's Canadian heritage provides strategic advantages
- Consumer Insights: Detailed analysis of bourbon enthusiast demographics and behaviors
- Competitive Analysis: Assessment of the premium bourbon landscape and Crown Royal's position
- Market Disruption: Opportunities for digital marketing, experiential programs, and product innovation
- Strategic Recommendations: Seven key strategic imperatives for Crown Royal's growth
- References: Research sources and methodological notes

Instructions:
1. ALWAYS prioritize information from the Crown Royal microsite content provided above
2. Provide detailed, strategic insights based on the microsite research
3. Reference specific data points and recommendations from the research
4. Be conversational but professional
5. If asked about topics outside Crown Royal/whisky strategy, politely redirect to relevant strategic topics
6. When citing information, mention which section of the microsite it comes from

Remember: You're helping stakeholders understand Crown Royal's strategic opportunities and market positioning based on the official microsite content.`

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
