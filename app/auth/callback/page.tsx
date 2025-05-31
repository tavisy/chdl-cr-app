"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { logAccess, getCurrentUser, hasVerifiedAccess } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User } from "@supabase/supabase-js"

type AuthStatus = "loading" | "success" | "error"

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
  userVerificationStatus?: {
    email?: string
    emailConfirmed?: string | null
    provider?: string
    hasAccess?: boolean
  }
  [key: string]: any
}

export default function AuthCallback(): JSX.Element {
  const router = useRouter()
  const [status, setStatus] = useState<AuthStatus>("loading")
  const [message, setMessage] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)

  useEffect(() => {
    const handleAuthCallback = async (): Promise<void> => {
      try {
        console.log("AuthCallback: Processing auth callback...")
        console.log("AuthCallback URL:", window.location.href)

        // Initialize debug info
        const debug: DebugInfo = {}

        // Check if we already have a session first
        try {
          const { data: sessionData } = await supabase.auth.getSession()

          if (sessionData.session?.user) {
            console.log("AuthCallback: Existing session found for:", sessionData.session.user.email)

            const user = sessionData.session.user
            const hasAccess = hasVerifiedAccess(user)

            debug.userVerificationStatus = {
              email: user.email,
              emailConfirmed: user.email_confirmed_at,
              provider: user.app_metadata?.provider,
              hasAccess
            }

            // Check if this is a Google user or verified email user
            const isGoogleUser = user.app_metadata?.provider === "google"

            // Log access
            await logAccess(user.id, isGoogleUser ? "google" : "email")

            setStatus("success")
            setMessage("Successfully signed in! Redirecting...")
            setDebugInfo(debug)
            
            setTimeout(() => router.push("/"), 2000)
            return
          }
        } catch (sessionError) {
          console.error("AuthCallback: Error checking existing session:", sessionError)
          debug.sessionError = sessionError
          // Continue with other auth methods
        }

        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))

        // Store params for debugging
        debug.urlParams = Object.fromEntries(urlParams.entries())
        debug.hashParams = Object.fromEntries(hashParams.entries())

        // Log all parameters for debugging
        console.log("AuthCallback: URL params:", debug.urlParams)
        console.log("AuthCallback: Hash params:", debug.hashParams)

        // Check for error parameters first
        const error = urlParams.get("error") || hashParams.get("error")
        const errorDescription = urlParams.get("error_description") || hashParams.get("error_description")

        if (error) {
          console.error("AuthCallback: URL contains error:", error, errorDescription)
          debug.error = error
          debug.errorDescription = errorDescription
          
          setStatus("error")
          setMessage(errorDescription || error)
          setDebugInfo(debug)
          return
        }

        // Check for code parameter (PKCE flow - email verification)
        const code = urlParams.get("code")

        // Check for state parameter (OAuth flow)
        const state = urlParams.get("state")

        // Check for provider parameter (OAuth flow)
        const provider = urlParams.get("provider") || hashParams.get("provider")

        debug.hasCode = !!code
        debug.hasState = !!state
        debug.provider = provider

        console.log("AuthCallback: Auth parameters:", {
          hasCode: !!code,
          hasState: !!state,
          provider,
        })

        // If we have a code, try to exchange it
        if (code) {
          console.log("AuthCallback: Processing code exchange...")

          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error("AuthCallback: Code exchange error:", exchangeError)
              debug.exchangeError = exchangeError
              
              setStatus("error")
              setMessage("Authentication failed. Please try signing in again.")
              setDebugInfo(debug)
              return
            }

            if (data.session && data.user) {
              console.log("AuthCallback: Code exchange successful for user:", data.user.email)
              
              // Get fresh user data to ensure we have the latest verification status
              const freshUser = await getCurrentUser()
              
              if (!freshUser) {
                console.error("AuthCallback: Could not retrieve fresh user data")
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
                hasAccess
              }

              console.log("AuthCallback: User verification status:", debug.userVerificationStatus)

              // Determine login method and log access
              const loginMethod = freshUser.app_metadata?.provider === "google" ? "google" : "email"
              await logAccess(freshUser.id, loginMethod)

              setStatus("success")
              setMessage("Authentication successful! Redirecting...")
              setDebugInfo(debug)
              
              setTimeout(() => router.push("/"), 2000)
              return
            } else {
              console.error("AuthCallback: Code exchange succeeded but no session/user returned")
              debug.data = data
              
              setStatus("error")
              setMessage("Authentication process incomplete. Please try signing in again.")
              setDebugInfo(debug)
              return
            }
          } catch (exchangeError) {
            console.error("AuthCallback: Error exchanging code:", exchangeError)
            debug.exchangeError = exchangeError
            
            setStatus("error")
            setMessage("Error processing authentication. Please try again.")
            setDebugInfo(debug)
            return
          }
        }

        // If we get here, we don't have any authentication data
        console.log("AuthCallback: No authentication data found")
        setStatus("error")
        setMessage("No authentication data found. Please try signing in again.")
        setDebugInfo(debug)
        
      } catch (err) {
        console.error("AuthCallback: Unexpected error:", err)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try signing in again.")
        setDebugInfo({ err: String(err) })
      }
    }

    handleAuthCallback()
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
          <CardTitle className="text-2xl font-bold">
            {getStatusTitle()}
          </CardTitle>
          <CardDescription>
            {getStatusDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              {renderStatusIcon()}
              <p className="text-slate-600">Please wait while we process your authentication...</p>
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

          {/* Debug information - only show in development */}
          {debugInfo && process.env.NODE_ENV === "development" && (
            <div className="mt-6 p-3 bg-gray-100 rounded text-xs text-left w-full overflow-auto max-h-60">
              <p className="font-bold mb-2">Debug Info:</p>
              <div className="space-y-2">
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
                    {debugInfo.errorDescription && (
                      <p className="text-xs text-red-600">{debugInfo.errorDescription}</p>
                    )}
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
