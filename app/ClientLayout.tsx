"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle } from "lucide-react"
import { resendConfirmation } from "@/lib/auth"

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [resendLoading, setResendLoading] = useState(false)
  const [resendMessage, setResendMessage] = useState("")
  const [resendError, setResendError] = useState("")
  const router = useRouter()
  const pathname = usePathname()

  // Pages that don't require authentication
  const publicPages = ["/login", "/auth/callback", "/auth/verify"]
  const isPublicPage = publicPages.includes(pathname)

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        console.log("ClientLayout: Checking authentication...")

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) return

        console.log("ClientLayout: Session check:", {
          hasSession: !!session,
          userEmail: session?.user?.email,
          emailConfirmed: session?.user?.email_confirmed_at,
          currentPath: pathname,
          isPublicPage,
        })

        if (error) {
          console.log("ClientLayout: Session error:", error.message)
          setUser(null)
          setLoading(false)

          if (!isPublicPage) {
            router.push("/login")
          }
          return
        }

        const currentUser = session?.user || null
        setUser(currentUser)
        setLoading(false)

        // Handle routing based on auth state
        if (!currentUser && !isPublicPage) {
          console.log("ClientLayout: No user, redirecting to login")
          router.push("/login")
        } else if (currentUser && currentUser.email_confirmed_at && pathname === "/login") {
          console.log("ClientLayout: Verified user on login page, redirecting to home")
          router.push("/")
        }
      } catch (err) {
        console.error("ClientLayout: Auth check error:", err)
        if (mounted) {
          setUser(null)
          setLoading(false)
          if (!isPublicPage) {
            router.push("/login")
          }
        }
      }
    }

    checkAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      console.log("ClientLayout: Auth state change:", {
        event,
        hasSession: !!session,
        userEmail: session?.user?.email,
        emailConfirmed: session?.user?.email_confirmed_at,
      })

      const currentUser = session?.user || null
      setUser(currentUser)
      setLoading(false)

      // Handle auth state changes
      if (event === "SIGNED_OUT" || !currentUser) {
        if (!isPublicPage) {
          router.push("/login")
        }
      } else if (event === "SIGNED_IN" && currentUser?.email_confirmed_at) {
        if (pathname === "/login") {
          router.push("/")
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, pathname, isPublicPage])

  const handleResendConfirmation = async () => {
    if (!user?.email) return

    setResendLoading(true)
    setResendError("")
    setResendMessage("")

    const { error } = await resendConfirmation(user.email)

    if (error) {
      setResendError(error.message)
    } else {
      setResendMessage("Confirmation email sent! Please check your inbox and spam folder.")
    }

    setResendLoading(false)
  }

  const handleSignOut = async () => {
    console.log("ClientLayout: Manual sign out")
    await supabase.auth.signOut()
    router.push("/login")
  }

  // Show loading while checking auth (except on public pages)
  if (loading && !isPublicPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // If on a public page, always render content
  if (isPublicPage) {
    return <>{children}</>
  }

  // If no user on protected page, don't render (redirect will happen)
  if (!user) {
    return null
  }

  // If user exists but email not confirmed, show verification screen
  if (user && !user.email_confirmed_at) {
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
                Please check your inbox and spam folder, then click the verification link to continue.
              </p>
            </div>

            <Button onClick={handleResendConfirmation} disabled={resendLoading} className="w-full" variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              {resendLoading ? "Sending..." : "Resend Verification Email"}
            </Button>

            <Button onClick={handleSignOut} variant="ghost" className="w-full">
              Sign Out & Try Different Email
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

  // User is verified, render the content
  console.log("ClientLayout: User verified, rendering content")
  return <>{children}</>
}
