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
        // Get the current URL hash parameters
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const type = hashParams.get("type")

        if (accessToken && refreshToken) {
          // Set the session from the tokens
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            console.error("Session error:", error)
            setStatus("error")
            setMessage("Failed to establish session. Please try signing in again.")
            return
          }

          if (data.user) {
            // Determine login method and log access
            const loginMethod = type === "signup" ? "email" : "google"
            await logAccess(data.user.id, loginMethod)

            setStatus("success")
            setMessage(
              type === "signup"
                ? "Email verified successfully! You can now access the Crown Royal Strategic Report."
                : "Authentication successful! Redirecting to the report...",
            )

            // Redirect after success
            setTimeout(() => router.push("/"), 2000)
          }
        } else {
          // Check if we already have a session
          const { data: sessionData } = await supabase.auth.getSession()

          if (sessionData.session?.user) {
            setStatus("success")
            setMessage("Authentication successful! Redirecting to the report...")
            setTimeout(() => router.push("/"), 2000)
          } else {
            setStatus("error")
            setMessage("No authentication session found. Please try signing in again.")
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err)
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
