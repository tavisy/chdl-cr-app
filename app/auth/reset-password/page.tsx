"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import type React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Eye, EyeOff, Lock, Shield, ArrowLeft } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface PasswordRequirement {
  label: string
  test: (password: string) => boolean
  met: boolean
}

interface PasswordValidation {
  isValid: boolean
  score: number
  requirements: PasswordRequirement[]
}

interface SessionValidationInfo {
  hasUser: boolean
  sessionAge: number
  maxSessionAge: number
  fromRecovery: boolean
  securityCheck: boolean
  requireReset: boolean
  recoveryState: boolean
  isValidSession: boolean
  userEmail?: string
}

export default function ResetPasswordPage(): JSX.Element {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [sessionValidated, setSessionValidated] = useState<boolean>(false)
  const [sessionError, setSessionError] = useState<string>("")
  const [sessionInfo, setSessionInfo] = useState<SessionValidationInfo | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()

  // Password validation logic
  const passwordValidation: PasswordValidation = useMemo(() => {
    const requirements: PasswordRequirement[] = [
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
    ]

    const metCount = requirements.filter(req => req.met).length
    const score = (metCount / requirements.length) * 100
    const isValid = requirements.every(req => req.met)

    return { requirements, score, isValid }
  }, [password])

  // Password strength indicator
  const getPasswordStrengthColor = (score: number): string => {
    if (score < 40) return "bg-red-500"
    if (score < 70) return "bg-yellow-500" 
    return "bg-green-500"
  }

  const getPasswordStrengthText = (score: number): string => {
    if (score < 40) return "Weak"
    if (score < 70) return "Medium"
    return "Strong"
  }

  // Check if passwords match
  const passwordsMatch = useMemo(() => {
    return password === confirmPassword && confirmPassword.length > 0
  }, [password, confirmPassword])

  // Form validation
  const isFormValid = useMemo(() => {
    return passwordValidation.isValid && passwordsMatch && !loading
  }, [passwordValidation.isValid, passwordsMatch, loading])

  // Enhanced session validation with stricter recovery requirements
  useEffect(() => {
    let mounted = true

    const validateSession = async (): Promise<void> => {
      try {
        console.log("ResetPassword: Starting enhanced session validation...")

        // Parse URL parameters for recovery indicators
        const fromRecovery = searchParams.get("from") === "recovery"
        const securityCheck = searchParams.get("security") === "check"
        const requireReset = searchParams.get("require_reset") === "true"
        const verified = searchParams.get("verified") === "true"

        console.log("ResetPassword: URL parameters:", {
          fromRecovery,
          securityCheck,
          requireReset,
          verified
        })

        // Check for recovery state from sessionStorage
        let recoveryState = false
        try {
          const { checkAndClearRecoveryState } = await import("@/lib/auth")
          recoveryState = checkAndClearRecoveryState()
          console.log("ResetPassword: Recovery state from sessionStorage:", recoveryState)
        } catch (err) {
          console.warn("ResetPassword: Could not check recovery state:", err)
        }

        const currentUser = await getCurrentUser()

        if (!currentUser) {
          console.log("ResetPassword: No authenticated user found")
          if (mounted) {
            setSessionError("Invalid session. Please request a new password reset link.")
          }
          return
        }

        // Calculate session age
        const sessionAge = Date.now() - new Date(currentUser.last_sign_in_at || 0).getTime()
        const maxSessionAge = 2 * 60 * 1000 // 2 minutes for stricter security

        const sessionValidationInfo: SessionValidationInfo = {
          hasUser: true,
          sessionAge,
          maxSessionAge,
          fromRecovery,
          securityCheck,
          requireReset,
          recoveryState,
          isValidSession: false,
          userEmail: currentUser.email || undefined
        }

        console.log("ResetPassword: Session validation info:", sessionValidationInfo)

        // STRICT VALIDATION: Must have at least one recovery indicator
        const hasRecoveryIndicator = fromRecovery || securityCheck || requireReset || recoveryState

        if (!hasRecoveryIndicator) {
          console.log("ResetPassword: No recovery indicators found - blocking direct access")
          if (mounted) {
            setSessionError("Invalid access. Please use a password reset link from your email.")
            setSessionInfo(sessionValidationInfo)
          }
          return
        }

        // For recovery flows with sessionStorage state, be more lenient with time
        const isRecoveryStateValid = recoveryState && sessionAge < 10 * 60 * 1000 // 10 minutes for sessionStorage
        const isUrlParamValid = (fromRecovery || requireReset) && sessionAge < maxSessionAge // 2 minutes for URL params

        if (!isRecoveryStateValid && !isUrlParamValid) {
          console.log("ResetPassword: Session too old for password reset", {
            sessionAge: Math.round(sessionAge / 1000),
            maxAllowed: Math.round(maxSessionAge / 1000),
            recoveryState,
            isRecoveryStateValid,
            isUrlParamValid
          })
          
          if (mounted) {
            setSessionError("Password reset session has expired. Please request a new reset link.")
            setSessionInfo(sessionValidationInfo)
          }
          return
        }

        sessionValidationInfo.isValidSession = true

        console.log("ResetPassword: Valid recovery session found for:", currentUser.email)
        
        if (mounted) {
          setUser(currentUser)
          setSessionValidated(true)
          setSessionInfo(sessionValidationInfo)

          // Set appropriate warning messages based on recovery type
          if (securityCheck) {
            setError("For security purposes, you must reset your password to continue.")
          } else if (fromRecovery || requireReset) {
            setError("You must reset your password to continue accessing your account.")
          } else if (recoveryState) {
            setError("Complete your password reset to secure your account.")
          }
        }
      } catch (err) {
        console.error("ResetPassword: Error validating session:", err)
        if (mounted) {
          setSessionError("Error validating session. Please try again.")
          setSessionInfo({
            hasUser: false,
            sessionAge: 0,
            maxSessionAge: 0,
            fromRecovery: false,
            securityCheck: false,
            requireReset: false,
            recoveryState: false,
            isValidSession: false
          })
        }
      }
    }

    validateSession()

    return () => {
      mounted = false
    }
  }, [searchParams])

  // Enhanced password update with recovery state cleanup
  const handlePasswordUpdate = useCallback(async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    if (!isFormValid) return

    setLoading(true)
    setError("")

    console.log("ResetPassword: Attempting to update password...")

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error("ResetPassword: Error updating password:", updateError)
        
        // Handle specific Supabase errors
        switch (updateError.message) {
          case 'New password should be different from the old password.':
            setError("Please choose a different password from your current one.")
            break
          case 'Password should be at least 6 characters.':
            setError("Password must be at least 8 characters long.")
            break
          default:
            setError(updateError.message || "Failed to update password. Please try again.")
        }
      } else {
        console.log("ResetPassword: Password updated successfully")
        
        // Clear recovery state and form data for security
        try {
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("password_reset_initiated")
            console.log("ResetPassword: Recovery state cleared after successful update")
          }
        } catch (cleanupError) {
          console.warn("ResetPassword: Failed to clear recovery state:", cleanupError)
        }
        
        setSuccess(true)
        setPassword("")
        setConfirmPassword("")

        // Redirect after success message is shown
        setTimeout(() => {
          router.push("/?password_changed=true")
        }, 3000)
      }
    } catch (err) {
      console.error("ResetPassword: Exception updating password:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [password, isFormValid, router])

  const handleReturnToLogin = (): void => {
    // Clear any recovery state when returning to login
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("password_reset_initiated")
      }
    } catch (error) {
      console.warn("Failed to clear recovery state:", error)
    }
    router.push("/login")
  }

  const handleGoBack = (): void => {
    router.back()
  }

  const handleRequestNewLink = (): void => {
    // Clear recovery state and redirect to login with message
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("password_reset_initiated")
      }
    } catch (error) {
      console.warn("Failed to clear recovery state:", error)
    }
    router.push("/login?message=Please request a new password reset link")
  }

  // Loading state
  if (!sessionValidated && !sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-slate-600">Validating your session...</p>
            <p className="text-sm text-slate-500 mt-2">Checking recovery permissions</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img
              src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
              alt="Carter Hales x BIGNERD"
              className="h-12 w-auto mx-auto mb-4"
              loading="eager"
            />
            <CardTitle className="text-2xl font-bold text-green-600">Password Updated!</CardTitle>
            <CardDescription>Your password has been successfully changed</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex flex-col items-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600" />
              <p className="text-slate-600">
                Your password has been updated successfully. You can now access the Crown Royal Strategic Report.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-1000" 
                  style={{ width: "100%" }}
                />
              </div>
              <p className="text-sm text-slate-500">Redirecting automatically...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state (session validation failed)
  if (sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img
              src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
              alt="Carter Hales x BIGNERD"
              className="h-12 w-auto mx-auto mb-4"
              loading="eager"
            />
            <CardTitle className="text-2xl font-bold text-red-600">Session Invalid</CardTitle>
            <CardDescription>Unable to verify your password reset session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{sessionError}</AlertDescription>
            </Alert>

            {/* Enhanced error details for development */}
            {sessionInfo && process.env.NODE_ENV === "development" && (
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <details className="mt-2">
                    <summary className="cursor-pointer font-medium">Debug Info</summary>
                    <div className="mt-2 text-xs">
                      <div>User: {sessionInfo.hasUser ? "Present" : "None"}</div>
                      <div>Email: {sessionInfo.userEmail || "N/A"}</div>
                      <div>Session Age: {Math.round(sessionInfo.sessionAge / 1000)}s</div>
                      <div>Max Age: {Math.round(sessionInfo.maxSessionAge / 1000)}s</div>
                      <div>From Recovery: {sessionInfo.fromRecovery ? "Yes" : "No"}</div>
                      <div>Security Check: {sessionInfo.securityCheck ? "Yes" : "No"}</div>
                      <div>Require Reset: {sessionInfo.requireReset ? "Yes" : "No"}</div>
                      <div>Recovery State: {sessionInfo.recoveryState ? "Yes" : "No"}</div>
                      <div>Valid Session: {sessionInfo.isValidSession ? "Yes" : "No"}</div>
                    </div>
                  </details>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={handleRequestNewLink} variant="outline" className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Request New Link
              </Button>
              <Button onClick={handleReturnToLogin} className="flex-1">
                Return to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="text-center">
            <img
              src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
              alt="Carter Hales x BIGNERD"
              className="h-12 w-auto mx-auto mb-4"
              loading="eager"
            />
            <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
            <CardDescription>
              {user?.email ? `Create a secure new password for ${user.email}` : "Create a secure new password"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {/* Security notice for recovery flows */}
            {sessionInfo && (sessionInfo.fromRecovery || sessionInfo.requireReset || sessionInfo.securityCheck) && (
              <Alert className="mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  {sessionInfo.securityCheck 
                    ? "Security check required. You must reset your password to continue."
                    : "Password reset required. This is for your account security."
                  }
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className="pr-10"
                    aria-describedby="password-requirements"
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
                
                {/* Password Strength Indicator */}
                {password.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">Password strength:</span>
                      <span className={`font-medium ${
                        passwordValidation.score < 40 ? 'text-red-600' : 
                        passwordValidation.score < 70 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText(passwordValidation.score)}
                      </span>
                    </div>
                    <Progress 
                      value={passwordValidation.score} 
                      className="h-2"
                    />
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                    className={`pr-10 ${
                      confirmPassword.length > 0 && !passwordsMatch ? 'border-red-500' : ''
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                
                {/* Password Match Indicator */}
                {confirmPassword.length > 0 && (
                  <div className={`text-sm flex items-center gap-1 ${
                    passwordsMatch ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {passwordsMatch ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3 w-3" />
                        <span>Passwords don't match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg" id="password-requirements">
                <div className="flex items-start gap-2">
                  <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-blue-900 mb-2">Password Requirements</h4>
                    <ul className="space-y-1">
                      {passwordValidation.requirements.map((req, index) => (
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

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={!isFormValid}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Update Password
                  </>
                )}
              </Button>

              {/* Error Display */}
              {error && (
                <Alert variant={error.includes("security") || error.includes("must reset") ? "default" : "destructive"}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
