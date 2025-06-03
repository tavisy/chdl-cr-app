"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Script from "next/script"

interface ChatbotWidgetProps {
  userId: string
  userEmail?: string | null
}

export function ChatbotWidget({ userId, userEmail }: ChatbotWidgetProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // List of paths where the chatbot should not appear
  const excludedPaths = ["/login", "/auth/callback", "/auth/verify", "/auth/reset-password", "/admin"]

  // Check if current path is excluded
  const isExcludedPath = excludedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  useEffect(() => {
    setMounted(true)

    // Clean up any previous instances of the chatbot
    return () => {
      // Remove any elements the chatbot script might have added to the DOM
      const chatElements = document.querySelectorAll('[data-chatbot-element="true"]')
      chatElements.forEach((el) => el.remove())
    }
  }, [])

  // Don't render on excluded paths or during SSR
  if (isExcludedPath || !mounted) {
    return null
  }

  return (
    <>
      <Script
        id="chatbot-script"
        src="https://chatapp.bignerdsolutions.com/js/chat_form_plugin.js"
        data-bot-id="51415"
        strategy="lazyOnload"
        onLoad={() => {
          console.log("Chatbot script loaded successfully")
        }}
      />
      {/* Required div wrapper for the chatbot */}
      <div id="chat_form" className="fixed bottom-4 right-4 z-50"></div>
      {/* Hidden div with user info that could be used by the chatbot if needed */}
      <div id="chatbot-user-data" data-user-id={userId} data-user-email={userEmail || ""} style={{ display: "none" }} />
    </>
  )
}
