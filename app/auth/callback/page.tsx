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

        // Log the full URL for debugging
        console.log("AuthCallback URL:", window.location.href)

        // Check for error parameters first
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get("error")
        const errorDescription = urlParams.get("error_description")

        if (error) {
          console.error("AuthCallback: URL contains error:", error, errorDescription)
          setStatus("error")
          setMessage(errorDescription || error)
          setDebugInfo({ error, errorDescription })
          return
        }

        // Check for hash parameters (OAuth flow)
        const hashString = window.location.hash.substring(1)
        console.log("AuthCallback: Hash string:", hashString)

        if (hashString) {
          const hashParams = new URLSearchParams(hashString)
          const accessToken = hashParams.get("access_token")
          const refreshToken = hashParams.get("refresh_token")
          const provider = hashParams.get("provider") || "google" // Default to google if not specified

          console.log("AuthCallback: Hash params:", {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
            provider,
          })

          if (accessToken && refreshToken) {
            console.log("AuthCallback: Setting session from OAuth tokens...")

            try {
              const { data, error: sessionError } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              })

              if (sessionError) {
                console.error("AuthCallback: OAuth session error:", sessionError)
                setStatus("error")
                setMessage("Failed to establish session from OAuth. Please try signing in again.")
                setDebugInfo({ sessionError })
                return
              }

              if (data.user) {
                console.log("AuthCallback: OAuth session established for user:", data.user.email)
                await logAccess(data.user.id, "google")

                // Store bypass in localStorage to ensure access
                localStorage.setItem("bypassVerification", "true")

                setStatus("success")
                setMessage(`Successfully signed in with ${provider}! Redirecting...`)
                setTimeout(() => router.push("/"), 2000)
                return
              }
            } catch (setSessionError) {
              console.error("AuthCallback: Error setting session from OAuth:", setSessionError)
              setStatus("error")
              setMessage("Error processing OAuth response. Please try again.")
              setDebugInfo({ setSessionError })
              return
            }
          }
        }

        // Check for code parameter (PKCE flow - email verification)
        const code = urlParams.get("code")
        console.log("AuthCallback: Code parameter:", code ? "present" : "not present")

        if (code) {
          console.log("AuthCallback: Exchanging code for session...")

          try {
            const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

            if (exchangeError) {
              console.error("AuthCallback: Code exchange error:", exchangeError)
              setStatus("error")
              setMessage("Failed to verify email. Please try again.")
              setDebugInfo({ exchangeError })
              return
            }

            if (data.session && data.user) {
              console.log("AuthCallback: Email verification successful for user:", data.user.email)

              // Force refresh the session to ensure we have the latest user data
              await supabase.auth.refreshSession()

              await logAccess(data.user.id, "email")

              // Store bypass in localStorage to ensure access
              localStorage.setItem("bypassVerification", "true")

              setStatus("success")
              setMessage("Email verified successfully! Redirecting...")
              setTimeout(() => router.push("/"), 2000)
              return
            } else {
              console.error("AuthCallback: Code exchange succeeded but no session/user returned")
              setStatus("error")
              setMessage("Authentication process incomplete. Please try signing in again.")
              setDebugInfo({ data })
              return
            }
          } catch (exchangeError) {
            console.error("AuthCallback: Error exchanging code:", exchangeError)
            setStatus("error")
            setMessage("Error processing verification. Please try again.")
            setDebugInfo({ exchangeError })
            return
          }
        }

        // Check if we already have a session
        try {
          const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

          if (sessionError) {
            console.error("AuthCallback: Error getting session:", sessionError)
            setStatus("error")
            setMessage("Error checking authentication status. Please try signing in again.")
            setDebugInfo({ sessionError })
            return
          }

          if (sessionData.session?.user) {
            console.log("AuthCallback: Existing session found for:", sessionData.session.user.email)

            // Store bypass in localStorage to ensure access
            localStorage.setItem("bypassVerification", "true")

            setStatus("success")
            setMessage("Already authenticated! Redirecting...")
            setTimeout(() => router.push("/"), 1000)
            return
          } else {
            console.log("AuthCallback: No authentication data found")
            setStatus("error")
            setMessage("No authentication data found. Please try signing in again.")
            return
          }
        } catch (sessionError) {
          console.error("AuthCallback: Error checking session:", sessionError)
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
                <div className="mt-4 p-2 bg-gray-100 rounded text-xs text-left w-full overflow-auto">
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
