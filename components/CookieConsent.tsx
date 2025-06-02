"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Check, Cookie } from "lucide-react"

interface CookieConsentProps {
  onAccept: () => void
  onDecline: () => void
}

export function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Small delay to prevent flash during page load
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-fade-in-up">
      <Card className="max-w-4xl mx-auto p-4 md:p-6 shadow-lg border-slate-200 bg-white/95 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-shrink-0 bg-slate-100 p-3 rounded-full">
            <Cookie className="h-6 w-6 text-slate-600" />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold mb-1">Cookie Preferences</h3>
            <p className="text-slate-600 text-sm mb-2">
              We use cookies to enhance your experience, analyze site traffic, and for marketing purposes. By clicking
              "Accept All", you consent to our use of cookies.
            </p>
            <p className="text-slate-500 text-xs">
              This includes analytics cookies like Microsoft Clarity that help us improve your user experience.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
            <Button variant="outline" size="sm" onClick={onDecline} className="flex items-center gap-1">
              <X className="h-4 w-4" />
              <span>Decline</span>
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onAccept}
              className="flex items-center gap-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4" />
              <span>Accept All</span>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
