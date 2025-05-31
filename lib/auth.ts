import { supabase } from "./supabase"
import type { User } from "@supabase/supabase-js"

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (data.user && !error) {
    await logAccess(data.user.id, "email")
  }

  return { data, error }
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
    },
  })

  return { data, error }
}

export async function signInWithGoogle() {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser(): Promise<User | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function resendConfirmation(email: string) {
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback?type=signup`,
    },
  })

  return { data, error }
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
      console.error("Failed to log access:", error)
    }
  } catch (err) {
    console.error("Error logging access:", err)
  }
}
