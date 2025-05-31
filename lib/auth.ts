import { supabase } from "./supabase"

export async function signInWithEmail(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (!error && data.user) {
    // Check if email is confirmed
    if (!data.user.email_confirmed_at) {
      return {
        data: null,
        error: {
          message: "Please check your email and click the confirmation link before signing in.",
        },
      }
    }
    await logAccess(data.user.id, "email")
  }

  return { data, error }
}

export async function signUpWithEmail(email: string, password: string, fullName?: string) {
  // Get the current origin, but use a fallback for production
  const getRedirectUrl = () => {
    if (typeof window !== "undefined") {
      // In development, use localhost
      if (window.location.hostname === "localhost") {
        return `${window.location.origin}/auth/callback?type=signup`
      }
      // In production, use the actual domain
      return `${window.location.origin}/auth/callback?type=signup`
    }
    // Fallback - you should replace this with your actual production domain
    return "https://your-production-domain.com/auth/callback?type=signup"
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: getRedirectUrl(),
    },
  })

  return { data, error }
}

export async function signInWithGoogle() {
  try {
    const getRedirectUrl = () => {
      if (typeof window !== "undefined") {
        return `${window.location.origin}/auth/callback`
      }
      return "https://your-production-domain.com/auth/callback"
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getRedirectUrl(),
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("Google OAuth error:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Unexpected Google OAuth error:", err)
    return {
      data: null,
      error: {
        message: "Failed to initialize Google sign-in. Please check your configuration.",
      },
    }
  }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function resendConfirmation(email: string) {
  const getRedirectUrl = () => {
    if (typeof window !== "undefined") {
      if (window.location.hostname === "localhost") {
        return `${window.location.origin}/auth/callback?type=signup`
      }
      return `${window.location.origin}/auth/callback?type=signup`
    }
    return "https://your-production-domain.com/auth/callback?type=signup"
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: getRedirectUrl(),
    },
  })

  return { error }
}

export async function logAccess(userId: string, method: "email" | "google") {
  const { error } = await supabase.from("access_logs").insert({
    user_id: userId,
    login_method: method,
    user_agent: navigator.userAgent,
  })

  if (error) {
    console.error("Error logging access:", error)
  }
}

export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}
