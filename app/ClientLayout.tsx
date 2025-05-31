"use client"
import { useEffect, useState } from "react"
import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle, LogOut, UserIcon } from "lucide-react"
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [bypassVerification, setBypassVerification] = useState(() => {
    // Check if bypass is stored in localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("bypassVerification") === "true"
    }
    return false
  })
  const router = useRouter()
  const pathname = usePathname()

  // Pages that don't require authentication
  const publicPages = ["/login", "/auth/callback", "/auth/verify"]
  const isPublicPage = publicPages.includes(pathname)

  // Check authentication once on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("ClientLayout: Initial auth check...")

        // First get the current session without trying to refresh
        const { data: sessionData } = await supabase.auth.getSession()

        // If we have a session, try to refresh it to get the latest data
        if (sessionData.session) {
          console.log("ClientLayout: Session found, attempting refresh...")

          try {
            const { data: refreshData } = await supabase.auth.refreshSession()
            const session = refreshData.session

            if (session) {
              console.log("ClientLayout: Session refreshed successfully, user:", {
                email: session.user.email,
                confirmed: !!session.user.email_confirmed_at,
                confirmedAt: session.user.email_confirmed_at,
                provider: session.user.app_metadata?.provider,
                bypassActive: bypassVerification,
              })

              setUser(session.user)

              // If user is confirmed via Google OAuth, automatically set bypass
              if (session.user.app_metadata?.provider === "google" && session.user.email_confirmed_at) {
                console.log("ClientLayout: Google user with confirmed email, setting bypass")
                setBypassVerification(true)
                if (typeof window !== "undefined") {
                  localStorage.setItem("bypassVerification", "true")
                }
              }
            } else {
              // Refresh failed but we still have the original session
              console.log("ClientLayout: Session refresh returned no session, using original")
              setUser(sessionData.session.user)
            }
          } catch (refreshError) {
            // If refresh fails, fall back to the original session
            console.log("ClientLayout: Session refresh failed, using original session", refreshError)
            setUser(sessionData.session.user)
          }
        } else {
          // No session found
          console.log("ClientLayout: No session found")
          setUser(null)

          if (!isPublicPage) {
            router.push("/login")
          }
        }

        setLoading(false)

        // If on login page but already authenticated, redirect to home
        if (pathname === "/login" && user) {
          router.push("/")
        }
      } catch (err) {
        console.error("ClientLayout: Auth check error:", err)
        setUser(null)
        setLoading(false)

        if (!isPublicPage) {
          router.push("/login")
        }
      }
    }

    checkAuth()
  }, [isPublicPage, pathname, router, bypassVerification])

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("ClientLayout: Auth state change:", event)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user || null)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        // Clear bypass on sign out
        setBypassVerification(false)
        if (typeof window !== "undefined") {
          localStorage.removeItem("bypassVerification")
        }
        if (!isPublicPage) {
          router.push("/login")
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isPublicPage, router])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false)
    }

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [mobileMenuOpen])

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
    console.log("Signing out user...")
    await supabase.auth.signOut()
    // Clear bypass on sign out
    setBypassVerification(false)
    if (typeof window !== "undefined") {
      localStorage.removeItem("bypassVerification")
    }
    router.push("/login")
  }

  const handleBypassVerification = () => {
    console.log("Setting bypass verification to TRUE")
    setBypassVerification(true)
    // Store bypass in localStorage to persist across page refreshes
    if (typeof window !== "undefined") {
      localStorage.setItem("bypassVerification", "true")
    }
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

  // If no user on protected page, redirect to login
  if (!user) {
    router.push("/login")
    return null
  }

  // Check if user should have access (either email confirmed OR bypass is enabled)
  const isGoogleUser = user.app_metadata?.provider === "google"
  const hasAccess = user.email_confirmed_at || bypassVerification || isGoogleUser

  console.log("Access check:", {
    emailConfirmed: !!user.email_confirmed_at,
    confirmedAt: user.email_confirmed_at,
    isGoogleUser,
    bypassActive: bypassVerification,
    hasAccess,
  })

  // If user exists but email not confirmed and no bypass, show verification screen
  if (!hasAccess) {
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
                Your account: <strong>{user.email}</strong>
              </p>
              <p className="text-sm text-slate-600 mb-6">
                Please check your inbox and spam folder, then click the verification link to continue.
              </p>
            </div>

            <Button onClick={handleBypassVerification} className="w-full">
              Continue to Report (Skip Verification)
            </Button>

            <Button onClick={handleResendConfirmation} disabled={resendLoading} variant="outline" className="w-full">
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

            {/* Debug info */}
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <strong>Debug:</strong> User ID: {user.id}
              <br />
              Email: {user.email}
              <br />
              Confirmed: {user.email_confirmed_at ? "Yes" : "No"}
              <br />
              Confirmed At: {user.email_confirmed_at || "Not confirmed"}
              <br />
              Bypass Active: {bypassVerification ? "Yes" : "No"}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // User has access (verified or bypassed), render the content with navigation
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
                alt="Carter Hales x BIGNERD"
                className="h-6 md:h-8 w-auto"
              />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                setMobileMenuOpen(!mobileMenuOpen)
              }}
              className="md:hidden flex flex-col gap-1 p-2"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              ></span>
              <span className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
              <span
                className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              ></span>
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                Overview
              </a>
              <a href="/market-disruption" className="text-slate-600 hover:text-slate-900 transition-colors">
                Market Disruption
              </a>
              <a href="/competitive-analysis" className="text-slate-600 hover:text-slate-900 transition-colors">
                Competitive Analysis
              </a>
              <a href="/consumer-insights" className="text-slate-600 hover:text-slate-900 transition-colors">
                Consumer Insights
              </a>
              <a href="/recommendations" className="text-slate-600 hover:text-slate-900 transition-colors">
                Recommendations
              </a>

              {/* User info and logout button */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2 text-slate-600">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-xs">{user.email}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 h-8 px-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile navigation menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"} overflow-hidden`}
          >
            <div className="py-4 space-y-3 border-t border-slate-200 mt-3">
              <a
                href="/"
                className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Overview
              </a>
              <a
                href="/market-disruption"
                className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Market Disruption
              </a>
              <a
                href="/competitive-analysis"
                className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Competitive Analysis
              </a>
              <a
                href="/consumer-insights"
                className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Consumer Insights
              </a>
              <a
                href="/recommendations"
                className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recommendations
              </a>

              {/* Mobile user info and logout */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-600 py-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-xs">{user.email}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 w-full justify-start"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">{children}</main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Crown Royal Strategic Report</h3>
            <p className="text-slate-300 mb-6">
              Charting a Course for Premiumization and Bourbon Enthusiast Engagement
            </p>
            <div className="text-sm text-slate-400">© 2025 BigNERD Solutions x Carter Hales Design Lab</div>
          </div>
        </div>
      </footer>
    </>
  )
}
