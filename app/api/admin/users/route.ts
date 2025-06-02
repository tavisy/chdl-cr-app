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

export async function GET() {
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

    // Use service role to get ALL users (bypasses RLS)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError)
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
    }

    return NextResponse.json({ users: profiles })
  } catch (error) {
    console.error("Admin users API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
