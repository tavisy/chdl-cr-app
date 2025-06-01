"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { CheckCircle, AlertCircle, Eye, EyeOff, Lock } from "lucide-react"
import type { User } from "@supabase/supabase-js"

export default function ResetPasswordPage(): JSX.Element {
  const [password, setPassword] = useState<string>("")
  const [confirmPassword, setConfirmPassword] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [validSession, setValidSession] = useState<boolean>(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      try {
        console.log("ResetPassword: Checking session...")

        const currentUser = await getCurrentUser()

        if (!currentUser) {
          console.log("ResetPassword: No authenticated user found")
          setError("Invalid session. Please request a new password reset.")
          return
        }

        console.log("ResetPassword: Valid session found for:", currentUser.email)
        setUser(currentUser)
        setValidSession(true)
      } catch (err) {
        console.error("ResetPassword: Error checking session:", err)
        setError("Error validating session. Please try again.")
      }
    }

    checkSession()
  }, [])

  const validatePassword = (password: string): string | null => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    return null
  }

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password strength
    const passwordError = validatePassword(password)
    if (passwordError) {
      setError(passwordError)
      setLoading(false)
      return
    }

    console.log("ResetPassword: Attempting to update password...")

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        console.error("ResetPassword: Error updating password:", error)
        setError(error.message)
      } else {
        console.log("ResetPassword: Password updated successfully")
        setSuccess(true)

        // Redirect to main app after a delay
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
  }

  const handleReturnToLogin = (): void => {
    router.push("/login")
  }

  if (!validSession && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-slate-600">Validating session...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <img
              src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
              alt="Carter Hales x BIGNERD"
              className="h-12 w-auto mx-auto mb-4"
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
                <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
              <p className="text-sm text-slate-500">Redirecting automatically...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            <CardTitle className="text-2xl font-bold">Set New Password</CardTitle>
            <CardDescription>{user?.email && `Create a new password for ${user.email}`}</CardDescription>
          </CardHeader>
          <CardContent>
            {error && !validSession ? (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button onClick={handleReturnToLogin} className="w-full">
                  Return to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handlePasswordReset} className="space-y-4">
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
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

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
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={loading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-blue-900">Password Requirements</h4>
                      <ul className="text-xs text-blue-700 mt-1 space-y-1">
                        <li className={password.length >= 6 ? "text-green-600" : ""}>• At least 6 characters long</li>
                        <li className={/(?=.*[a-z])/.test(password) ? "text-green-600" : ""}>• One lowercase letter</li>
                        <li className={/(?=.*[A-Z])/.test(password) ? "text-green-600" : ""}>• One uppercase letter</li>
                        <li className={/(?=.*\d)/.test(password) ? "text-green-600" : ""}>• One number</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Updating Password..." : "Update Password"}
                </Button>

                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
