import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Create admin client with service role key
const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export async function GET(request: Request) {
  try {
    // Get the current user to verify admin access
    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const isAdmin =
      user.email?.includes("@carterhales") ||
      user.email?.includes("@bignerd") ||
      user.email?.includes("admin") ||
      user.email === "tavis@gmail.com" ||
      user.email === "tav@bignerdlsolutions.com"

    if (!isAdmin) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    // Get time range from query params
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"

    // Calculate date range
    const now = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case "24h":
        startDate.setHours(startDate.getHours() - 24)
        break
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    // Use service role to get ALL access logs (bypasses RLS)
    const { data: accessLogs, error: logsError } = await supabaseAdmin
      .from("access_logs")
      .select("*")
      .gte("accessed_at", startDate.toISOString())
      .order("accessed_at", { ascending: false })

    if (logsError) {
      console.error("Error fetching access logs:", logsError)
      return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 })
    }

    return NextResponse.json({ logs: accessLogs })
  } catch (error) {
    console.error("Admin logs API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
