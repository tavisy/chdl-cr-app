"use client"

import { useState, useEffect } from "react"
import { useAuth } from "./AuthProvider"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, User, Save, CheckCircle } from "lucide-react"
import { getUserProfile, updateUserProfile } from "@/lib/auth-utils"
import type { Profile } from "@/lib/supabase"

export function UserProfile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return

    setLoading(true)
    const { data, error } = await getUserProfile(user.id)

    if (error) {
      setError("Failed to load profile")
    } else if (data) {
      setProfile(data)
      setFullName(data.full_name || "")
    }

    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    setError("")

    const result = await updateUserProfile({
      full_name: fullName,
    })

    if (result.success) {
      setMessage("Profile updated successfully!")
      await loadProfile() // Reload to get updated data
    } else {
      setError("Failed to update profile")
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-slate-600" />
        <h2 className="text-xl font-semibold">User Profile</h2>
      </div>

      {message && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">{message}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" value={user?.email || ""} disabled className="mt-1 bg-slate-50" />
          <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
        </div>

        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            className="mt-1"
          />
        </div>

        <div className="text-xs text-slate-500">
          <p>Account created: {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "Unknown"}</p>
          <p>Last updated: {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : "Never"}</p>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
