"use client"
import { useState, useEffect, useMemo } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resendConfirmation,
  sendPasswordReset, // FIXED: Import sendPasswordReset instead of using supabase directly
  hasVerifiedAccess,
  needsEmailVerification,
} from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle, AlertCircle, Bug } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface DebugInfo {
  hasSession?: boolean
  userEmail?: string | undefined
  emailConfirmed?: string | null
  provider?: string
  hasAccess?: boolean
  signInAttempt?: {
    email: string
    hasData: boolean
    hasUser: boolean
    hasSession: boolean
    error?: string
    userVerified?: boolean
  }
  signUpAttempt?: {
    email: string
    hasData: boolean
    hasUser: boolean
    hasSession: boolean
    error?: string
  }
  resendAttempt?: {
    email: string
    error?: string
  }
  googleSignInAttempt?: {
    hasData: boolean
    error?: string
  }
  sessionError?: string
  checkAuthError?: string
  googleSignInError?: string
  [key: string]: any
}

export default function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [fullName, setFullName] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [showResendButton, setShowResendButton] = useState<boolean>(false)
  const [pendingEmail, setPendingEmail] = useState<string>("")
  const [showDebug, setShowDebug] = useState<boolean>(false)
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({})
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()
  const [showForgotPassword, setShowForgotPassword] = useState<boolean>(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("")

  // Memoized access check to prevent excessive logging
  const userHasAccess = useMemo(() => {
    if (!currentUser) return false
    return hasVerifiedAccess(currentUser)
  }, [currentUser])

  const userNeedsVerification = useMemo(() => {
    if (!currentUser) return false
    return needsEmailVerification(currentUser)
  }, [currentUser])

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthState = async (): Promise<void> => {
      try {
        console.log("Login page: Checking current auth state...")

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.log("Login page: No session error (expected on login page):", error.message)
          setDebugInfo((prev) => ({ ...prev, sessionError: error.message }))
          return
        }

        const user = session?.user || null
        setCurrentUser(user)

        if (user) {
          setDebugInfo((prev) => ({
            ...prev,
            hasSession: !!session,
            userEmail: user.email,
            emailConfirmed: user.email_confirmed_at,
            provider: user.app_metadata?.provider,
            hasAccess: hasVerifiedAccess(user),
          }))

          console.log("Login page: Found existing session:", {
            email: user.email,
            confirmed: user.email_confirmed_at,
            provider: user.app_metadata?.provider,
            hasAccess: hasVerifiedAccess(user),
          })

          // Check if user has verified access
          if (hasVerifiedAccess(user)) {
            console.log("Login page: User has verified access, redirecting to home")
            router.push("/")
          } else if (needsEmailVerification(user)) {
            console.log("Login page: User exists but needs email verification")
            setShowResendButton(true)
            setPendingEmail(user.email || "")
            setMessage(
              "Your email address needs to be verified. Please check your inbox or resend the confirmation email.",
            )
          }
        } else {
          console.log("Login page: No active session found (normal for login page)")
          setDebugInfo((prev) => ({
            ...prev,
            hasSession: false,
            userEmail: undefined,
            emailConfirmed: null,
            provider: undefined,
            hasAccess: false,
          }))
        }
      } catch (err) {
        console.error("Login page: Error checking auth state:", err)
        setDebugInfo((prev) => ({ ...prev, checkAuthError: String(err) }))
      }
    }

    checkAuthState()
  }, [router])

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")
    setShowResendButton(false)

    console.log("Attempting sign in for:", email)

    try {
      const { user, error } = await signInWithEmail(email, password)

      const signInDebug = {
        email,
        hasData: !!user,
        hasUser: !!user,
        hasSession: !!user,
        error: error?.message,
        userVerified: user ? hasVerifiedAccess(user) : false,
      }

      setDebugInfo((prev) => ({
        ...prev,
        signInAttempt: signInDebug,
      }))

      if (error) {
        console.error("Sign in error:", error)
        setError(error.message)

        // Check if it's an email confirmation issue
        if (
          error.message.includes("confirmation") ||
          error.message.includes("verify") ||
          error.message.includes("Email not confirmed") ||
          error.message.includes("email_not_confirmed")
        ) {
          setShowResendButton(true)
          setPendingEmail(email)
          setMessage("Please verify your email address before signing in.")
        }
      } else if (user) {
        console.log("Sign in successful:", {
          email: user.email,
          confirmed: user.email_confirmed_at,
          provider: user.app_metadata?.provider,
          id: user.id,
        })

        // Update current user state
        setCurrentUser(user)

        // Use the helper functions to check access
        const userHasAccess = hasVerifiedAccess(user)
        const userNeedsVerification = needsEmailVerification(user)

        if (userHasAccess) {
          console.log("User has verified access, redirecting to home")
          router.push("/")
        } else if (userNeedsVerification) {
          console.log("Email user needs verification")
          setShowResendButton(true)
          setPendingEmail(user.email || "")
          setMessage("Please verify your email address to continue.")
        } else {
          // This shouldn't happen, but handle it gracefully
          console.warn("User signed in but access status unclear")
          setError("Authentication incomplete. Please try again.")
        }
      }
    } catch (err) {
      console.error("Sign in exception:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    console.log("Attempting sign up for:", email)

    try {
      const { user, error } = await signUpWithEmail(email, password, { fullName })

      const signUpDebug = {
        email,
        hasData: !!user,
        hasUser: !!user,
        hasSession: !!user,
        error: error?.message,
      }

      setDebugInfo((prev) => ({
        ...prev,
        signUpAttempt: signUpDebug,
      }))

      if (error) {
        console.error("Sign up error:", error)
        setError(error.message)
      } else {
        console.log("Sign up successful, confirmation email should be sent")
        setMessage("Please check your email and click the confirmation link to complete your registration!")
        setPendingEmail(email)
        setShowResendButton(true)
      }
    } catch (err) {
      console.error("Sign up exception:", err)
      setError("An unexpected error occurred during sign up. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async (): Promise<void> => {
    setLoading(true)
    setError("")
    setMessage("")

    console.log("Resending confirmation to:", pendingEmail)

    try {
      const { error } = await resendConfirmation(pendingEmail)

      const resendDebug = {
        email: pendingEmail,
        error: error?.message,
      }

      setDebugInfo((prev) => ({
        ...prev,
        resendAttempt: resendDebug,
      }))

      if (error) {
        console.error("Resend error:", error)
        setError(error.message)
      } else {
        console.log("Confirmation email resent successfully")
        setMessage("Confirmation email sent! Please check your inbox and spam folder.")
      }
    } catch (err) {
      console.error("Resend exception:", err)
      setError("Failed to send confirmation email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async (): Promise<void> => {
    setLoading(true)
    setError("")

    try {
      console.log("Attempting Google sign in")
      const { error } = await signInWithGoogle()

      const googleDebug = {
        hasData: !error,
        error: error?.message,
        timestamp: new Date().toISOString(),
      }

      setDebugInfo((prev) => ({
        ...prev,
        googleSignInAttempt: googleDebug,
      }))

      if (error) {
        console.error("Google sign in error:", error)
        setError(`Google sign-in failed: ${error.message}`)
        setLoading(false)
      } else {
        console.log("Google sign in initiated successfully, redirecting...")
        // Don't set loading to false on success as we're redirecting
      }
    } catch (err) {
      console.error("Google sign in exception:", err)
      setError("Failed to connect to Google. Please try again or use email sign-in.")
      setDebugInfo((prev) => ({ ...prev, googleSignInError: String(err) }))
      setLoading(false)
    }
  }

  // FIXED: Use sendPasswordReset from auth.ts instead of direct supabase call
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    console.log("Attempting password reset for:", forgotPasswordEmail)

    try {
      const { error } = await sendPasswordReset(forgotPasswordEmail)

      if (error) {
        console.error("Password reset error:", error)
        setError(error.message)
      } else {
        console.log("Password reset email sent successfully")
        setMessage("Password reset email sent! Please check your inbox and follow the instructions.")
        setShowForgotPassword(false)
        setForgotPasswordEmail("")
      }
    } catch (err) {
      console.error("Password reset exception:", err)
      setError("Failed to send password reset email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleDebug = (): void => {
    setShowDebug(!showDebug)
  }

  const clearForm = (): void => {
    setEmail("")
    setPassword("")
    setFullName("")
    setError("")
    setMessage("")
    setShowResendButton(false)
    setPendingEmail("")
    setShowForgotPassword(false)
    setForgotPasswordEmail("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <img
              src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
              alt="Carter Hales x BIGNERD"
              className="h-12 w-auto mx-auto mb-4"
            />
            <CardTitle className="text-2xl font-bold">Crown Royal Strategic Report</CardTitle>
            <CardDescription>Access the comprehensive strategic analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="current-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="text-center mt-2">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-xs text-muted-foreground"
                      type="button"
                    >
                      Forgot your password?
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
                      disabled={loading}
                      autoComplete="name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      disabled={loading}
                      autoComplete="new-password"
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Forgot Password Form */}
            {showForgotPassword && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Reset Password</h4>
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="forgot-email">Email</Label>
                    <Input
                      id="forgot-email"
                      type="email"
                      placeholder="Enter your email address"
                      value={forgotPasswordEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForgotPasswordEmail(e.target.value)}
                      required
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={loading} className="flex-1">
                      {loading ? "Sending..." : "Send Reset Email"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setForgotPasswordEmail("")
                        setError("")
                        setMessage("")
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleSignIn}
                disabled={loading}
                type="button"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                {loading ? "Connecting..." : "Continue with Google"}
              </Button>
            </div>

            {/* Resend Confirmation Button */}
            {showResendButton && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResendConfirmation}
                  disabled={loading}
                  type="button"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {loading ? "Sending..." : "Resend Confirmation Email"}
                </Button>
              </div>
            )}

            {/* Debug Toggle */}
            <div className="mt-4">
              <Button variant="ghost" size="sm" onClick={toggleDebug} className="w-full text-xs" type="button">
                <Bug className="mr-2 h-3 w-3" />
                {showDebug ? "Hide" : "Show"} Debug Info
              </Button>
            </div>

            {/* Clear Form Button */}
            <div className="mt-2">
              <Button variant="ghost" size="sm" onClick={clearForm} className="w-full text-xs" type="button">
                Clear Form
              </Button>
            </div>

            {error && (
              <Alert className="mt-4" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {message && (
              <Alert className="mt-4">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {/* Debug Information */}
            {showDebug && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs font-mono overflow-auto max-h-96">
                <h4 className="font-bold mb-2">Debug Information:</h4>
                <div className="space-y-2">
                  <div>
                    <p className="font-semibold">Current State:</p>
                    <pre>
                      {JSON.stringify(
                        {
                          hasSession: debugInfo.hasSession,
                          userEmail: debugInfo.userEmail,
                          emailConfirmed: debugInfo.emailConfirmed,
                          provider: debugInfo.provider,
                          hasAccess: debugInfo.hasAccess,
                          userHasAccess: userHasAccess,
                          userNeedsVerification: userNeedsVerification,
                        },
                        null,
                        2,
                      )}
                    </pre>
                  </div>
                  {debugInfo.signInAttempt && (
                    <div>
                      <p className="font-semibold">Latest Sign In:</p>
                      <pre>{JSON.stringify(debugInfo.signInAttempt, null, 2)}</pre>
                    </div>
                  )}
                  {debugInfo.signUpAttempt && (
                    <div>
                      <p className="font-semibold">Latest Sign Up:</p>
                      <pre>{JSON.stringify(debugInfo.signUpAttempt, null, 2)}</pre>
                    </div>
                  )}
                  {debugInfo.resendAttempt && (
                    <div>
                      <p className="font-semibold">Latest Resend:</p>
                      <pre>{JSON.stringify(debugInfo.resendAttempt, null, 2)}</pre>
                    </div>
                  )}
                  {debugInfo.googleSignInAttempt && (
                    <div>
                      <p className="font-semibold">Google Sign In:</p>
                      <pre>{JSON.stringify(debugInfo.googleSignInAttempt, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
