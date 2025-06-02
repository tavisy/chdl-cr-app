"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function FathomDebug() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [trackingEvents, setTrackingEvents] = useState<string[]>([])

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    const timestamp = new Date().toLocaleTimeString()
    const event = `${timestamp}: Tracked page view for ${url}`

    setTrackingEvents((prev) => [...prev.slice(-4), event]) // Keep last 5 events

    // Log to console for debugging
    console.log("Fathom tracking:", event)
  }, [pathname, searchParams])

  // Only show in development
  if (process.env.NODE_ENV === "production") {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">Fathom Debug</div>
      {trackingEvents.map((event, index) => (
        <div key={index} className="mb-1">
          {event}
        </div>
      ))}
    </div>
  )
}
