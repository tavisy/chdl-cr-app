"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle } from "lucide-react"
import { resendConfirmation } from "@/lib/auth"

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [resendError, setResendError] = useState("")
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        console.log("AuthGuard: Checking user session...")

        // Use getSession to check current session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) return

        console.log("AuthGuard: Session check result:", {
          hasSession: !!session,
          hasUser: !!session?.user,
          userEmail: session?.user?.email,
          emailConfirmed: session?.user?.email_confirmed_at,
          error: error?.message,
        })

        if (error) {
          console.log("AuthGuard: Session error:", error.message)
          setUser(null)
          setLoading(false)
          setAuthChecked(true)
          return
        }

        const user = session?.user || null
        setUser(user)
        setLoading(false)
        setAuthChecked(true)

        // Only redirect if no user and we're not already on login page
        if (!user && typeof window !== "undefined" && window.location.pathname !== "/login") {
          console.log("AuthGuard: No user found, redirecting to login")
          router.push("/login")
        } else if (user) {
          console.log("AuthGuard: User found:", {
            email: user.email,
            confirmed: !!user.email_confirmed_at,
          })
        }
      } catch (err) {
        console.error("AuthGuard: Unexpected auth error:", err)
        if (mounted) {
          setUser(null)
          setLoading(false)
          setAuthChecked(true)
        }
      }
    }

    // Initial check
    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("AuthGuard: Auth state change:", {
        event,
        hasSession: !!session,
        userEmail: session?.user?.email,
        emailConfirmed: session?.user?.email_confirmed_at,
      })

      const user = session?.user ?? null
      setUser(user)
      setLoading(false)
      setAuthChecked(true)

      // Handle specific auth events
      if (event === "SIGNED_OUT" || !session?.user) {
        console.log("AuthGuard: User signed out or no session")
        if (typeof window !== "undefined" && window.location.pathname !== "/login") {
          router.push("/login")
        }
      } else if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        console.log("AuthGuard: User session updated")
        // Force a re-check after token refresh or sign in
        setTimeout(() => {
          if (mounted) {
            checkUser()
          }
        }, 100)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router])

  const handleResendConfirmation = async () => {
    if (!user?.email) return

    setResendLoading(true)
    setResendError("")
    setResendMessage("")

    const { error } = await resendConfirmation(user.email)

    if (error) {
      setResendError(error.message)
    } else {
      setResendMessage("Confirmation email sent! Please check your inbox.")
    }

    setResendLoading(false)
  }

  const handleSignOut = async () => {
    console.log("AuthGuard: Manual sign out")
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Show loading while checking auth
  if (loading || !authChecked) {
    console.log("AuthGuard: Showing loading state", { loading, authChecked })
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If no user, don't render anything (redirect will happen)
  if (!user) {
    console.log("AuthGuard: No user, not rendering content")
    return null
  }

  // Check if email is verified
  if (!user.email_confirmed_at) {
    console.log("AuthGuard: User email not confirmed, showing verification screen")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img
              src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
              alt="Carter Hales x BIGNERD"
              className="h-12 w-auto mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold">Email Verification Required</CardTitle>
            <CardDescription>
              Please verify your email address to access the Crown Royal Strategic Report
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <Mail className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <p className="text-slate-700 mb-4">
                We've sent a verification email to <strong>{user.email}</strong>
              </p>
              <p className="text-sm text-slate-600 mb-6">
                Please check your inbox and click the verification link to continue.
              </p>
            </div>

            <Button onClick={handleResendConfirmation} disabled={resendLoading} className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </Button>

            <Button onClick={handleSignOut} variant="ghost" className="w-full">
              Sign Out
            </Button>

            {resendError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{resendError}</AlertDescription>
              </Alert>
            )}

            {resendMessage && (
              <Alert>
                <Mail className="h-4 w-4" />
                <AlertDescription>{resendMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  console.log("AuthGuard: User verified, rendering content")
  return <>{children}</>
}
