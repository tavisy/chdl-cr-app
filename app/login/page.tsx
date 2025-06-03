"use client"
import { useState, useEffect, useMemo } from "react"
import type React from "react"
import { useRouter } from "next/navigation"
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  resendConfirmation,
  hasVerifiedAccess,
  needsEmailVerification,
  setRecoveryState,
} from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Mail, CheckCircle, AlertCircle, Bug, Shield, Eye, EyeOff } from "lucide-react"
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
  passwordResetAttempt?: {
    email: string
    error?: string
    recoveryState?: boolean
  }
  sessionError?: string
  checkAuthError?: string
  googleSignInError?: string
  [key: string]: any
}

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
  met: boolean
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
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showPasswordRequirements, setShowPasswordRequirements] = useState<boolean>(false)

  // Password validation for sign up
  const passwordRequirements: PasswordRequirement[] = useMemo(() => [
    {
      label: "At least 8 characters",
      test: (pwd) => pwd.length >= 8,
      met: password.length >= 8
    },
    {
      label: "One lowercase letter",
      test: (pwd) => /(?=.*[a-z])/.test(pwd),
      met: /(?=.*[a-z])/.test(password)
    },
    {
      label: "One uppercase letter", 
      test: (pwd) => /(?=.*[A-Z])/.test(pwd),
      met: /(?=.*[A-Z])/.test(password)
    },
    {
      label: "One number",
      test: (pwd) => /(?=.*\d)/.test(pwd),
      met: /(?=.*\d)/.test(password)
    },
    {
      label: "One special character",
      test: (pwd) => /(?=.*[@$!%*?&])/.test(pwd),
      met: /(?=.*[@$!%*?&])/.test(password)
    }
  ], [password])

  const passwordStrength = useMemo(() => {
    const metCount = passwordRequirements.filter(req => req.met).length
    const score = (metCount / passwordRequirements.length) * 100
    const isValid = passwordRequirements.every(req => req.met)
    return { score, isValid, metCount }
  }, [passwordRequirements])

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

    // Validate password requirements
    if (!passwordStrength.isValid) {
      setError("Please ensure your password meets all requirements.")
      setLoading(false)
      return
    }

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
      }
      // Don't set loading to false on success as we're redirecting
    } catch (err) {
      console.error("Google sign in exception:", err)
      setError("Failed to connect to Google. Please try again or use email sign-in.")
      setDebugInfo((prev) => ({ ...prev, googleSignInError: String(err) }))
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setMessage("")

    console.log("Attempting password reset for:", forgotPasswordEmail)

    try {
      // Set recovery state before sending reset email
      setRecoveryState()
      
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery&require_reset=true`,
      })

      const resetDebug = {
        email: forgotPasswordEmail,
        error: error?.message,
        recoveryState: true,
      }

      setDebugInfo((prev) => ({
        ...prev,
        passwordResetAttempt: resetDebug,
      }))

      if (error) {
        console.error("Password reset error:", error)
        setError(error.message)
        
        // Clear recovery state if email sending failed
        try {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("password_reset_initiated")
          }
        } catch (clearError) {
          console.warn("Failed to clear recovery state after error:", clearError)
        }
      } else {
        console.log("Password reset email sent successfully with recovery state set")
        setMessage("Password reset email sent! Please check your inbox and follow the instructions to reset your password.")
        setShowForgotPassword(false)
        setForgotPasswordEmail("")
      }
    } catch (err) {
      console.error("Password reset exception:", err)
      setError("Failed to send password reset email. Please try again.")
      
      // Clear recovery state on exception
      try {
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("password_reset_initiated")
        }
      } catch (clearError) {
        console.warn("Failed to clear recovery state after exception:", clearError)
      }
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
    setShowPassword(false)
    setShowPasswordRequirements(false)
  }

  const getPasswordStrengthColor = (score: number): string => {
    if (score < 40) return "text-red-600"
    if (score < 70) return "text-yellow-600"
    return "text-green-600"
  }

  const getPasswordStrengthText = (score: number): string => {
    if (score < 40) return "Weak"
    if (score < 70) return "Medium"
    return "Strong"
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
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        autoComplete="current-password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
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
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a secure password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        onFocus={() => setShowPasswordRequirements(true)}
                        required
                        disabled={loading}
                        autoComplete="new-password"
                        className="pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={loading}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password strength indicator */}
                    {password.length > 0 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-600">Password strength:</span>
                          <span className={`font-medium ${getPasswordStrengthColor(passwordStrength.score)}`}>
                            {getPasswordStrengthText(passwordStrength.score)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              passwordStrength.score < 40 ? "bg-red-500" :
                              passwordStrength.score < 70 ? "bg-yellow-500" : "bg-green-500"
                            }`}
                            style={{ width: `${passwordStrength.score}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Password requirements */}
                    {showPasswordRequirements && password.length > 0 && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-blue-900 mb-2">Password Requirements</h4>
                            <ul className="space-y-1">
                              {passwordRequirements.map((req, index) => (
                                <li 
                                  key={index}
                                  className={`text-xs flex items-center gap-2 ${
                                    req.met ? 'text-green-700' : 'text-blue-700'
                                  }`}
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full ${
                                    req.met ? 'bg-green-500' : 'bg-blue-400'
                                  }`} />
                                  {req.label}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading || !passwordStrength.isValid}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Enhanced Forgot Password Form */}
            {showForgotPassword && (
              <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="h-4 w-4 text-gray-600" />
                  <h4 className="text-sm font-semibold text-gray-900">Reset Password</h4>
                </div>
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
                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      You will receive an email with a secure link to reset your password. This link will require you to set a new password before accessing your account.
                    </AlertDescription>
                  </Alert>
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

            {/* Enhanced Debug Information */}
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
                          passwordStrength: passwordStrength.score,
                          passwordValid: passwordStrength.isValid,
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
                  {debugInfo.passwordResetAttempt && (
                    <div>
                      <p className="font-semibold">Password Reset:</p>
                      <pre>{JSON.stringify(debugInfo.passwordResetAttempt, null, 2)}</pre>
                    </div>
                  )}
                  {debugInfo.sessionError && (
                    <div>
                      <p className="font-semibold">Session Errors:</p>
                      <pre className="text-red-600">{debugInfo.sessionError}</pre>
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
