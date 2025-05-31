"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { logAccess } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback: Processing auth callback...")
        console.log("AuthCallback URL:", window.location.href)

        // Parse URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))

        // Log all parameters for debugging
        console.log("AuthCallback: URL params:", Object.fromEntries(urlParams.entries()))
        console.log("AuthCallback: Hash params:", Object.fromEntries(hashParams.entries()))

        // Check for error parameters first
        const error = urlParams.get("error") || hashParams.get("error")
        const errorDescription = urlParams.get("error_description") || hashParams.get("error_description")

        if (error) {
          console.error("AuthCallback: URL contains error:", error, errorDescription)
          setStatus("error")
          setMessage(errorDescription || error)
          setDebugInfo({ error, errorDescription })
          return
        }

        // Check for OAuth tokens in hash (Google OAuth)
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const tokenType = hashParams.get("token_type")

        // Check for OAuth code in URL params (some OAuth flows)
        const oauthCode = urlParams.get("code")
        const state = urlParams.get("state")

        console.log("AuthCallback: Token detection:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          hasOauthCode: !!oauthCode,
          tokenType,
          state,
        })

        // Handle OAuth tokens (Google sign-in with tokens)
        if (accessToken && refreshToken) {
          console.log("AuthCallback: Processing OAuth tokens from hash...")

          try {
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            })

            if (sessionError) {
              console.error("AuthCallback: OAuth session error:", sessionError)
              setStatus("error")
              setMessage("Failed to establish session from Google. Please try signing in again.")
              setDebugInfo({ sessionError, accessToken: !!accessToken, refreshToken: !!refreshToken })
              return
            }

            if (data.user && data.session) {
              console.log("AuthCallback: OAuth session established for user:", data.user.email)
              await logAccess(data.user.id, "google")
              localStorage.setItem("bypassVerification", "true")

              setStatus("success")
              setMessage("Successfully signed in with Google! Redirecting...")
              setTimeout(() => router.push("/"), 2000)
              return
            }
          } catch (setSessionError) {
            console.error("AuthCallback: Error setting OAuth session:", setSessionError)
            setStatus("error")
            setMessage("Error processing Google authentication. Please try again.")
            setDebugInfo({ setSessionError })
            return
          }
        }

        // Handle OAuth code (Google sign-in with code - newer flow)
        if (oauthCode && !accessToken) {
          console.log("AuthCallback: Processing OAuth code...")

          try {
            // For OAuth code, we need to exchange it for a session
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(oauthCode)

            if (exchangeError) {
              console.error("AuthCallback: OAuth code exchange error:", exchangeError)

              // If this is clearly an OAuth flow but failing, provide better error message
              if (state || urlParams.get("provider")) {
                setStatus("error")
                setMessage("Google sign-in failed. Please try again or use email sign-in.")
                setDebugInfo({ exchangeError, isOAuthFlow: true, state, provider: urlParams.get("provider") })
              } else {
                setStatus("error")
                setMessage("Failed to verify email. Please try again.")
                setDebugInfo({ exchangeError, isEmailFlow: true })
              }
              return
            }

            if (data.session && data.user) {
              console.log("AuthCallback: OAuth code exchange successful for user:", data.user.email)

              // Determine if this was OAuth or email verification based on user metadata
              const loginMethod = data.user.app_metadata?.provider === "google" ? "google" : "email"
              await logAccess(data.user.id, loginMethod)
              localStorage.setItem("bypassVerification", "true")

              setStatus("success")
              setMessage(
                loginMethod === "google"
                  ? "Successfully signed in with Google! Redirecting..."
                  : "Email verified successfully! Redirecting...",
              )
              setTimeout(() => router.push("/"), 2000)
              return
            }
          } catch (exchangeError) {
            console.error("AuthCallback: Error exchanging code:", exchangeError)
            setStatus("error")
            setMessage("Error processing authentication. Please try again.")
            setDebugInfo({ exchangeError })
            return
          }
        }

        // Check if we already have a session
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

          if (sessionError) {
            console.error("AuthCallback: Error getting existing session:", sessionError)
            setStatus("error")
            setMessage("Error checking authentication status. Please try signing in again.")
            setDebugInfo({ sessionError })
            return
          }

          if (sessionData.session?.user) {
            console.log("AuthCallback: Existing session found for:", sessionData.session.user.email)
            localStorage.setItem("bypassVerification", "true")

            setStatus("success")
            setMessage("Already authenticated! Redirecting...")
            setTimeout(() => router.push("/"), 1000)
            return
          } else {
            console.log("AuthCallback: No authentication data found")
            setStatus("error")
            setMessage("No authentication data found. Please try signing in again.")
            setDebugInfo({
              urlParams: Object.fromEntries(urlParams.entries()),
              hashParams: Object.fromEntries(hashParams.entries()),
              hasSession: false,
            })
            return
          }
        } catch (sessionError) {
          console.error("AuthCallback: Error checking existing session:", sessionError)
          setStatus("error")
          setMessage("Error checking authentication status. Please try signing in again.")
          setDebugInfo({ sessionError })
          return
        }
      } catch (err) {
        console.error("AuthCallback: Unexpected error:", err)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try signing in again.")
        setDebugInfo({ err })
      }
    }

    handleAuthCallback()
  }, [router])

  const handleReturnToLogin = () => {
    router.push("/login")
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
            {status === "loading" && "Processing..."}
            {status === "success" && "Success!"}
            {status === "error" && "Authentication Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Processing your authentication..."}
            {status === "success" && "Authentication completed successfully"}
            {status === "error" && "There was an issue with authentication"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
              <p className="text-slate-600">Please wait...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <p className="text-slate-600">{message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-slate-500">Redirecting automatically...</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <AlertCircle className="h-16 w-16 text-red-600" />
              <p className="text-slate-600">{message}</p>
              <Button onClick={handleReturnToLogin} className="w-full">
                Return to Login
              </Button>
              {debugInfo && (
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left w-full overflow-auto max-h-40">
                  <p className="font-bold">Debug Info:</p>
                  <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
