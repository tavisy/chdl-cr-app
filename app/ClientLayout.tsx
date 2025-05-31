"use client"
import { useEffect, useState, useCallback, useRef, useMemo } from "react"
import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, AlertCircle, LogOut, UserIcon } from "lucide-react"
import { resendConfirmation, hasVerifiedAccess, getCurrentUser } from "@/lib/auth"

interface ClientLayoutProps {
  children: React.ReactNode
}

// Custom hook for localStorage with SSR safety
function useLocalStorage(key: string, initialValue: boolean): [boolean, (value: boolean) => void, () => void, boolean] {
  const [storedValue, setStoredValue] = useState<boolean>(initialValue)
  const [isClient, setIsClient] = useState<boolean>(false)

  useEffect(() => {
    setIsClient(true)
    try {
      const item = window.localStorage.getItem(key)
      if (item) {
        setStoredValue(JSON.parse(item))
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
    }
  }, [key])

  const setValue = useCallback(
    (value: boolean) => {
      try {
        setStoredValue(value)
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key],
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue, isClient] as const
}

interface NavLink {
  href: string
  label: string
}

export default function ClientLayout({ children }: ClientLayoutProps): JSX.Element | null {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [authInitialized, setAuthInitialized] = useState<boolean>(false)
  const [resendLoading, setResendLoading] = useState<boolean>(false)
  const [resendMessage, setResendMessage] = useState<string>("")
  const [resendError, setResendError] = useState<string>("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false)

  const [, , , isClient] = useLocalStorage("bypassVerification", false)

  const router = useRouter()
  const pathname = usePathname()
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Pages that don't require authentication
  const publicPages: string[] = ["/login", "/auth/callback", "/auth/verify"]
  const isPublicPage: boolean = publicPages.includes(pathname)

  // Memoized access check that only recalculates when user changes
  const userHasAccess = useMemo(() => {
    if (!user) return false
    
    const hasAccess = hasVerifiedAccess(user)
    
    // Only log access check in ClientLayout when there's a significant change
    if (process.env.NODE_ENV === "development") {
      console.log("ClientLayout: User access check:", {
        email: user?.email,
        provider: user?.app_metadata?.provider,
        emailConfirmed: user?.email_confirmed_at,
        hasAccess
      })
    }
    
    return hasAccess
  }, [user?.id, user?.email_confirmed_at, user?.app_metadata?.provider])

  // Add a small delay before showing loading spinner to prevent flashing
  useEffect(() => {
    if (loading && !authInitialized) {
      loadingTimeoutRef.current = setTimeout(() => {
        setShowLoadingSpinner(true)
      }, 200) // 200ms delay
    } else {
      setShowLoadingSpinner(false)
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [loading, authInitialized])

  // ONE-TIME authentication initialization
  useEffect(() => {
    const initializeAuth = async (): Promise<void> => {
      try {
        console.log("ClientLayout: ONE-TIME auth initialization...")

        // Use the optimized getCurrentUser function to get fresh user data
        const currentUser = await getCurrentUser()

        if (currentUser) {
          console.log("ClientLayout: User found during initialization:", {
            email: currentUser.email,
            confirmed: !!currentUser.email_confirmed_at,
            provider: currentUser.app_metadata?.provider,
          })

          setUser(currentUser)
        } else {
          console.log("ClientLayout: No active user during initialization")
          setUser(null)
        }
      } catch (err) {
        console.error("ClientLayout: Auth initialization error:", err)
        setUser(null)
      } finally {
        console.log("ClientLayout: Auth initialization complete")
        setAuthInitialized(true)
        setLoading(false)
      }
    }

    // Only run once when the component first mounts
    if (!authInitialized) {
      initializeAuth()
    }
  }, [authInitialized]) // Only depend on authInitialized

  // Handle redirects ONLY after auth is initialized
  useEffect(() => {
    if (!authInitialized || loading) return

    console.log("ClientLayout: Checking redirects...", { 
      user: user ? 'present' : 'null', 
      isPublicPage, 
      pathname 
    })

    // Redirect unauthenticated users from protected pages
    if (!user && !isPublicPage) {
      console.log("ClientLayout: Redirecting unauthenticated user to login")
      router.push("/login")
      return
    }

    // Redirect authenticated users from login page
    if (user && pathname === "/login") {
      console.log("ClientLayout: Redirecting authenticated user to home")
      router.push("/")
      return
    }
  }, [user?.id, authInitialized, loading, isPublicPage, pathname, router])

  // Auth state change listener - optimized with change detection
  useEffect(() => {
    console.log("ClientLayout: Setting up auth state listener...")
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("ClientLayout: Auth state change:", event)

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          // Only update if user actually changed
          const userChanged = !user || session.user.id !== user.id
          
          if (userChanged) {
            console.log("ClientLayout: Updating user from auth state change")
            setUser(session.user)
          }
          
          // If we weren't initialized yet, mark as initialized
          if (!authInitialized) {
            setAuthInitialized(true)
            setLoading(false)
          }
        }
      } else if (event === "SIGNED_OUT") {
        console.log("ClientLayout: User signed out, clearing state")
        setUser(null)
      }
    })

    return () => {
      console.log("ClientLayout: Cleaning up auth state listener")
      subscription.unsubscribe()
    }
  }, [authInitialized, user?.id]) // Include user.id to detect changes

  // Mobile menu click outside handler
  useEffect(() => {
    if (!mobileMenuOpen) return

    const handleClickOutside = (event: MouseEvent): void => {
      const target = event.target as Element
      if (!target.closest("nav")) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [mobileMenuOpen])

  // Event handlers
  const handleResendConfirmation = async (): Promise<void> => {
    if (!user?.email) return

    setResendLoading(true)
    setResendError("")
    setResendMessage("")

    try {
      const { error } = await resendConfirmation(user.email)

      if (error) {
        setResendError(error.message)
      } else {
        setResendMessage("Confirmation email sent! Please check your inbox and spam folder.")
      }
    } catch (err) {
      console.error("ClientLayout: Resend confirmation error:", err)
      setResendError("Failed to send confirmation email. Please try again.")
    } finally {
      setResendLoading(false)
    }
  }

  const handleSignOut = async (): Promise<void> => {
    try {
      console.log("ClientLayout: Signing out user...")
      await supabase.auth.signOut()
      // Router redirect will be handled by the auth state change
    } catch (error) {
      console.error("ClientLayout: Sign out error:", error)
    }
  }

  const toggleMobileMenu = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation()
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Loading state - only show while initializing auth with delay
  if ((loading || !authInitialized) && showLoadingSpinner) {
    console.log("ClientLayout: Showing loading spinner - auth not initialized")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
          {process.env.NODE_ENV === "development" && (
            <div className="mt-2 text-xs text-slate-500">
              Debug: loading={loading.toString()}, authInitialized={authInitialized.toString()}, user={user ? 'present' : 'null'}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Render public pages without layout
  if (isPublicPage) {
    console.log("ClientLayout: Rendering public page without layout")
    return <>{children}</>
  }

  // Prevent flash of protected content for unauthenticated users
  if (!user) {
    console.log("ClientLayout: No user for protected page, showing nothing")
    return null
  }

  // Email verification screen for users who need verification
  if (!userHasAccess) {
    console.log("ClientLayout: User needs verification, showing verification screen")
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

            <Button 
              onClick={handleResendConfirmation} 
              disabled={resendLoading} 
              variant="outline" 
              className="w-full"
            >
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

            {/* Debug info - only show in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
                <strong>Debug:</strong> User ID: {user.id}
                <br />
                Email: {user.email}
                <br />
                Confirmed: {user.email_confirmed_at ? "Yes" : "No"}
                <br />
                Provider: {user.app_metadata?.provider || "email"}
                <br />
                Has Access: {userHasAccess ? "Yes" : "No"}
                <br />
                Auth Initialized: {authInitialized ? "Yes" : "No"}
                <br />
                Timestamp: {new Date().toISOString()}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Navigation links data
  const navLinks: NavLink[] = [
    { href: "/", label: "Overview" },
    { href: "/market-disruption", label: "Market Disruption" },
    { href: "/competitive-analysis", label: "Competitive Analysis" },
    { href: "/consumer-insights", label: "Consumer Insights" },
    { href: "/recommendations", label: "Recommendations" },
  ]

  console.log("ClientLayout: Rendering main layout for verified user")

  // Main authenticated layout
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <img
                  src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
                  alt="Carter Hales x BIGNERD"
                  className="h-6 md:h-8 w-auto cursor-pointer"
                />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMobileMenu} 
              className="md:hidden flex flex-col gap-1 p-2" 
              aria-label="Toggle menu"
              type="button"
            >
              <span
                className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? "opacity-0" : ""}`} />
              <span
                className={`w-6 h-0.5 bg-slate-900 transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </button>

            {/* Desktop navigation */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              {navLinks.map(({ href, label }: NavLink) => (
                <Link 
                  key={href} 
                  href={href} 
                  className="text-slate-600 hover:text-slate-900 transition-colors"
                >
                  {label}
                </Link>
              ))}

              {/* User info and logout button */}
              <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                <div className="flex items-center gap-2 text-slate-600">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-xs truncate max-w-32">{user.email}</span>
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  size="sm"
                  className="text-slate-600 hover:text-slate-900 h-8 px-2"
                  aria-label="Sign out"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile navigation menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <div className="py-4 space-y-3 border-t border-slate-200 mt-3">
              {navLinks.map(({ href, label }: NavLink) => (
                <Link
                  key={href}
                  href={href}
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}

              {/* Mobile user info and logout */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center gap-2 text-slate-600 py-2">
                  <UserIcon className="h-4 w-4" />
                  <span className="text-xs truncate">{user.email}</span>
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
