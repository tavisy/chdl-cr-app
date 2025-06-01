"use client"
import { useEffect, useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { logAccess } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2, Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

type VerificationStatus = "loading" | "success" | "error" | "expired" | "already_verified"

interface DebugInfo {
  token?: string | null
  type?: string | null
  error?: string
  step?: string
  timestamp?: string
  fullUrl?: string
  userEmail?: string
}

export default function VerifyPage(): JSX.Element {
  const router = useRouter()
  const [status, setStatus] = useState<VerificationStatus>("loading")
  const [message, setMessage] = useState<string>("")
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null)
  const [isResending, setIsResending] = useState<boolean>(false)
  const processedRef = useRef<boolean>(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Parse URL parameters
  const parseUrlParameters = useCallback(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const hashParams = new URLSearchParams(window.location.hash.substring(1))
      
      return {
        getParam: (key: string) => urlParams.get(key) || hashParams.get(key)
      }
    } catch (error) {
      console.error("Error parsing URL parameters:", error)
      return {
        getParam: () => null
      }
    }
  }, [])

  // Handle verification process
  const verifyUser = useCallback(async (): Promise<void> => {
    if (processedRef.current) return
    processedRef.current = true

    const debug: DebugInfo = {
      step: "starting",
      timestamp: new Date().toISOString(),
      fullUrl: window.location.href,
    }

    try {
      console.log("Verify: Starting email verification process...")

      // Set timeout for verification process
      timeoutRef.current = setTimeout(() => {
        console.log("Verify: Verification timeout reached")
        setStatus("error")
        setMessage("Verification timed out. Please try again or request a new verification email.")
        setDebugInfo({ ...debug, step: "timeout" })
      }, 15000)

      // Parse URL parameters
      const { getParam } = parseUrlParameters()
      const token = getParam("token")
      const type = getParam("type")

      debug.token = token
      debug.type = type
      debug.step = "params_parsed"

      console.log("Verify: Token present:", !!token, "Type:", type)

      // Validate required parameters
      if (!token) {
        console.error("Verify: No token found in URL")
        setStatus("error")
        setMessage("Invalid verification link. Missing verification token.")
        setDebugInfo({ ...debug, step: "no_token" })
        return
      }

      if (type !== "signup") {
        console.error("Verify: Invalid verification type:", type)
        setStatus("error")
        setMessage("Invalid verification link. Please request a new confirmation email.")
        setDebugInfo({ ...debug, step: "invalid_type" })
        return
      }

      debug.step = "attempting_verification"
      console.log("Verify: Attempting to verify OTP token...")

      // Verify the token using Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "signup",
      })

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (error) {
        console.error("Verify: Verification error:", error)
        debug.step = "verification_error"
        debug.error = error.message

        // Handle specific error types
        switch (error.message) {
          case 'Token has expired':
          case 'Signup confirmation token expired':
            setStatus("expired")
            setMessage("This verification link has expired. Please request a new confirmation email.")
            break
          case 'Email link is invalid or has expired':
            setStatus("expired")
            setMessage("This verification link is no longer valid. Please request a new one.")
            break
          case 'User already registered':
          case 'Email address already confirmed':
            setStatus("already_verified")
            setMessage("Your email has already been verified. You can sign in to your account.")
            break
          default:
            setStatus("error")
            setMessage("Verification failed. The link may have expired or is invalid.")
        }

        setDebugInfo(debug)
        return
      }

      // Check if user data is present
      if (!data.user) {
        console.error("Verify: Verification succeeded but no user data returned")
        debug.step = "no_user_data"
        setStatus("error")
        setMessage("Verification process incomplete. Please try again or contact support.")
        setDebugInfo(debug)
        return
      }

      console.log("Verify: Email verification successful for:", data.user.email)
      debug.step = "verification_success"
      debug.userEmail = data.user.email

      // Log the successful email verification
      try {
        await logAccess(data.user.id, "email")
        debug.step = "access_logged"
      } catch (logError) {
        console.warn("Verify: Failed to log access, but continuing:", logError)
        // Don't fail the verification flow for logging errors
      }

      setStatus("success")
      setMessage("Email verified successfully! You can now access the Crown Royal Strategic Report.")
      setDebugInfo(debug)

      // Redirect to the main app after showing success message
      setTimeout(() => {
        router.push("/?verified=true")
      }, 3000)

    } catch (err) {
      console.error("Verify: Unexpected verification error:", err)
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      setStatus("error")
      setMessage("An unexpected error occurred during verification. Please try again.")
      setDebugInfo({ 
        ...debug, 
        step: "unexpected_error",
        error: err instanceof Error ? err.message : String(err)
      })
    }
  }, [router, parseUrlParameters])

  // Resend verification email
  const handleResendVerification = useCallback(async (): Promise<void> => {
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
        type: 'signup',
        email: sessionData.session.user.email
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
  }, [router])

  const handleReturnToLogin = (): void => {
    router.push("/login")
  }

  const handleGoToLogin = (): void => {
    router.push("/login?message=Please sign in with your verified account")
  }

  // Start verification process on component mount
  useEffect(() => {
    verifyUser()

    // Cleanup timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [verifyUser])

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
        title: "Verifying Email...",
        description: "Please wait while we verify your email address"
      },
      success: {
        title: "Email Verified!",
        description: "Your account has been successfully verified"
      },
      already_verified: {
        title: "Already Verified",
        description: "Your email address has already been confirmed"
      },
      expired: {
        title: "Link Expired",
        description: "This verification link has expired"
      },
      error: {
        title: "Verification Failed",
        description: "There was an issue verifying your email"
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
                <p className="text-sm text-slate-500">Redirecting to the report...</p>
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
                    Verification links expire for security. Request a new one below.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleResendVerification} 
                    disabled={isResending}
                    className="flex-1"
                  >
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
