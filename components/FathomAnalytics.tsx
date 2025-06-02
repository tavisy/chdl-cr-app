"use client"

import { useEffect, useState } from "react"
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
  const [fathomLoaded, setFathomLoaded] = useState(false)

  // Load Fathom script only once
  useEffect(() => {
    // Check if script is already loaded
    if (document.querySelector("script[data-site]")) {
      setFathomLoaded(true)
      return
    }

    try {
      const script = document.createElement("script")
      script.src = "https://cdn.usefathom.com/script.js"
      script.setAttribute("data-site", process.env.NEXT_PUBLIC_FATHOM_SITE_ID || "DMVNNXHT")
      script.setAttribute("data-auto", "false")
      script.defer = true

      script.onload = () => {
        setFathomLoaded(true)
      }

      document.head.appendChild(script)

      return () => {
        // Cleanup script on unmount
        if (document.head.contains(script)) {
          document.head.removeChild(script)
        }
      }
    } catch (error) {
      console.error("Failed to load Fathom:", error)
    }
  }, [])

  // Track page views
  useEffect(() => {
    if (!pathname || !fathomLoaded) return

    const trackPageview = () => {
      try {
        if (window.fathom) {
          const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
          window.fathom.trackPageview({ url })
        }
      } catch (error) {
        console.error("Failed to track pageview:", error)
      }
    }

    // Small delay to ensure fathom is loaded
    const timer = setTimeout(trackPageview, 200)

    return () => clearTimeout(timer)
  }, [pathname, searchParams, fathomLoaded])

  return null
}
