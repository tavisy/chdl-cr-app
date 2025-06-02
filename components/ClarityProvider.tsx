"use client"

import { useEffect } from "react"
import Script from "next/script"

// Named export
export function ClarityProvider() {
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID

  useEffect(() => {
    // Check if we have a project ID and if we're in the browser
    if (typeof window !== "undefined" && clarityProjectId) {
      // Initialize Clarity
      window.clarity =
        window.clarity ||
        (() => {
          ;(window.clarity.q = window.clarity.q || []).push(arguments)
        })
    }
  }, [clarityProjectId])

  if (!clarityProjectId) {
    return null
  }

  return (
    <Script id="microsoft-clarity" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${clarityProjectId}");
      `}
    </Script>
  )
}

// Default export (same component)
export default ClarityProvider
