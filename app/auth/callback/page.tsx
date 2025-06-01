"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { logAccess, hasVerifiedAccess } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { AuthError, User } from "@supabase/supabase-js"

type AuthStatus = "loading" | "success" | "error" | "recovery"

interface DebugInfo {
  error?: string
  errorDescription?: string
  exchangeError?: AuthError
  step?: string
  timestamp?: string
  fullUrl?: string
  type?: string | null
  isRecovery?: boolean
  userEmail?: string
  provider?: string
  hasAccess?: boolean
}

export default function AuthCallbackPage(): JSX.Element {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [message, setMessage] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const processedRef = useRef<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Memoized error handler
  const handleError = useCallback((error: string, description?: string, debug?: Partial<DebugInfo>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    setStatus("error")
    setMessage(description || error)
    setDebugInfo(prev => ({ ...prev, ...debug, error, errorDescription: description }))
  }, [])

  // Memoized success handler
  const handleSuccess = useCallback((user: User, redirectPath: string, debug?: Partial<DebugInfo>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setStatus("success")
    setMessage("Authentication successful! Redirecting...")
    setDebugInfo(prev => ({ 
      ...prev, 
      ...debug,
      userEmail: user.email,
      provider: user.app_metadata?.provider,
      hasAccess: hasVerifiedAccess(user)
    }))

    // Use requestAnimationFrame to ensure state update is processed
    requestAnimationFrame(() => {
      setTimeout(() => router.push(redirectPath), 1500)
    })
  }, [router])

  // Parse URL parameters with better error handling
  const parseUrlParameters = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      
      return {
        urlParams: Object.fromEntries(urlParams.entries()),
        hashParams: Object.fromEntries(hashParams.entries()),
        // Helper to get param from either location
        getParam: (key: string) => urlParams.get(key) || hashParams.get(key)
      }
    } catch (error) {
      console.error("Error parsing URL parameters:", error)
      return {
        urlParams: {},
        hashParams: {},
        getParam: () => null
      }
    }
  }, [])

  // Handle both PKCE and regular code exchange
  const exchangeCodeForSession = useCallback(async (code: string, isRecovery: boolean) => {
    try {
      // For recovery flows, check if this is a PKCE token (starts with 'pkce_')
      if (isRecovery && code.startsWith('pkce_')) {
        console.log("AuthCallback: Detected PKCE recovery token, using session check instead")
        
        // For PKCE recovery, the user should already be signed in
        // We just need to verify the session exists
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          throw new Error("Failed to retrieve recovery session. Please try again.")
        }
        
        if (!sessionData.session?.user) {
          throw new Error("Recovery session not found. Please request a new password reset.")
        }
        
        return { user: sessionData.session.user, session: sessionData.session }
      }
      
      // Regular code exchange for non-PKCE flows
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        // Handle specific Supabase error types
        switch (error.message) {
          case 'Invalid authorization code':
            throw new Error(isRecovery ? 
              "This recovery link has expired or is invalid. Please request a new password reset." :
              "This authentication link has expired. Please sign in again.")
          case 'Authorization code has already been used':
            throw new Error("This link has already been used. Please request a new one.")
          default:
            throw new Error(isRecovery ? 
              "Unable to process password recovery. Please try again." :
              "Authentication failed. Please try signing in again.")
        }
      }

      if (!data.session?.user) {
        throw new Error("Authentication incomplete. No user session created.")
      }

      return { user: data.user, session: data.session }
    } catch (error) {
      console.error("Code exchange error:", error)
      throw error
    }
  }, [])

  // Optimized access logging with error handling
  const logUserAccess = useCallback(async (userId: string, provider: string) => {
    try {
      await logAccess(userId, provider === "google" ? "google" : "email")
    } catch (error) {
      // Don't fail the auth flow for logging errors, just log them
      console.warn("Failed to log user access:", error)
    }
  }, [])

  useEffect(() => {
    // Prevent double processing and handle cleanup
    if (processedRef.current) return
    processedRef.current = true

    // Create abort controller for this effect
    abortControllerRef.current = new AbortController()

    const handleAuthCallback = async (): Promise<void> => {
      const debug: DebugInfo = {
        step: "starting",
        timestamp: new Date().toISOString(),
        fullUrl: window.location.href,
      }

      try {
        console.log("AuthCallback: Processing auth callback...")

        // Set timeout with cleanup
        timeoutRef.current = setTimeout(() => {
          if (!abortControllerRef.current?.signal.aborted) {
            console.log("AuthCallback: Timeout reached")
            handleError("Authentication timed out", "Please try again.", { ...debug, step: "timeout" })
            setTimeout(() => router.push("/login"), 3000)
          }
        }, 15000)

        // Parse URL parameters
        const { getParam } = parseUrlParameters()
        
        // Check for errors first
        const error = getParam("error")
        const errorDescription = getParam("error_description")
        
        if (error) {
          console.error("AuthCallback: URL contains error:", error)
          handleError(error, errorDescription, { ...debug, step: "url_error" })
          setTimeout(() => router.push("/login"), 3000)
          return
        }

        // Get auth parameters
        const code = getParam("code")
        const type = getParam("type")
        const isRecovery = type === "recovery"

        debug.type = type
        debug.isRecovery = isRecovery
        debug.step = "params_parsed"

        console.log("AuthCallback: Type:", type, "Has code:", !!code)

        // Handle missing code - for PKCE recovery, code might not be present
        if (!code) {
          console.log("AuthCallback: No code, checking existing session...")
          debug.step = "no_code_check_session"

          const { data: sessionData } = await supabase.auth.getSession()
          
          if (sessionData.session?.user) {
            console.log("AuthCallback: Found existing session")
            const user = sessionData.session.user
            
            // If this is a recovery type but no code, it might be PKCE recovery
            if (isRecovery) {
              console.log("AuthCallback: Recovery session without code - treating as PKCE recovery")
              debug.step = "pkce_recovery_session"
              
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
              }

              setStatus("recovery")
              setMessage("Recovery link verified! Redirecting to password reset...")
              setDebugInfo({ ...debug, userEmail: user.email })

              // IMMEDIATELY redirect to password reset
              setTimeout(() => router.push("/auth/reset-password?from=recovery"), 1000)
              return
            }
            
            // Regular session handling
            await logUserAccess(user.id, user.app_metadata?.provider || "email")
            handleSuccess(user, "/", { ...debug, step: "existing_session" })
            return
          }

          handleError("No authentication data found", "Please sign in again.", { ...debug, step: "no_session" })
          setTimeout(() => router.push("/login"), 3000)
          return
        }

        // Exchange code for session
        console.log("AuthCallback: Exchanging code...")
        debug.step = "code_exchange"

        const { user, session } = await exchangeCodeForSession(code, isRecovery)

        // Handle recovery flow - MUST redirect to password reset
        if (isRecovery) {
          console.log("AuthCallback: Processing recovery flow - redirecting to password reset")
          debug.step = "recovery_redirect_to_reset"
          
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          setStatus("recovery")
          setMessage("Recovery link verified! Redirecting to password reset...")
          setDebugInfo({ ...debug, userEmail: user.email })

          // IMMEDIATELY redirect to password reset - do not allow access to app
          setTimeout(() => router.push("/auth/reset-password?from=recovery"), 1000)
          return
        }

        // Handle regular authentication
        console.log("AuthCallback: Processing regular auth flow")
        debug.step = "regular_auth_success"

        // Log access asynchronously
        logUserAccess(user.id, user.app_metadata?.provider || "email")

        handleSuccess(user, "/", { ...debug, step: "auth_complete" })

      } catch (error) {
        console.error("AuthCallback: Error:", error)
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
        handleError(errorMessage, "Please try again.", { 
          ...debug, 
          step: "exception",
          exchangeError: error as AuthError
        })
        setTimeout(() => router.push("/login"), 3000)
      }
    }

    handleAuthCallback()

    // Cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [router, handleError, handleSuccess, parseUrlParameters, exchangeCodeForSession, logUserAccess])

  const handleReturnToLogin = (): void => {
    router.push("/login")
  }

  const renderStatusIcon = (): JSX.Element => {
    const iconProps = { className: "h-16 w-16" }
    
    switch (status) {
      case "loading":
        return <Loader2 {...iconProps} className="h-16 w-16 text-purple-600 animate-spin" />
      case "success":
      case "recovery":
        return <CheckCircle {...iconProps} className="h-16 w-16 text-green-600" />
      case "error":
        return <AlertCircle {...iconProps} className="h-16 w-16 text-red-600" />
      default:
        return <Loader2 {...iconProps} className="h-16 w-16 text-purple-600 animate-spin" />
    }
  }

  const getStatusContent = () => {
    const baseContent = {
      loading: {
        title: "Processing...",
        description: "Processing your authentication..."
      },
      success: {
        title: "Success!",
        description: "Authentication completed successfully"
      },
      recovery: {
        title: "Password Recovery Complete!",
        description: "Your recovery link is valid and you're now authenticated"
      },
      error: {
        title: "Authentication Failed",
        description: "There was an issue with authentication"
      }
    }

    return baseContent[status] || baseContent.loading
  }

  const { title, description } = getStatusContent()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
            alt="Carter Hales x BIGNERD"
            className="h-12 w-auto mx-auto mb-4"
            loading="eager"
          />
          <CardTitle className="text-2xl font-bold">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="flex flex-col items-center space-y-4">
            {renderStatusIcon()}
            <p className="text-slate-600">{message}</p>
            
            {(status === "success" || status === "recovery") && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: "100%" }}
                />
              </div>
            )}
            
            {status === "loading" && debugInfo?.step && process.env.NODE_ENV === "development" && (
              <p className="text-xs text-slate-500">Step: {debugInfo.step}</p>
            )}
            
            {status === "error" && (
              <Button onClick={handleReturnToLogin} className="w-full mt-4">
                Return to Login
              </Button>
            )}
            
            {(status === "success" || status === "recovery") && (
              <p className="text-sm text-slate-500">Redirecting automatically...</p>
            )}
          </div>

          {/* Debug information for development */}
          {debugInfo && process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-800">
                Debug Information
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
