"use client"

import { usePathname } from "next/navigation"
import Chatbot from "./Chatbot"

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

  // Only render our new chatbot if authenticated and not on excluded paths
  if (!isAuthenticated || isExcludedPath) {
    return null
  }

  return <Chatbot />
}
