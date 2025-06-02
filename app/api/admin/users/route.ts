import { createClient } from "@supabase/supabase-js"
import { getSupabaseServerClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import type { Database } from "@/types/database"

// Create admin client with service role key (singleton pattern)
let supabaseAdmin: ReturnType<typeof createClient<Database>> | null = null

const getSupabaseAdmin = () => {
  if (!supabaseAdmin) {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required Supabase environment variables")
    }
    
    supabaseAdmin = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )
  }
  return supabaseAdmin
}

// Centralized admin email check
const ADMIN_EMAILS = new Set([
  "tavisy@gmail.com",
  "tavis@carterhales.com", 
  "tav@bignerdsolutions.com"
])

const ADMIN_DOMAINS = new Set([
  "@carterhales",
  "@bignerdsolutions", 
])

const isAdminUser = (email: string): boolean => {
  if (ADMIN_EMAILS.has(email.toLowerCase())) {
    return true
  }
  
  return ADMIN_DOMAINS.some(domain => email.toLowerCase().includes(domain)) || 
         email.toLowerCase().includes("admin")
}

// Helper function to get date cutoff based on time range
const getDateCutoff = (range: string): Date => {
  const now = new Date()
  switch (range) {
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get("timeRange") || "7d"
    const limit = parseInt(searchParams.get("limit") || "1000")
    
    console.log(`Admin Users API: Fetching users for timeRange: ${timeRange}`)

    // Get the current user to verify admin access using singleton
    const supabase = getSupabaseServerClient(cookies)
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error("Auth error:", userError.message)
      return NextResponse.json({ error: "Authentication failed" }, { status: 401 })
    }

    if (!user?.email) {
      return NextResponse.json({ error: "No authenticated user found" }, { status: 401 })
    }

    // Check if user is admin using centralized function
    if (!isAdminUser(user.email)) {
      console.warn(`Unauthorized admin access attempt by: ${user.email}`)
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    console.log(`Admin access granted for: ${user.email}`)

    // Get admin client using singleton
    const admin = getSupabaseAdmin()
    
    // Calculate date cutoff for filtering
    const dateCutoff = getDateCutoff(timeRange)
    
    // Build query with time-based filtering
    let query = admin
      .from("profiles")
      .select(`
        id,
        email,
        full_name,
        avatar_url,
        created_at,
        updated_at,
        last_login_at,
        login_count
      `)
      .order("created_at", { ascending: false })
      .limit(limit)

    // Apply time-based filtering
    if (timeRange !== "all") {
      query = query.or(
        `created_at.gte.${dateCutoff.toISOString()},last_login_at.gte.${dateCutoff.toISOString()}`
      )
    }

    const { data: profiles, error: profilesError } = await query

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json(
        { error: "Failed to fetch users", details: profilesError.message }, 
        { status: 500 }
      )
    }

    console.log(`Successfully fetched ${profiles?.length || 0} users`)

    // Return users with metadata
    return NextResponse.json({ 
      users: profiles || [],
      meta: {
        timeRange,
        dateCutoff: dateCutoff.toISOString(),
        total: profiles?.length || 0,
        limit
      }
    })

  } catch (error) {
    console.error("Admin users API error:", error)
    
    // Provide more specific error information in development
    const errorMessage = process.env.NODE_ENV === "development" 
      ? (error as Error).message 
      : "Internal server error"

    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    )
  }
}

// Add support for other HTTP methods if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Allow": "GET, OPTIONS",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
