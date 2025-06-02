import { createClientComponentClient, createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/types/database"

// Ensure we only create one instance globally
const createSupabaseClient = () => {
  return createClientComponentClient<Database>()
}

// Use a global variable to store the client instance
declare global {
  var __supabase: ReturnType<typeof createSupabaseClient> | undefined
}

// Create or reuse the singleton instance
export const supabase = globalThis.__supabase ?? createSupabaseClient()

// Only set global in browser environment
if (typeof window !== "undefined") {
  globalThis.__supabase = supabase
}

// Functional getter for consistency with other patterns
export const getSupabaseClient = () => {
  if (typeof window === 'undefined') {
    throw new Error('getSupabaseClient can only be used on the client side')
  }
  return supabase
}

// Server-side client factory (for API routes)
export const getSupabaseServerClient = (cookies: any) => {
  return createRouteHandlerClient<Database>({ cookies })
}

// Types for our database tables
export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  last_login_at?: string
  login_count?: number
}

export interface AccessLog {
  id: string
  user_id: string
  accessed_at: string
  ip_address: string | null
  login_method: string | null
  user_agent: string | null
}

// Export the Database type for convenience
export type { Database }
