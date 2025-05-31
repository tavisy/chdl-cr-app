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

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("AuthCallback: Starting auth callback process...")
        console.log("AuthCallback: Current URL:", window.location.href)

        // Check for error parameters first
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get("error")
        const errorDescription = urlParams.get("error_description")

        if (error) {
          console.error("AuthCallback: URL contains error:", error, errorDescription)
          setStatus("error")
          setMessage(errorDescription || error)
          return
        }

        // Check for hash parameters (OAuth flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const type = hashParams.get("type")

        console.log("AuthCallback: Hash params:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type,
        })

        if (accessToken && refreshToken) {
          console.log("AuthCallback: Setting session from tokens...")

          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (sessionError) {
            console.error("AuthCallback: Session error:", sessionError)
            setStatus("error")
            setMessage("Failed to establish session. Please try signing in again.")
            return
          }

          if (data.user) {
            console.log("AuthCallback: Session established for user:", data.user.email)

            // Log access
            const loginMethod = type === "signup" ? "email" : "google"
            await logAccess(data.user.id, loginMethod)

            setStatus("success")
            setMessage("Authentication successful! Redirecting...")

            // Redirect after a short delay
            setTimeout(() => router.push("/"), 2000)
            return
          }
        }

        // Check for code parameter (PKCE flow)
        const code = urlParams.get("code")

        if (code) {
          console.log("AuthCallback: Exchanging code for session...")

          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

          if (exchangeError) {
            console.error("AuthCallback: Code exchange error:", exchangeError)
            setStatus("error")
            setMessage("Failed to verify email. Please try again.")
            return
          }

          if (data.session && data.user) {
            console.log("AuthCallback: Code exchange successful for user:", data.user.email)

            // Log access
            await logAccess(data.user.id, "email")

            setStatus("success")
            setMessage("Email verified successfully! Redirecting...")

            // Redirect after a short delay
            setTimeout(() => router.push("/"), 2000)
            return
          }
        }

        // Check if we already have a session
        const { data: sessionData } = await supabase.auth.getSession()

        if (sessionData.session?.user) {
          console.log("AuthCallback: Existing session found")
          setStatus("success")
          setMessage("Already authenticated! Redirecting...")
          setTimeout(() => router.push("/"), 1000)
        } else {
          console.log("AuthCallback: No authentication data found")
          setStatus("error")
          setMessage("No authentication data found. Please try signing in again.")
        }
      } catch (err) {
        console.error("AuthCallback: Unexpected error:", err)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try signing in again.")
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
