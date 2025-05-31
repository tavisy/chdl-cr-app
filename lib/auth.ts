import { supabase } from "./supabase"
import type { User, AuthError, AuthResponse, OAuthResponse } from "@supabase/supabase-js"

// Type definitions for better TypeScript support
interface SignInResponse {
  data: AuthResponse['data']
  error: AuthError | null
}

interface SignUpResponse {
  data: AuthResponse['data']
  error: AuthError | null
}

interface ResendResponse {
  data: any
  error: AuthError | null
}

interface SignOutResponse {
  error: AuthError | null
}

export async function signInWithEmail(email: string, password: string): Promise<SignInResponse> {
  console.log("Auth: Attempting email sign in for:", email)
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (data.user && !error) {
    console.log("Auth: Email sign in successful:", {
      email: data.user.email,
      emailConfirmed: data.user.email_confirmed_at,
      userId: data.user.id
    })
    await logAccess(data.user.id, "email")
  } else if (error) {
    console.error("Auth: Email sign in error:", error.message)
  }

  return { data, error }
}

export async function signUpWithEmail(
  email: string, 
  password: string, 
  fullName?: string
): Promise<SignUpResponse> {
  console.log("Auth: Attempting email sign up for:", email)
  
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

  if (data.user && !error) {
    console.log("Auth: Email sign up successful, confirmation email sent to:", email)
  } else if (error) {
    console.error("Auth: Email sign up error:", error.message)
  }

  return { data, error }
}

export async function signInWithGoogle(): Promise<OAuthResponse> {
  console.log("Auth: Attempting Google OAuth sign in")
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Auth: Google OAuth error:", error.message)
  }

  return { data, error }
}

export async function signOut(): Promise<SignOutResponse> {
  console.log("Auth: Signing out user")
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error("Auth: Sign out error:", error.message)
  } else {
    console.log("Auth: Sign out successful")
  }
  
  return { error }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    console.log("Auth: Getting current user...")
    
    // Use getUser() to get fresh user data from the database
    // This ensures we have the most up-to-date verification status
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Auth: Error getting current user:", error.message)
      return null
    }

    if (!user) {
      console.log("Auth: No current user found")
      return null
    }

    console.log("Auth: Current user retrieved:", {
      email: user.email,
      emailConfirmed: user.email_confirmed_at,
      provider: user.app_metadata?.provider,
      userId: user.id
    })

    return user
  } catch (err) {
    console.error("Auth: Exception getting current user:", err)
    return null
  }
}

export async function resendConfirmation(email: string): Promise<ResendResponse> {
  console.log("Auth: Resending confirmation email to:", email)
  
  const { data, error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    console.error("Auth: Resend confirmation error:", error.message)
  } else {
    console.log("Auth: Confirmation email resent successfully")
  }

  return { data, error }
}

/**
 * Helper function to check if a user has verified access to the application
 * @param user - The user object from Supabase
 * @returns boolean indicating if the user has access
 */
export function hasVerifiedAccess(user: User | null): boolean {
  if (!user) {
    console.log("Auth: No user provided for access check")
    return false
  }
  
  // Google OAuth users are automatically verified by Google
  const isGoogleUser = user.app_metadata?.provider === "google"
  
  if (isGoogleUser) {
    console.log("Auth: Google user has automatic access:", user.email)
    return true
  }
  
  // For email users, check if email is confirmed
  const isEmailVerified = !!user.email_confirmed_at
  
  console.log("Auth: Email user access check:", {
    email: user.email,
    emailConfirmed: user.email_confirmed_at,
    hasAccess: isEmailVerified
  })
  
  return isEmailVerified
}

/**
 * Refreshes the current user session and returns the updated user data
 * Useful when you need to check if a user's verification status has changed
 */
export async function refreshUserSession(): Promise<User | null> {
  try {
    console.log("Auth: Refreshing user session...")
    
    // Force a session refresh to get the latest user data
    const { data, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error("Auth: Session refresh error:", error.message)
      return null
    }
    
    if (data.user) {
      console.log("Auth: Session refreshed successfully:", {
        email: data.user.email,
        emailConfirmed: data.user.email_confirmed_at,
        provider: data.user.app_metadata?.provider
      })
    }
    
    return data.user
  } catch (err) {
    console.error("Auth: Exception refreshing session:", err)
    return null
  }
}

/**
 * Checks if a user needs email verification
 * @param user - The user object from Supabase
 * @returns boolean indicating if email verification is needed
 */
export function needsEmailVerification(user: User | null): boolean {
  if (!user) return false
  
  // Google users don't need email verification
  if (user.app_metadata?.provider === "google") {
    return false
  }
  
  // Email users need verification if email_confirmed_at is not set
  return !user.email_confirmed_at
}

export async function logAccess(userId: string, method: "email" | "google"): Promise<void> {
  try {
    const userAgent: string | null = typeof navigator !== "undefined" ? navigator.userAgent : null
    
    console.log("Auth: Logging access for user:", { userId, method })

    const { error } = await supabase.from("access_logs").insert({
      user_id: userId,
      login_method: method,
      user_agent: userAgent,
    })

    if (error) {
      console.error("Auth: Failed to log access:", error.message)
    } else {
      console.log("Auth: Access logged successfully")
    }
  } catch (err) {
    console.error("Auth: Exception logging access:", err)
  }
}
