"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageSquareOff, MessageSquare } from "lucide-react"

interface ChatbotToggleProps {
  isAdmin: boolean
}

export default function ChatbotToggle({ isAdmin }: ChatbotToggleProps) {
  const [isChatbotEnabled, setIsChatbotEnabled] = useState<boolean>(true)
  const [isClient, setIsClient] = useState<boolean>(false)

  // Initialize from localStorage once on client side
  useEffect(() => {
    setIsClient(true)
    const storedValue = localStorage.getItem("chatbotEnabled")
    if (storedValue !== null) {
      setIsChatbotEnabled(storedValue === "true")
    }
  }, [])

  const toggleChatbot = () => {
    const newValue = !isChatbotEnabled
    setIsChatbotEnabled(newValue)
    localStorage.setItem("chatbotEnabled", String(newValue))

    // Dispatch a custom event so other components can react to this change
    window.dispatchEvent(new CustomEvent("chatbotToggled", { detail: { enabled: newValue } }))
  }

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isClient) return null

  // Only render for admin users
  if (!isAdmin) return null

  return (
    <Button
      onClick={toggleChatbot}
      variant="outline"
      size="sm"
      className="fixed bottom-6 left-6 z-50 bg-white shadow-md border border-gray-200 hover:bg-gray-100"
      title={isChatbotEnabled ? "Disable Chatbot (Admin)" : "Enable Chatbot (Admin)"}
    >
      {isChatbotEnabled ? (
        <>
          <MessageSquareOff className="h-4 w-4 mr-2 text-green-800" />
          <span className="text-xs">Disable Chatbot</span>
        </>
      ) : (
        <>
          <MessageSquare className="h-4 w-4 mr-2 text-green-800" />
          <span className="text-xs">Enable Chatbot</span>
        </>
      )}
    </Button>
  )
}
