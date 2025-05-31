import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export async function signInWithEmail(email: string, password: string) {
  try {
    console.log("Auth: Signing in with email:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log("Auth: Sign in result:", {
      hasUser: !!data.user,
      hasSession: !!data.session,
      error: error?.message,
    })

    if (data.user && !error) {
      await logAccess(data.user.id, "email")
    }

    return { data, error }
  } catch (err) {
    console.error("Auth: Sign in error:", err)
    return { data: null, error: { message: "An unexpected error occurred" } }
  }
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  try {
    console.log("Auth: Signing up with email:", email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    console.log("Auth: Sign up result:", {
      hasUser: !!data.user,
      hasSession: !!data.session,
      error: error?.message,
    })

    return { data, error }
  } catch (err) {
    console.error("Auth: Sign up error:", err)
    return { data: null, error: { message: "An unexpected error occurred" } }
  }
}

export async function signInWithGoogle() {
  try {
    console.log("Auth: Signing in with Google")

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    console.log("Auth: Google sign in result:", { error: error?.message })
    return { data, error }
  } catch (err) {
    console.error("Auth: Google sign in error:", err)
    return { data: null, error: { message: "An unexpected error occurred" } }
  }
}

export async function signOut() {
  try {
    console.log("Auth: Signing out")
    const { error } = await supabase.auth.signOut()
    console.log("Auth: Sign out result:", { error: error?.message })
    return { error }
  } catch (err) {
    console.error("Auth: Sign out error:", err)
    return { error: { message: "An unexpected error occurred" } }
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // First check if we have a session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session) {
      console.log("Auth: No current session")
      return null
    }

    console.log("Auth: Current user:", {
      email: session.user?.email,
      confirmed: !!session.user?.email_confirmed_at,
    })

    return session.user
  } catch (err) {
    console.error("Auth: Error getting current user:", err)
    return null
  }
}

export async function resendConfirmation(email: string) {
  try {
    console.log("Auth: Resending confirmation to:", email)

    const { data, error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    console.log("Auth: Resend result:", { error: error?.message })
    return { data, error }
  } catch (err) {
    console.error("Auth: Resend error:", err)
    return { data: null, error: { message: "An unexpected error occurred" } }
  }
}

export async function logAccess(userId: string, method: "email" | "google") {
  try {
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : null

    const { error } = await supabase.from("access_logs").insert({
      user_id: userId,
      login_method: method,
      user_agent: userAgent,
    })

    if (error) {
      console.error("Auth: Failed to log access:", error)
    } else {
      console.log("Auth: Access logged successfully")
    }
  } catch (err) {
    console.error("Auth: Error logging access:", err)
  }
}
