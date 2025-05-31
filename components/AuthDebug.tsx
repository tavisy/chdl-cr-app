"use client"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AuthDebug() {
  const [authState, setAuthState] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Get session
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

        // Get user
        const { data: userData, error: userError } = await supabase.auth.getUser()

        // Get profile from database
        let profileData = null
        if (sessionData.session?.user?.id) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single()

          profileData = { profile, profileError }
        }

        setAuthState({
          session: sessionData.session,
          sessionError,
          user: userData.user,
          userError,
          profileData,
          timestamp: new Date().toISOString(),
        })
      } catch (err) {
        console.error("Debug error:", err)
        setAuthState({ error: err })
      } finally {
        setLoading(false)
      }
    }

    checkAuthState()
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    window.location.reload()
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (loading) {
    return <div>Loading debug info...</div>
  }

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Authentication Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Button onClick={handleRefresh} variant="outline" size="sm">
            Refresh Debug Info
          </Button>
          <Button onClick={handleSignOut} variant="destructive" size="sm">
            Sign Out
          </Button>
        </div>

        <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto max-h-96">
          {JSON.stringify(authState, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
