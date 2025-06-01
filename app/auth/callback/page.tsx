"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { logAccess, getCurrentUser, hasVerifiedAccess } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type AuthStatus = "loading" | "success" | "error" | "recovery"

interface DebugInfo {
  error?: string
  errorDescription?: string
  exchangeError?: any
  data?: any
  urlParams?: Record<string, string>
  hashParams?: Record<string, string>
  hasCode?: boolean
  hasState?: boolean
  provider?: string | null
  type?: string | null
  isRecovery?: boolean
  userVerificationStatus?: {
    email?: string
    emailConfirmed?: string | null
    provider?: string
    hasAccess?: boolean
  }
  step?: string
  timestamp?: string
  [key: string]: any
}

export default function AuthCallback(): JSX.Element {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [message, setMessage] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const processedRef = useRef<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Prevent double processing
    if (processedRef.current) return
    processedRef.current = true

    const handleAuthCallback = async (): Promise<void> => {
      try {
        console.log("AuthCallback: Processing auth callback...")
        console.log("AuthCallback URL:", window.location.href)

        // Set a timeout to prevent infinite loading
        timeoutRef.current = setTimeout(() => {
          console.log("AuthCallback: Timeout reached, redirecting to login")
          setStatus("error")
          setMessage("Authentication timed out. Please try again.")
          setTimeout(() => router.push("/login"), 3000)
        }, 10000) // 10 second timeout

        // Initialize debug info
        const debug: DebugInfo = {
          step: "starting",
          timestamp: new Date().toISOString(),
        }

        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))

        // Store params for debugging
        debug.urlParams = Object.fromEntries(urlParams.entries())
        debug.hashParams = Object.fromEntries(hashParams.entries())

        console.log("AuthCallback: URL params:", debug.urlParams)
        console.log("AuthCallback: Hash params:", debug.hashParams)

        // Check for recovery type parameter
        const type = urlParams.get("type") || hashParams.get("type")
        const isRecovery = type === "recovery"

        debug.type = type
        debug.isRecovery = isRecovery

        console.log("AuthCallback: Auth type:", type, "Is recovery:", isRecovery)

        // Check for error parameters first
        const error = urlParams.get("error") || hashParams.get("error")
        const errorDescription = urlParams.get("error_description") || hashParams.get("error_description")

        if (error) {
          console.error("AuthCallback: URL contains error:", error, errorDescription)
          debug.error = error
          debug.errorDescription = errorDescription
          debug.step = "url_error"

          clearTimeout(timeoutRef.current!)
          setStatus("error")
          setMessage(errorDescription || error)
          setDebugInfo(debug)
          return
        }

        // Handle password recovery flow
        if (isRecovery) {
          console.log("AuthCallback: Processing password recovery flow...")
          debug.step = "recovery_flow"

          const code = urlParams.get("code")

          if (!code) {
            console.error("AuthCallback: Recovery flow but no code provided")
            debug.step = "recovery_no_code"

            clearTimeout(timeoutRef.current!)
            setStatus("error")
            setMessage("Invalid recovery link. Please request a new password reset.")
            setDebugInfo(debug)
            return
          }

          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error("AuthCallback: Recovery code exchange error:", exchangeError)
              debug.exchangeError = exchangeError
              debug.step = "recovery_exchange_error"

              clearTimeout(timeoutRef.current!)
              setStatus("error")
              setMessage("Invalid or expired recovery link. Please request a new password reset.")
              setDebugInfo(debug)
              return
            }

            if (data.session && data.user) {
              console.log("AuthCallback: Recovery successful for user:", data.user.email)
              debug.step = "recovery_success"

              clearTimeout(timeoutRef.current!)
              setStatus("recovery")
              setMessage("Password recovery successful! Please set your new password.")
              setDebugInfo(debug)

              // Redirect to a password reset form or show success message
              setTimeout(() => {
                // You might want to redirect to a dedicated password reset page
                // For now, we'll redirect to the main app since the user is authenticated
                router.push("/auth/reset-password")
              }, 3000)
              return
            } else {
              console.error("AuthCallback: Recovery exchange succeeded but no session/user returned")
              debug.step = "recovery_no_session"

              clearTimeout(timeoutRef.current!)
              setStatus("error")
              setMessage("Recovery process incomplete. Please try requesting a new password reset.")
              setDebugInfo(debug)
              return
            }
          } catch (recoveryError) {
            console.error("AuthCallback: Error in recovery flow:", recoveryError)
            debug.exchangeError = recoveryError
            debug.step = "recovery_exception"

            clearTimeout(timeoutRef.current!)
            setStatus("error")
            setMessage("Error processing password recovery. Please try again.")
            setDebugInfo(debug)
            return
          }
        }

        // Check for code parameter (PKCE flow - both OAuth and email verification)
        const code = urlParams.get("code")

        if (!code) {
          console.log("AuthCallback: No code parameter found, checking for existing session...")
          debug.step = "no_code_check_session"

          // Check if we already have a session
          const { data: sessionData } = await supabase.auth.getSession()

          if (sessionData.session?.user) {
            console.log("AuthCallback: Existing session found for:", sessionData.session.user.email)

            const user = sessionData.session.user
            const hasAccess = hasVerifiedAccess(user)

            debug.userVerificationStatus = {
              email: user.email,
              emailConfirmed: user.email_confirmed_at,
              provider: user.app_metadata?.provider,
              hasAccess,
            }
            debug.step = "existing_session_found"

            const isGoogleUser = user.app_metadata?.provider === "google"
            await logAccess(user.id, isGoogleUser ? "google" : "email")

            clearTimeout(timeoutRef.current!)
            setStatus("success")
            setMessage("Successfully signed in! Redirecting...")
            setDebugInfo(debug)

            setTimeout(() => router.push("/"), 2000)
            return
          } else {
            console.log("AuthCallback: No code and no session, redirecting to login")
            debug.step = "no_code_no_session"

            clearTimeout(timeoutRef.current!)
            setStatus("error")
            setMessage("No authentication data found. Please try signing in again.")
            setDebugInfo(debug)
            setTimeout(() => router.push("/login"), 3000)
            return
          }
        }

        console.log("AuthCallback: Processing code exchange...")
        debug.step = "code_exchange"
        debug.hasCode = true

        try {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error("AuthCallback: Code exchange error:", exchangeError)
            debug.exchangeError = exchangeError
            debug.step = "code_exchange_error"

            clearTimeout(timeoutRef.current!)
            setStatus("error")
            setMessage("Authentication failed. Please try signing in again.")
            setDebugInfo(debug)
            return
          }

          if (data.session && data.user) {
            console.log("AuthCallback: Code exchange successful for user:", data.user.email)
            debug.step = "code_exchange_success"

            // Get fresh user data to ensure we have the latest verification status
            const freshUser = await getCurrentUser()

            if (!freshUser) {
              console.error("AuthCallback: Could not retrieve fresh user data")
              debug.step = "fresh_user_error"

              clearTimeout(timeoutRef.current!)
              setStatus("error")
              setMessage("Authentication incomplete. Please try signing in again.")
              setDebugInfo(debug)
              return
            }

            // Check verification status
            const hasAccess = hasVerifiedAccess(freshUser)

            debug.userVerificationStatus = {
              email: freshUser.email,
              emailConfirmed: freshUser.email_confirmed_at,
              provider: freshUser.app_metadata?.provider,
              hasAccess,
            }
            debug.step = "verification_check_complete"

            console.log("AuthCallback: User verification status:", debug.userVerificationStatus)

            // Determine login method and log access
            const loginMethod = freshUser.app_metadata?.provider === "google" ? "google" : "email"
            await logAccess(freshUser.id, loginMethod)

            debug.step = "access_logged"

            clearTimeout(timeoutRef.current!)
            setStatus("success")
            setMessage("Authentication successful! Redirecting...")
            setDebugInfo(debug)

            setTimeout(() => router.push("/"), 2000)
            return
          } else {
            console.error("AuthCallback: Code exchange succeeded but no session/user returned")
            debug.data = data
            debug.step = "code_exchange_no_user"

            clearTimeout(timeoutRef.current!)
            setStatus("error")
            setMessage("Authentication process incomplete. Please try signing in again.")
            setDebugInfo(debug)
            return
          }
        } catch (exchangeError) {
          console.error("AuthCallback: Error exchanging code:", exchangeError)
          debug.exchangeError = exchangeError
          debug.step = "code_exchange_exception"

          clearTimeout(timeoutRef.current!)
          setStatus("error")
          setMessage("Error processing authentication. Please try again.")
          setDebugInfo(debug)
          return
        }
      } catch (err) {
        console.error("AuthCallback: Unexpected error:", err)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        setStatus("error")
        setMessage("An unexpected error occurred. Please try signing in again.")
        setDebugInfo({ err: String(err), step: "unexpected_error" })
      }
    }

    handleAuthCallback()

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [router])

  const handleReturnToLogin = (): void => {
    router.push("/login")
  }

  const renderStatusIcon = (): JSX.Element => {
    switch (status) {
      case "loading":
        return <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
      case "success":
        return <CheckCircle className="h-16 w-16 text-green-600" />
      case "error":
        return <AlertCircle className="h-16 w-16 text-red-600" />
      default:
        return <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
    }
  }

  const getStatusTitle = (): string => {
    switch (status) {
      case "loading":
        return "Processing..."
      case "success":
        return "Success!"
      case "recovery":
        return "Password Recovery Complete!"
      case "error":
        return "Authentication Failed"
      default:
        return "Processing..."
    }
  }

  const getStatusDescription = (): string => {
    switch (status) {
      case "loading":
        return "Processing your authentication..."
      case "success":
        return "Authentication completed successfully"
      case "recovery":
        return "Your password has been reset successfully"
      case "error":
        return "There was an issue with authentication"
      default:
        return "Processing your authentication..."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <img
            src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
            alt="Carter Hales x BIGNERD"
            className="h-12 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-2xl font-bold">{getStatusTitle()}</CardTitle>
          <CardDescription>{getStatusDescription()}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              {renderStatusIcon()}
              <p className="text-slate-600">Please wait while we process your authentication...</p>
              {debugInfo?.step && process.env.NODE_ENV === "development" && (
                <p className="text-xs text-slate-500">Step: {debugInfo.step}</p>
              )}
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              {renderStatusIcon()}
              <p className="text-slate-600">{message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-slate-500">Redirecting automatically...</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              {renderStatusIcon()}
              <p className="text-slate-600">{message}</p>
              <Button onClick={handleReturnToLogin} className="w-full">
                Return to Login
              </Button>
            </div>
          )}

          {status === "recovery" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <p className="text-slate-600">{message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-slate-500">You are now logged in. Redirecting...</p>
            </div>
          )}

          {/* Debug information - only show in development */}
          {debugInfo && process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-left w-full overflow-auto max-h-60">
              <p className="font-bold mb-2">Debug Info:</p>
              <div className="space-y-2">
                <div>
                  <p className="font-semibold">Current Step: {debugInfo.step}</p>
                  <p className="text-xs">Timestamp: {debugInfo.timestamp}</p>
                </div>
                {debugInfo.userVerificationStatus && (
                  <div>
                    <p className="font-semibold">User Status:</p>
                    <pre className="text-xs">{JSON.stringify(debugInfo.userVerificationStatus, null, 2)}</pre>
                  </div>
                )}
                {debugInfo.urlParams && Object.keys(debugInfo.urlParams).length > 0 && (
                  <div>
                    <p className="font-semibold">URL Params:</p>
                    <pre className="text-xs">{JSON.stringify(debugInfo.urlParams, null, 2)}</pre>
                  </div>
                )}
                {debugInfo.error && (
                  <div>
                    <p className="font-semibold">Error:</p>
                    <p className="text-xs text-red-600">{debugInfo.error}</p>
                    {debugInfo.errorDescription && <p className="text-xs text-red-600">{debugInfo.errorDescription}</p>}
                  </div>
                )}
                {debugInfo.exchangeError && (
                  <div>
                    <p className="font-semibold">Exchange Error:</p>
                    <pre className="text-xs text-red-600">{JSON.stringify(debugInfo.exchangeError, null, 2)}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
