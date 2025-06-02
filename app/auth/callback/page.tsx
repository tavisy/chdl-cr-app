"use client"
import { useEffect, useState, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2, Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

type CallbackStatus = "loading" | "success" | "error" | "expired" | "already_verified"

interface DebugInfo {
  token?: string | null
  type?: string | null
  error?: string
  step?: string
  timestamp?: string
  fullUrl?: string
  userEmail?: string
  searchParams?: Record<string, string>
  hashParams?: Record<string, string>
}

export default function AuthCallbackPage(): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<CallbackStatus>("loading")
  const [message, setMessage] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isResending, setIsResending] = useState<boolean>(false)
  const processedRef = useRef<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (processedRef.current) return
      processedRef.current = true

      const debug: DebugInfo = {
        step: "starting_callback",
        timestamp: new Date().toISOString(),
        fullUrl: window.location.href,
      }

      try {
        console.log("AuthCallback: Starting auth callback process...")
        console.log("AuthCallback: Full URL:", window.location.href)

        // Set timeout for callback process
        timeoutRef.current = setTimeout(() => {
          console.log("AuthCallback: Callback timeout reached")
          setStatus("error")
          setMessage("Authentication timed out. Please try again.")
          setDebugInfo({ ...debug, step: "timeout" })
        }, 15000)

        // Parse all possible parameters
        const urlSearchParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))

        // Collect all parameters for debugging
        const searchParamsObj: Record<string, string> = {}
        const hashParamsObj: Record<string, string> = {}

        urlSearchParams.forEach((value, key) => {
          searchParamsObj[key] = value
        })

        hashParams.forEach((value, key) => {
          hashParamsObj[key] = value
        })

        debug.searchParams = searchParamsObj
        debug.hashParams = hashParamsObj

        // Get callback type and other parameters
        const type = urlSearchParams.get("type") || hashParams.get("type")
        const error = urlSearchParams.get("error") || hashParams.get("error")
        const errorDescription = urlSearchParams.get("error_description") || hashParams.get("error_description")
        const code = urlSearchParams.get("code") || hashParams.get("code")
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")

        debug.type = type
        debug.step = "params_parsed"

        console.log("AuthCallback: Parsed parameters:", {
          type,
          hasError: !!error,
          hasCode: !!code,
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
        })

        // Handle errors first
        if (error) {
          console.error("AuthCallback: Error in callback:", error, errorDescription)
          debug.step = "callback_error"
          debug.error = `${error}: ${errorDescription}`

          if (error === "access_denied") {
            setStatus("error")
            setMessage("Authentication was cancelled. Please try again.")
          } else {
            setStatus("error")
            setMessage(`Authentication failed: ${errorDescription || error}`)
          }
          setDebugInfo(debug)
          return
        }

        debug.step = "exchanging_code"
        console.log("AuthCallback: Exchanging code for session...")

        // Exchange the code for a session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(window.location.href)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        if (sessionError) {
          console.error("AuthCallback: Session exchange error:", sessionError)
          debug.step = "session_exchange_error"
          debug.error = sessionError.message

          // Handle specific session errors
          switch (sessionError.message) {
            case "Token has expired":
            case "Signup confirmation token expired":
              setStatus("expired")
              setMessage("This verification link has expired. Please request a new confirmation email.")
              break
            case "Email link is invalid or has expired":
              setStatus("expired")
              setMessage("This verification link is no longer valid. Please request a new one.")
              break
            case "User already registered":
            case "Email address already confirmed":
              setStatus("already_verified")
              setMessage("Your email has already been verified. You can sign in to your account.")
              break
            default:
              setStatus("error")
              setMessage(`Authentication failed: ${sessionError.message}`)
          }

          setDebugInfo(debug)
          return
        }

        // Check if we have a valid session and user
        if (!data.session || !data.user) {
          console.error("AuthCallback: No session or user data returned")
          debug.step = "no_session_data"
          setStatus("error")
          setMessage("Authentication process incomplete. Please try again or contact support.")
          setDebugInfo(debug)
          return
        }

        console.log("AuthCallback: Authentication successful for:", data.user.email)
        debug.step = "auth_success"
        debug.userEmail = data.user.email

        // Determine the login method
        const loginMethod = data.user.app_metadata?.provider === "google" ? "google" : "email"

        // Log the successful authentication with profile update
        try {
          const { logAccessWithProfile } = await import("@/lib/auth")
          await logAccessWithProfile(data.user, loginMethod, {
            sessionType: type === "recovery" ? "password_recovery" : "verification",
          })
          debug.step = "access_logged"
        } catch (logError) {
          console.warn("AuthCallback: Failed to log access, but continuing:", logError)
          // Don't fail the auth flow for logging errors
        }

        setStatus("success")

        // Set appropriate success message based on type
        if (type === "recovery") {
          setMessage("Password reset successful! You can now access your account.")
        } else if (loginMethod === "google") {
          setMessage("Google sign-in successful! Welcome to the Crown Royal Strategic Report.")
        } else {
          setMessage("Email verified successfully! You can now access the Crown Royal Strategic Report.")
        }

        setDebugInfo(debug)

        // Redirect to the main app after showing success message
        setTimeout(() => {
          if (type === "recovery") {
            router.push("/auth/reset-password?verified=true")
          } else {
            router.push("/?verified=true")
          }
        }, 2000)
      } catch (err) {
        console.error("AuthCallback: Unexpected callback error:", err)

        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }

        setStatus("error")
        setMessage("An unexpected error occurred during authentication. Please try again.")
        setDebugInfo({
          ...debug,
          step: "unexpected_error",
          error: err instanceof Error ? err.message : String(err),
        })
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

  // Resend verification email
  const handleResendVerification = async (): Promise<void> => {
    setIsResending(true)

    try {
      // Get current session to resend for current user
      const { data: sessionData } = await supabase.auth.getSession()

      if (!sessionData.session?.user?.email) {
        // If no session, redirect to login/signup
        router.push("/login?message=Please sign up again to receive a new verification email")
        return
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: sessionData.session.user.email,
      })

      if (error) {
        console.error("Resend error:", error)
        setMessage("Failed to resend verification email. Please try again or contact support.")
      } else {
        setMessage("A new verification email has been sent. Please check your inbox.")
      }
    } catch (err) {
      console.error("Resend unexpected error:", err)
      setMessage("An error occurred while resending the email. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  const handleReturnToLogin = (): void => {
    router.push("/login")
  }

  const handleGoToLogin = (): void => {
    router.push("/login?message=Please sign in with your verified account")
  }

  const renderStatusIcon = (): JSX.Element => {
    const iconProps = { className: "h-16 w-16" }

    switch (status) {
      case "loading":
        return <Loader2 {...iconProps} className="h-16 w-16 text-purple-600 animate-spin" />
      case "success":
        return <CheckCircle {...iconProps} className="h-16 w-16 text-green-600" />
      case "already_verified":
        return <CheckCircle {...iconProps} className="h-16 w-16 text-blue-600" />
      case "expired":
        return <Mail {...iconProps} className="h-16 w-16 text-orange-600" />
      case "error":
        return <AlertCircle {...iconProps} className="h-16 w-16 text-red-600" />
      default:
        return <Loader2 {...iconProps} className="h-16 w-16 text-purple-600 animate-spin" />
    }
  }

  const getStatusContent = () => {
    const baseContent = {
      loading: {
        title: "Processing Authentication...",
        description: "Please wait while we complete your authentication",
      },
      success: {
        title: "Authentication Successful!",
        description: "You have been successfully authenticated",
      },
      already_verified: {
        title: "Already Verified",
        description: "Your account has already been verified",
      },
      expired: {
        title: "Link Expired",
        description: "This authentication link has expired",
      },
      error: {
        title: "Authentication Failed",
        description: "There was an issue with your authentication",
      },
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

            {/* Loading state */}
            {status === "loading" && debugInfo?.step && process.env.NODE_ENV === "development" && (
              <p className="text-xs text-slate-500">Step: {debugInfo.step}</p>
            )}

            {/* Success state with redirect indicator */}
            {status === "success" && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: "100%" }}
                  />
                </div>
                <p className="text-sm text-slate-500">Redirecting...</p>
              </>
            )}

            {/* Already verified state */}
            {status === "already_verified" && (
              <Button onClick={handleGoToLogin} className="w-full">
                Go to Login
              </Button>
            )}

            {/* Expired state with resend option */}
            {status === "expired" && (
              <div className="w-full space-y-3">
                <Alert>
                  <Mail className="h-4 w-4" />
                  <AlertDescription>
                    Authentication links expire for security. Request a new one below.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button onClick={handleResendVerification} disabled={isResending} className="flex-1">
                    {isResending ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Resend Email
                      </>
                    )}
                  </Button>
                  <Button onClick={handleReturnToLogin} variant="outline" className="flex-1">
                    Back to Login
                  </Button>
                </div>
              </div>
            )}

            {/* Error state */}
            {status === "error" && (
              <div className="w-full space-y-3">
                <Button onClick={handleResendVerification} disabled={isResending} className="w-full">
                  {isResending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Sending New Link...
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4 mr-2" />
                      Request New Verification Email
                    </>
                  )}
                </Button>
                <Button onClick={handleReturnToLogin} variant="outline" className="w-full">
                  Return to Login
                </Button>
              </div>
            )}
          </div>

          {/* Debug information for development */}
          {debugInfo && process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left">
              <summary className="cursor-pointer text-sm font-medium text-slate-600 hover:text-slate-800">
                Debug Information
              </summary>
              <div className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-60">
                <pre className="whitespace-pre-wrap">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            </details>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
