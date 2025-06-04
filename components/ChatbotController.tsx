"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Chatbot from "./Chatbot"

interface ChatbotControllerProps {
  isAuthenticated: boolean
  userId?: string
}

export function ChatbotController({ isAuthenticated, userId }: ChatbotControllerProps) {
  const pathname = usePathname()
  const [isChatbotEnabled, setIsChatbotEnabled] = useState<boolean>(true)

  // List of paths where the chatbot should not appear
  const excludedPaths = ["/login", "/auth/callback", "/auth/verify", "/auth/reset-password", "/admin"]

  // Check if current path is excluded
  const isExcludedPath = excludedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  // Hide the old chatbot div since we're using our new React component
  useEffect(() => {
    const chatForm = document.getElementById("chat_form")
    if (chatForm) {
      chatForm.style.display = "none"
    }
  }, [])

  // Listen for chatbot toggle events and check localStorage on mount
  useEffect(() => {
    const handleChatbotToggled = (event: CustomEvent) => {
      setIsChatbotEnabled(event.detail.enabled)
    }

    // Check localStorage on mount
    const storedValue = localStorage.getItem("chatbotEnabled")
    if (storedValue !== null) {
      setIsChatbotEnabled(storedValue === "true")
    }

    // Add event listener for toggle events
    window.addEventListener("chatbotToggled", handleChatbotToggled as EventListener)

    return () => {
      window.removeEventListener("chatbotToggled", handleChatbotToggled as EventListener)
    }
  }, [])

  // Only render our new chatbot if authenticated, not on excluded paths, and enabled
  if (!isAuthenticated || isExcludedPath || !isChatbotEnabled) {
    return null
  }

  return <Chatbot />
}
