import { openai } from "@ai-sdk/openai"
import { streamText, convertToCoreMessages } from "ai"
import { createClient } from "@supabase/supabase-js"

// Create Supabase client for logging
const supabaseUrl = process.env.SUPABASE_URL || ""
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Website content knowledge base
const WEBSITE_KNOWLEDGE = `
Crown Royal Strategic Report - Key Information:

EXECUTIVE SUMMARY:
Crown Royal faces challenges in premiumization and bourbon enthusiast engagement. Key opportunities include leveraging Canadian heritage, expanding premium offerings, and targeting bourbon enthusiasts through authentic storytelling and experiential marketing.

CANADIAN IDENTITY INSIGHTS:
- Crown Royal represents Canadian whisky heritage and craftsmanship
- Opportunity to differentiate from American bourbon through Canadian authenticity
- Heritage storytelling can drive premium positioning

CONSUMER INSIGHTS:
- Bourbon enthusiasts value authenticity, craftsmanship, and heritage
- Premium consumers seek unique experiences and limited editions
- Social media and digital engagement crucial for younger demographics

COMPETITIVE ANALYSIS:
- Competing against established bourbon brands like Buffalo Trace, Maker's Mark
- Need to differentiate through Canadian heritage and premium positioning
- Opportunity in super-premium segment with limited releases

MARKET DISRUPTION OPPORTUNITIES:
- Digital-first marketing approach
- Experiential marketing and distillery tours
- Limited edition releases and collector programs
- Bourbon education and tasting experiences

STRATEGIC RECOMMENDATIONS:
1. Leverage Canadian heritage for differentiation
2. Develop premium and super-premium product lines
3. Create bourbon enthusiast engagement programs
4. Invest in experiential marketing
5. Build digital community and education platform
6. Partner with bourbon influencers and experts
7. Develop limited edition collector series
`

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

    // Log the interaction
    try {
      await supabase.from("chat_logs").insert({
        user_id: "anonymous", // In production, get from auth
        message: lastMessage?.content || "",
        response_preview: "AI response generated",
        sources_count: 0,
        created_at: new Date().toISOString(),
      })
    } catch (logError) {
      console.warn("Failed to log chat interaction:", logError)
      // Continue with chat even if logging fails
    }

    // Create enhanced system prompt
    const systemPrompt = `You are an AI assistant specialized in Crown Royal's strategic positioning and bourbon market analysis. You have access to comprehensive research about Crown Royal's market position, consumer insights, competitive landscape, and strategic recommendations.

Website Knowledge Base:
${WEBSITE_KNOWLEDGE}

Instructions:
1. Provide detailed, strategic insights about Crown Royal and the bourbon/whisky market
2. Reference specific data points and recommendations from the research
3. When appropriate, mention both historical context and current market trends
4. Be conversational but professional
5. If asked about topics outside Crown Royal/whisky strategy, politely redirect to relevant strategic topics
6. Keep responses concise and actionable

Remember: You're helping stakeholders understand Crown Royal's strategic opportunities and market positioning.`

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
