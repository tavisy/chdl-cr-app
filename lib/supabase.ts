import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

// Create a single instance to avoid multiple clients warning
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export function createClient() {
  if (!supabaseClient) {
    supabaseClient = createClientComponentClient<Database>()
  }
  return supabaseClient
}

// Export the singleton instance
export const supabase = createClient()

// Types for our database tables
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface AccessLog {
  id: string
  user_id: string
  accessed_at: string
  ip_address: string | null
  login_method: string | null
  user_agent: string | null
}
