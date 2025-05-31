"use client"

import { UserProfile } from "@/components/auth/UserProfile"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto">
          <Link href="/">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Report
            </Button>
          </Link>

          <h1 className="text-3xl font-bold mb-8 text-slate-900">User Profile</h1>

          <UserProfile />
        </div>
      </div>
    </div>
  )
}
