"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, X, Send, Loader2, AlertCircle, BookOpen } from "lucide-react"
import { useChat } from "ai/react"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@supabase/supabase-js"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading: isChatLoading,
    error: chatError,
  } = useChat({
    api: "/api/chat",
    initialMessages: [],
    onError: (error) => {
      console.error("Chat error:", error)
      setError("Failed to send message. Please try again.")
    },
    onResponse: () => {
      setError(null) // Clear error on successful response
    },
  })

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error("Auth check failed:", err)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (isLoading) {
    return null
  }

  // Show chatbot for all users (remove auth requirement for testing)
  // if (!user) {
  //   return null
  // }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setError(null) // Clear error when opening/closing
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    setError(null) // Clear error before sending
    handleSubmit(e)
  }

  // Helper function to extract source references from AI responses
  const extractSourceReferences = (text: string) => {
    const sourceRegex = /\[(.*?)\]/g
    const matches = [...text.matchAll(sourceRegex)]
    const sources = matches
      .map((match) => match[1])
      .filter((source) =>
        [
          "Executive Summary",
          "Canadian Identity",
          "Consumer Insights",
          "Competitive Analysis",
          "Market Disruption",
          "Strategic Recommendations",
          "References",
        ].includes(source),
      )

    // Return unique sources
    return [...new Set(sources)]
  }

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-purple-600 hover:bg-purple-700 shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 shadow-2xl z-50 max-h-[80vh] min-h-[400px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-purple-600 text-white rounded-t-lg flex-shrink-0">
            <CardTitle className="text-lg font-semibold">Crown Royal Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-white hover:bg-purple-700">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex flex-col p-0 flex-1 overflow-hidden">
            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-3 m-4 flex-shrink-0">
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            {/* Messages Area - This should scroll and take remaining space */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">
                        Ask me anything about Crown Royal's strategic positioning, market analysis, or recommendations!
                      </p>
                      <p className="text-xs mt-2">I can help with insights from our comprehensive research.</p>
                    </div>
                  )}

                  {messages.map((message) => {
                    // Extract sources for assistant messages
                    const sources = message.role === "assistant" ? extractSourceReferences(message.content) : []

                    return (
                      <div
                        key={message.id}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                            message.role === "user" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          {message.content}

                          {/* Display sources for assistant messages */}
                          {message.role === "assistant" && sources.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs font-semibold flex items-center text-gray-600">
                                <BookOpen className="h-3 w-3 mr-1" />
                                Sources:
                              </p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {sources.map((source, idx) => (
                                  <span
                                    key={idx}
                                    className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded"
                                  >
                                    {source}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}

                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="border-t p-4 flex-shrink-0 bg-white rounded-b-lg">
              <form onSubmit={handleFormSubmit} className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask about Crown Royal strategy..."
                    className="min-h-[40px] max-h-[120px] resize-none"
                    disabled={isChatLoading}
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleFormSubmit(e)
                      }
                    }}
                    style={{
                      height: "auto",
                      minHeight: "40px",
                      maxHeight: "120px",
                    }}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement
                      target.style.height = "auto"
                      target.style.height = Math.min(target.scrollHeight, 120) + "px"
                    }}
                  />
                </div>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isChatLoading || !input.trim()}
                  className="bg-purple-600 hover:bg-purple-700 mb-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
