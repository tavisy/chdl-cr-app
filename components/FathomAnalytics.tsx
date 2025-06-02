"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

declare global {
  interface Window {
    fathom?: {
      trackPageview: (options?: { url?: string; referrer?: string }) => void
    }
  }
}

export default function FathomAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Load Fathom script
    const script = document.createElement("script")
    script.src = "https://cdn.usefathom.com/script.js"
    script.setAttribute("data-site", process.env.NEXT_PUBLIC_FATHOM_SITE_ID || "DMVNNXHT")
    script.setAttribute("data-auto", "false")
    script.defer = true

    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!pathname) return

    const trackPageview = () => {
      if (window.fathom) {
        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
        window.fathom.trackPageview({ url })
        console.log("Fathom tracking page:", url) // Debug log
      } else {
        // Retry if fathom isn't loaded yet
        setTimeout(trackPageview, 100)
      }
    }

    // Small delay to ensure fathom is loaded
    const timer = setTimeout(trackPageview, 200)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return null
}
