"use client"

import { useState, useEffect } from "react"

type CookieConsentStatus = "accepted" | "declined" | "pending"

export function useCookieConsent() {
  const [consentStatus, setConsentStatus] = useState<CookieConsentStatus>("pending")
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if consent has been given before
    const storedConsent = localStorage.getItem("cookie-consent-status")

    if (storedConsent) {
      setConsentStatus(storedConsent as CookieConsentStatus)
    } else {
      // If no stored preference, show the banner (with a slight delay)
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [])

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent-status", "accepted")
    setConsentStatus("accepted")
    setShowBanner(false)

    // Enable analytics/tracking scripts here if needed
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("consent")
    }
  }

  const declineCookies = () => {
    localStorage.setItem("cookie-consent-status", "declined")
    setConsentStatus("declined")
    setShowBanner(false)

    // Disable analytics/tracking scripts here if needed
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("stop")
    }
  }

  return {
    consentStatus,
    showBanner,
    acceptCookies,
    declineCookies,
  }
}

// Add type definition for window.clarity
declare global {
  interface Window {
    clarity: (command: string, ...args: any[]) => void
  }
}
