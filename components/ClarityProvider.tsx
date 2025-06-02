"use client"

import { useEffect } from "react"

interface ClarityProviderProps {
  projectId?: string
}

export default function ClarityProvider({ projectId }: ClarityProviderProps) {
  useEffect(() => {
    if (typeof window !== "undefined" && projectId) {
      // Microsoft Clarity tracking code
      ;((c: any, l: any, a: any, r: any, i: any, t: any, y: any) => {
        c[a] =
          c[a] ||
          (() => {
            ;(c[a].q = c[a].q || []).push(arguments)
          })
        t = l.createElement(r)
        t.async = 1
        t.src = "https://www.clarity.ms/tag/" + i
        y = l.getElementsByTagName(r)[0]
        y.parentNode.insertBefore(t, y)
      })(window, document, "clarity", "script", projectId)
    }
  }, [projectId])

  return null
}
