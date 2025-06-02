"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import * as Fathom from "fathom-client"

export default function FathomAnalytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Initialize Fathom
    const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || "DMVNNXHT"

    Fathom.load(siteId, {
      auto: false,
      includedDomains: ["crown-royal-strategic-report.vercel.app"], // Replace with your actual domain
    })
  }, [])

  useEffect(() => {
    // Track page view on route change
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    Fathom.trackPageview({ url })
  }, [pathname, searchParams])

  return null
}
