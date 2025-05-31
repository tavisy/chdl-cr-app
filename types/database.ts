export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      access_logs: {
        Row: {
          id: string
          user_id: string
          accessed_at: string
          ip_address: string | null
          login_method: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          user_id: string
          accessed_at?: string
          ip_address?: string | null
          login_method?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          accessed_at?: string
          ip_address?: string | null
          login_method?: string | null
          user_agent?: string | null
        }
      }
    }
  }
}
