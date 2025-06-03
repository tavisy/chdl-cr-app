"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

interface ChatbotControllerProps {
  isAuthenticated: boolean
  userId?: string
}

export function ChatbotController({ isAuthenticated, userId }: ChatbotControllerProps) {
  const pathname = usePathname()

  // List of paths where the chatbot should not appear
  const excludedPaths = ["/login", "/auth/callback", "/auth/verify", "/auth/reset-password", "/admin"]

  // Check if current path is excluded
  const isExcludedPath = excludedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  useEffect(() => {
    const chatForm = document.getElementById("chat_form")

    if (chatForm) {
      // Show/hide chatbot based on authentication and path
      if (isAuthenticated && !isExcludedPath) {
        chatForm.style.display = "block"
        chatForm.style.position = "fixed"
        chatForm.style.bottom = "20px"
        chatForm.style.right = "20px"
        chatForm.style.zIndex = "1000"
      } else {
        chatForm.style.display = "none"
      }
    }
  }, [isAuthenticated, isExcludedPath, pathname])

  return null // This component doesn't render anything visible
}
