// @/lib/auth.ts - Complete auth library with all required exports

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"

const supabase = createClientComponentClient()

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
  is_admin: boolean
  role: string
  last_login_at: string | null
  is_active: boolean
  login_count: number
}

export interface AccessLog {
  id: string
  user_id: string
  login_method: "email" | "google"
  ip_address: string | null
  user_agent: string | null
  accessed_at: string
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting current user:", error)
      return null
    }

    return user
  } catch (error) {
    console.error("Exception getting current user:", error)
    return null
  }
}

/**
 * Check if user has verified access
 */
export function hasVerifiedAccess(user: User): boolean {
  if (!user) return false

  // Check if email is confirmed
  const emailConfirmed = !!user.email_confirmed_at

  // For Google users, they're automatically verified
  const isGoogleUser = user.app_metadata?.provider === "google"

  return emailConfirmed || isGoogleUser
}

/**
 * Check if user needs email verification
 */
export function needsEmailVerification(user: User): boolean {
  if (!user) return false

  // Google users don't need email verification
  const isGoogleUser = user.app_metadata?.provider === "google"
  if (isGoogleUser) return false

  // Email users need verification if email is not confirmed
  return !user.email_confirmed_at
}

/**
 * Set recovery state flag to track password reset flow
 */
export function setRecoveryState(): void {
  if (typeof window !== "undefined") {
    try {
      sessionStorage.setItem("password_reset_initiated", Date.now().toString())
      console.log("Recovery state flag set")
    } catch (error) {
      console.warn("Failed to set recovery state:", error)
    }
  }
}

/**
 * Check and clear recovery state
 */
export function checkAndClearRecoveryState(): boolean {
  if (typeof window === "undefined") return false
  
  try {
    const recoveryTime = sessionStorage.getItem("password_reset_initiated")
    if (recoveryTime) {
      const timeDiff = Date.now() - parseInt(recoveryTime)
      const isValid = timeDiff < 10 * 60 * 1000 // 10 minutes
      
      if (isValid) {
        sessionStorage.removeItem("password_reset_initiated")
        console.log("Recovery state validated and cleared")
        return true
      } else {
        // Clear expired recovery state
        sessionStorage.removeItem("password_reset_initiated")
        console.log("Recovery state expired, cleared")
      }
    }
  } catch (error) {
    console.warn("Failed to check recovery state:", error)
  }
  
  return false
}

/**
 * Create or update user profile
 */
async function upsertProfile(user: User): Promise<void> {
  try {
    const profileData = {
      id: user.id,
      email: user.email,
      full_name:
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.raw_user_meta_data?.full_name ||
        user.raw_user_meta_data?.name ||
        null,
      avatar_url:
        user.user_metadata?.avatar_url ||
        user.user_metadata?.picture ||
        user.raw_user_meta_data?.avatar_url ||
        user.raw_user_meta_data?.picture ||
        null,
      updated_at: new Date().toISOString(),
      // Don't update login fields here - that's done separately
    }

    const { error } = await supabase.from("profiles").upsert(profileData, {
      onConflict: "id",
      ignoreDuplicates: false,
    })

    if (error) {
      console.error("Error upserting profile:", error)
    } else {
      console.log("Profile upserted successfully for:", user.email)
    }
  } catch (error) {
    console.error("Exception upserting profile:", error)
  }
}

/**
 * Update login tracking in profile
 */
async function updateLoginTracking(userId: string): Promise<void> {
  try {
    // First, get current login count
    const { data: currentProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("login_count")
      .eq("id", userId)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching current profile:", fetchError)
      return
    }

    const currentCount = currentProfile?.login_count || 0

    // Update login tracking
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        last_login_at: new Date().toISOString(),
        login_count: currentCount + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)

    if (updateError) {
      console.error("Error updating login tracking:", updateError)
    } else {
      console.log(`Login tracking updated for user ${userId}. Count: ${currentCount + 1}`)
    }
  } catch (error) {
    console.error("Exception updating login tracking:", error)
  }
}

/**
 * Log user access and update profile
 */
export async function logAccess(
  userId: string,
  loginMethod: "email" | "google",
  options: {
    updateProfile?: boolean
    ipAddress?: string
    userAgent?: string
  } = {},
): Promise<void> {
  const { updateProfile = true, ipAddress = null, userAgent = null } = options

  try {
    console.log(`Logging access for user ${userId} via ${loginMethod}`)

    // Get user agent from browser if not provided
    const finalUserAgent = userAgent || (typeof window !== "undefined" ? window.navigator.userAgent : null)

    // Log to access_logs table
    const accessLogData = {
      user_id: userId,
      login_method: loginMethod,
      ip_address: ipAddress,
      user_agent: finalUserAgent,
      accessed_at: new Date().toISOString(),
    }

    const { error: logError } = await supabase.from("access_logs").insert([accessLogData])

    if (logError) {
      console.error("Error logging access:", logError)
    } else {
      console.log("Access logged successfully")
    }

    // Update profile login tracking if requested
    if (updateProfile) {
      await updateLoginTracking(userId)
    }
  } catch (error) {
    console.error("Exception in logAccess:", error)
  }
}

/**
 * Enhanced log access with user profile creation/update
 */
export async function logAccessWithProfile(
  user: User,
  loginMethod: "email" | "google",
  metadata?: {
    userAgent?: string
    ipAddress?: string
    sessionType?: string
    recoveryFlow?: boolean
  },
): Promise<void> {
  try {
    console.log(`Enhanced access logging for user ${user.id} via ${loginMethod}`)

    // First, ensure profile exists and is up to date
    await upsertProfile(user)

    // Prepare enhanced metadata
    const enhancedMetadata = {
      userAgent: metadata?.userAgent || (typeof window !== "undefined" ? window.navigator.userAgent : null),
      ipAddress: metadata?.ipAddress || getClientIP(),
      ...metadata,
    }

    // Log access with enhanced metadata
    await logAccess(user.id, loginMethod, {
      updateProfile: true,
      userAgent: enhancedMetadata.userAgent,
      ipAddress: enhancedMetadata.ipAddress,
    })

    // Log additional metadata if provided
    if (metadata?.sessionType || metadata?.recoveryFlow) {
      console.log("Enhanced access metadata:", {
        userId: user.id,
        sessionType: metadata.sessionType,
        recoveryFlow: metadata.recoveryFlow,
        timestamp: new Date().toISOString(),
      })
    }
  } catch (error) {
    console.error("Exception in logAccessWithProfile:", error)
    // Fallback to basic logging if enhanced logging fails
    try {
      await logAccess(user.id, loginMethod, {
        updateProfile: true,
        userAgent: metadata?.userAgent,
      })
    } catch (fallbackError) {
      console.error("Fallback logging also failed:", fallbackError)
    }
  }
}

/**
 * Resend email confirmation
 */
export async function resendConfirmation(email: string): Promise<{ error?: any }> {
  try {
    console.log("Resending confirmation email for:", email)

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    })

    if (error) {
      console.error("Error resending confirmation:", error)
      return { error }
    }

    console.log("Confirmation email sent successfully")
    return {}
  } catch (error) {
    console.error("Exception resending confirmation:", error)
    return { error }
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordReset(email: string): Promise<{ error?: any }> {
  try {
    console.log("Sending password reset email for:", email)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery&require_reset=true`,
    })

    if (error) {
      console.error("Error sending password reset:", error)
      return { error }
    }

    console.log("Password reset email sent successfully")
    
    // Set recovery state flag to track the password reset flow
    setRecoveryState()
    
    return {}
  } catch (error) {
    console.error("Exception sending password reset:", error)
    return { error }
  }
}

/**
 * Sign up with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  metadata?: { fullName?: string },
): Promise<{ user?: User; error?: any }> {
  try {
    console.log("Signing up user with email:", email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: metadata?.fullName || null,
        },
        // Use callback URL for proper flow
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("Error signing up:", error)
      return { error }
    }

    if (data.user) {
      console.log("User signed up successfully:", data.user.email)

      // Don't log access here since email needs to be verified first
      return { user: data.user }
    }

    return { error: new Error("Sign up failed - no user returned") }
  } catch (error) {
    console.error("Exception during sign up:", error)
    return { error }
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail(email: string, password: string): Promise<{ user?: User; error?: any }> {
  try {
    console.log("Signing in user with email:", email)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in:", error)
      return { error }
    }

    if (data.user) {
      console.log("User signed in successfully:", data.user.email)

      // Log access with profile update
      await logAccessWithProfile(data.user, "email", {
        sessionType: "password_login",
      })

      return { user: data.user }
    }

    return { error: new Error("Sign in failed - no user returned") }
  } catch (error) {
    console.error("Exception during sign in:", error)
    return { error }
  }
}

/**
 * Sign in with Google
 */
export async function signInWithGoogle(): Promise<{ error?: any }> {
  try {
    console.log("Initiating Google sign in...")

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    })

    if (error) {
      console.error("Error with Google sign in:", error)
      return { error }
    }

    // OAuth redirect happens here, so no return needed
    return {}
  } catch (error) {
    console.error("Exception during Google sign in:", error)
    return { error }
  }
}

/**
 * Update user password
 */
export async function updatePassword(newPassword: string): Promise<{ error?: any }> {
  try {
    console.log("Updating user password...")

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      console.error("Error updating password:", error)
      return { error }
    }

    console.log("Password updated successfully")
    
    // Clear any recovery state since password has been successfully updated
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem("password_reset_initiated")
        console.log("Recovery state cleared after successful password update")
      } catch (error) {
        console.warn("Failed to clear recovery state:", error)
      }
    }
    
    return {}
  } catch (error) {
    console.error("Exception updating password:", error)
    return { error }
  }
}

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Exception fetching user profile:", error)
    return null
  }
}

/**
 * Check if user is admin based on profile
 */
export function isAdmin(user: User): boolean {
  if (!user?.email) return false

  const adminEmails = ["tav@bignerdlsolutions.com", "tavis@gmail.com", "tavisy@gmail.com", "tavisadmin@carterhales.com"]

  const adminDomains = ["@carterhales", "@bignerd"]

  // Check exact email matches
  if (adminEmails.includes(user.email)) return true

  // Check domain matches
  return adminDomains.some((domain) => user.email!.includes(domain))
}

/**
 * Get client IP address (works in browser and server)
 */
export function getClientIP(): string | null {
  if (typeof window === "undefined") {
    // Server-side - would need request headers
    return null
  }

  // Client-side - limited options, but we can try
  // Note: This won't give real IP due to browser security
  return null
}

/**
 * Sign out user and clean up
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error("Error signing out:", error)
    } else {
      console.log("User signed out successfully")
      
      // Clear any recovery state on sign out
      if (typeof window !== "undefined") {
        try {
          sessionStorage.removeItem("password_reset_initiated")
        } catch (error) {
          console.warn("Failed to clear recovery state on sign out:", error)
        }
      }
      
      // Redirect to login page
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    }
  } catch (error) {
    console.error("Exception during sign out:", error)
  }
}

export { supabase }
