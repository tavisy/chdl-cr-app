import { createClient } from "./supabase"

export async function logUserAccess(loginMethod = "email") {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    // Get user's IP and user agent (in a real app, you'd get this from headers)
    const userAgent = navigator.userAgent

    const { error } = await supabase.from("access_logs").insert({
      user_id: user.id,
      login_method: loginMethod,
      user_agent: userAgent,
      accessed_at: new Date().toISOString(),
    })

    if (error) {
      console.error("Error logging access:", error)
    }
  } catch (error) {
    console.error("Error in logUserAccess:", error)
  }
}

export async function updateUserProfile(updates: {
  full_name?: string
  avatar_url?: string
}) {
  const supabase = createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error("No user found")

    const { error } = await supabase
      .from("profiles")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error }
  }
}

export async function getUserProfile(userId: string) {
  const supabase = createClient()

  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) throw error

    return { data, error: null }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return { data: null, error }
  }
}
