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

  // Session validation effect - Enhanced for stricter recovery validation
  useEffect(() => {
    let mounted = true

    const validateSession = async (): Promise<void> => {
      try {
        console.log("ResetPassword: Validating session...")

        // Check if user came from recovery flow or security check
        const fromRecovery = searchParams.get("from") === "recovery"
        const securityCheck = searchParams.get("security") === "check"
        console.log("ResetPassword: From recovery flow:", fromRecovery, "Security check:", securityCheck)

        const currentUser = await getCurrentUser()

        if (!currentUser) {
          console.log("ResetPassword: No authenticated user found")
          if (mounted) {
            setSessionError("Invalid session. Please request a new password reset link.")
          }
          return
        }

        // For recovery or security check flows, always require password reset
        if (fromRecovery || securityCheck) {
          // Verify the session is very recent (within last 5 minutes for tighter security)
          const sessionAge = Date.now() - new Date(currentUser.last_sign_in_at || 0).getTime()
          const maxSessionAge = 5 * 60 * 1000 // 5 minutes

          if (sessionAge > maxSessionAge) {
            console.log("ResetPassword: Session too old for password reset")
            if (mounted) {
              setSessionError("Password reset session has expired. Please request a new reset link.")
            }
            return
          }

          // For security checks, show a warning about forced password reset
          if (securityCheck && mounted) {
            setError("For security purposes, you must reset your password to continue.")
          }
        } else {
          // If not from recovery, verify user should be here
          console.log("ResetPassword: Direct access - verifying legitimacy")
          if (mounted) {
            setSessionError("Direct access not allowed. Please use a password reset link.")
          }
          return
        }

        console.log("ResetPassword: Valid session found for:", currentUser.email)
        if (mounted) {
          setUser(currentUser)
          setSessionValidated(true)
        }
      } catch (err) {
        console.error("ResetPassword: Error validating session:", err)
        if (mounted) {
          setSessionError("Error validating session. Please try again.")
        }
      }
    }

    validateSession()

    return () => {
      mounted = false
    }
  }, [searchParams])

  // Handle password update
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
        setSuccess(true)

        // Clear form data for security
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
    router.push("/login")
  }

  const handleGoBack = (): void => {
    router.back()
  }

  // Loading state
  if (!sessionValidated && !sessionError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-slate-600">Validating your session...</p>
            <p className="text-sm text-slate-500 mt-2">This should only take a moment</p>
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
            <div className="flex gap-2">
              <Button onClick={handleGoBack} variant="outline" className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
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
                <Alert variant="destructive">
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
