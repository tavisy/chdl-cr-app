import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { shouldAllowPublicAccess } from "@/lib/auth-bypass"

interface RecoveryIndicators {
  hasRecentSession: boolean
  sessionAge: number
  maxAge: number
  hasPasswordChanged: boolean
  hasVerified: boolean
  hasRecoveryParam: boolean
  fromSupabase: boolean
  fromMail: boolean
  fromAuth: boolean
  shouldRedirect: boolean
  reason: string
}

/**
 * Check if request has recovery indicators
 */
function checkRecoveryIndicators(
  req: NextRequest, 
  sessionAge: number, 
  searchParams: URLSearchParams
): RecoveryIndicators {
  const twoMinutesAgo = 2 * 60 * 1000 // Reduced from 5 minutes for stricter security
  const hasRecentSession = sessionAge < twoMinutesAgo
  
  // Check URL parameters for recovery completion indicators
  const hasPasswordChanged = searchParams.has("password_changed")
  const hasVerified = searchParams.has("verified")
  const hasRecoveryParam = searchParams.has("require_reset") || searchParams.has("from")
  
  // Check headers for recovery source indicators
  const userAgent = req.headers.get("user-agent") || ""
  const referer = req.headers.get("referer") || ""
  
  const fromSupabase = referer.includes("supabase") || referer.includes("auth")
  const fromMail = userAgent.includes("Mail") || userAgent.includes("mail")
  const fromAuth = referer.includes("auth") || referer.includes("callback")
  
  // Determine if we should redirect to password reset
  let shouldRedirect = false
  let reason = ""
  
  if (hasRecentSession) {
    if (!hasPasswordChanged && !hasVerified) {
      if (fromSupabase) {
        shouldRedirect = true
        reason = "Recent session from Supabase auth domain"
      } else if (fromMail) {
        shouldRedirect = true
        reason = "Recent session from email client"
      } else if (fromAuth) {
        shouldRedirect = true
        reason = "Recent session from auth callback"
      } else if (!hasRecoveryParam) {
        shouldRedirect = true
        reason = "Recent session without recovery parameters"
      }
    }
  }
  
  return {
    hasRecentSession,
    sessionAge,
    maxAge: twoMinutesAgo,
    hasPasswordChanged,
    hasVerified,
    hasRecoveryParam,
    fromSupabase,
    fromMail,
    fromAuth,
    shouldRedirect,
    reason
  }
}

/**
 * Log recovery detection for debugging
 */
function logRecoveryDetection(pathname: string, indicators: RecoveryIndicators, userId?: string): void {
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Middleware Recovery Detection:", {
      pathname,
      userId: userId?.substring(0, 8) + "..." || "none",
      ...indicators,
      sessionAgeSeconds: Math.round(indicators.sessionAge / 1000)
    })
  }
}

export async function middleware(req: NextRequest) {
  // Check if authentication should be bypassed
  const userAgent = req.headers.get("user-agent") || ""
  const allowPublicAccess = shouldAllowPublicAccess(userAgent)

  if (allowPublicAccess) {
    console.log("🚨 Middleware: Authentication bypass active, allowing request")
    return NextResponse.next()
  }

  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  try {
    // Get session with error handling
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.warn("Middleware: Session error:", sessionError.message)
      return res
    }

    // Only process authenticated users accessing protected routes
    if (!session?.user) {
      return res
    }

    const user = session.user
    const pathname = req.nextUrl.pathname
    const searchParams = req.nextUrl.searchParams

    // Skip processing for auth routes (they handle their own logic)
    if (pathname.startsWith("/auth/")) {
      return res
    }

    // Only check main app routes for recovery redirection
    if (pathname === "/" || pathname.startsWith("/dashboard") || pathname.startsWith("/app")) {
      const lastSignIn = new Date(user.last_sign_in_at || 0).getTime()
      const sessionAge = Date.now() - lastSignIn

      const recoveryIndicators = checkRecoveryIndicators(req, sessionAge, searchParams)
      
      // Log detection for debugging
      logRecoveryDetection(pathname, recoveryIndicators, user.id)

      if (recoveryIndicators.shouldRedirect) {
        console.log(`🔄 Middleware: Redirecting to password reset - ${recoveryIndicators.reason}`)
        
        // Construct redirect URL with comprehensive parameters
        const redirectUrl = new URL("/auth/reset-password", req.url)
        redirectUrl.searchParams.set("from", "recovery")
        redirectUrl.searchParams.set("security", "check")
        redirectUrl.searchParams.set("require_reset", "true")
        redirectUrl.searchParams.set("reason", encodeURIComponent(recoveryIndicators.reason))
        
        // Preserve any important original parameters
        if (searchParams.has("verified")) {
          redirectUrl.searchParams.set("verified", "true")
        }
        
        return NextResponse.redirect(redirectUrl)
      }

      // Additional security check for very recent sessions without proper completion flags
      if (recoveryIndicators.hasRecentSession && !recoveryIndicators.hasPasswordChanged && !recoveryIndicators.hasVerified) {
        // Check for edge cases that might indicate bypassed recovery
        const suspiciousPatterns = [
          // Direct access patterns
          !req.headers.get("referer"),
          // Browser navigation that might bypass recovery
          req.headers.get("sec-fetch-mode") === "navigate" && !recoveryIndicators.hasRecoveryParam,
          // Cache or bookmark access
          req.headers.get("cache-control")?.includes("max-age"),
        ]

        const hasSuspiciousPattern = suspiciousPatterns.some(Boolean)
        
        if (hasSuspiciousPattern) {
          console.log("⚠️ Middleware: Suspicious access pattern detected, enforcing security check")
          
          const redirectUrl = new URL("/auth/reset-password", req.url)
          redirectUrl.searchParams.set("from", "recovery")
          redirectUrl.searchParams.set("security", "check")
          redirectUrl.searchParams.set("require_reset", "true")
          redirectUrl.searchParams.set("reason", "suspicious_access_pattern")
          
          return NextResponse.redirect(redirectUrl)
        }
      }
    }

    // Enhanced admin route protection
    if (pathname.startsWith("/admin")) {
      const isAdmin = user.email?.includes("@carterhales") ||
                     user.email?.includes("@bignerdsolutions") ||
                     user.email?.includes("admin") ||
                     user.email === "tavisy@gmail.com" ||
                     user.email === "tavis@carterhales.com" ||
                     user.email === "tav@bignerdsolutions.com"

      if (!isAdmin) {
        console.log("🚫 Middleware: Non-admin user attempting to access admin route")
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    return res

  } catch (error) {
    console.error("Middleware: Unexpected error:", error)
    return res
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
