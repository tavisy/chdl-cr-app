"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"
import { LogOut, UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UserMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      // Check if user is admin
      if (
        user &&
        (user.email?.includes("admin") || user.email?.includes("@bignerd") || user.email?.includes("@carterhales"))
      ) {
        setIsAdmin(true)
      }
    }

    getUser()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = "/login"
  }

  if (!user) return null

  return (
    <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
      <div className="flex items-center gap-2 text-slate-600">
        <UserIcon className="h-4 w-4" />
        <span className="text-xs hidden md:inline">{user.email}</span>
      </div>

      {isAdmin && (
        <a href="/admin" className="text-xs text-slate-600 hover:text-slate-900 transition-colors hidden md:block">
          Admin
        </a>
      )}

      <Button onClick={signOut} variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  )
}
