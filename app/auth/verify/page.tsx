"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VerifyPage() {
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Get URL parameters from the current location
        const urlParams = new URLSearchParams(window.location.search)
        const token = urlParams.get("token")
        const type = urlParams.get("type")

        if (!token || type !== "signup") {
          setStatus("error")
          setMessage("Invalid verification link. Please request a new confirmation email.")
          return
        }

        // Verify the token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        })

        if (error) {
          console.error("Verification error:", error)
          setStatus("error")
          setMessage("Verification failed. The link may have expired. Please request a new confirmation email.")
          return
        }

        if (data.user) {
          setStatus("success")
          setMessage("Email verified successfully! You can now access the Crown Royal Strategic Report.")

          // Redirect to the main app after a delay
          setTimeout(() => {
            router.push("/")
          }, 3000)
        } else {
          setStatus("error")
          setMessage("Verification failed. Please try again or contact support.")
        }
      } catch (err) {
        console.error("Unexpected verification error:", err)
        setStatus("error")
        setMessage("An unexpected error occurred during verification.")
      }
    }

    verifyUser()
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
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address"}
            {status === "success" && "Your account has been successfully verified"}
            {status === "error" && "There was an issue verifying your email"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          {status === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-16 w-16 text-purple-600 animate-spin" />
              <p className="text-slate-600">Verifying your email address...</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <p className="text-slate-600">{message}</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-slate-500">Redirecting to the report...</p>
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
