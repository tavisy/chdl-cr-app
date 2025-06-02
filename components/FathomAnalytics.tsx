"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { load, trackPageview } from "fathom-client"

function TrackPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Fathom on component mount
    load(process.env.NEXT_PUBLIC_FATHOM_SITE_ID!, {
      auto: false,
      includedDomains: ["crown-royal-strategic-report.vercel.app"], // Update with your actual domain
    })
  }, [])

  useEffect(() => {
    // Track page view on route change
    if (!pathname) return

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "")
    trackPageview({
      url,
      referrer: document.referrer,
    })
  }, [pathname, searchParams])

  return null
}

export default function FathomAnalytics() {
  return <TrackPageView />
}
