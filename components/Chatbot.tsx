"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Send, Loader2, AlertCircle, BookOpen, ExternalLink } from "lucide-react"
import { useChat } from "ai/react"
import { getCurrentUser } from "@/lib/auth"
import type { User } from "@supabase/supabase-js"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

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

  // Prevent body scroll when chatbot is open and user is scrolling within it
  useEffect(() => {
    if (isOpen) {
      const handleWheel = (e: WheelEvent) => {
        const target = e.target as Element
        const chatWidget = document.querySelector("[data-chat-widget]")

        if (chatWidget && chatWidget.contains(target)) {
          e.stopPropagation()
        }
      }

      document.addEventListener("wheel", handleWheel, { passive: false })
      return () => document.removeEventListener("wheel", handleWheel)
    }
  }, [isOpen])

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

  // Enhanced function to extract source references from AI responses
  const extractSourceReferences = (text: string) => {
    // Look for [Source: Section Name] pattern
    const sourceRegex = /\[Source:\s*([^\]]+)\]/gi
    const matches = [...text.matchAll(sourceRegex)]
    const sources = matches.map((match) => match[1].trim())

    // Also look for standalone section references in brackets
    const sectionRegex =
      /\[(Executive Summary|Canadian Identity|Consumer Insights|Competitive Analysis|Market Disruption|Strategic Recommendations|References)\]/gi
    const sectionMatches = [...text.matchAll(sectionRegex)]
    const sectionSources = sectionMatches.map((match) => match[1])

    // Combine and deduplicate
    const allSources = [...sources, ...sectionSources]
    return [...new Set(allSources)]
  }

  // Function to clean text by removing source citations for display
  const cleanMessageText = (text: string) => {
    return text
      .replace(/\[Source:\s*[^\]]+\]/gi, "") // Remove [Source: ...] citations
      .replace(/\s+/g, " ") // Clean up extra whitespace
      .trim()
  }

  // Function to get page route for source
  const getSourceRoute = (source: string) => {
    const routeMap: { [key: string]: string } = {
      "Executive Summary": "/",
      "Canadian Identity": "/canadian-identity",
      "Consumer Insights": "/consumer-insights",
      "Competitive Analysis": "/competitive-analysis",
      "Market Disruption": "/market-disruption",
      "Strategic Recommendations": "/recommendations",
      References: "/references",
    }
    return routeMap[source] || "/"
  }

  return (
    <>
      {/* Chat Toggle Button with Custom Avatar */}
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-green-800 hover:bg-green-900 shadow-lg z-50 p-1 overflow-hidden border-2 border-white"
          size="icon"
        >
          <div className="relative w-full h-full rounded-full overflow-hidden">
            <Image
              src="/images/kongzilla-chat-avatar.png"
              alt="KongZilla AI"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card
          className="fixed bottom-6 right-6 w-96 shadow-2xl z-[9999] max-h-[80vh] min-h-[400px] flex flex-col"
          data-chat-widget
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-green-800 text-white rounded-t-lg flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                <Image
                  src="/images/kongzilla-chat-avatar.png"
                  alt="KongZilla AI"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <CardTitle className="text-lg font-semibold">KongZilla AI</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-white hover:bg-green-900">
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

            {/* Messages Area - Custom scrollable container */}
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#065F46 #f3f4f6",
              }}
              onWheel={(e) => {
                // Allow scrolling within the messages container
                e.stopPropagation()
              }}
            >
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <div className="relative w-16 h-16 mx-auto mb-4 rounded-full overflow-hidden">
                    <Image
                      src="/images/kongzilla-chat-avatar.png"
                      alt="Crown Royal Assistant"
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <p className="text-sm">
                    Ask me anything about Crown Royal's strategic positioning, market analysis, or recommendations!
                  </p>
                  <p className="text-xs mt-2">
                    I can help with insights from our comprehensive research and will show you exactly where the
                    information comes from.
                  </p>
                </div>
              )}

              {messages.map((message) => {
                // Extract sources for assistant messages
                const sources = message.role === "assistant" ? extractSourceReferences(message.content) : []
                const cleanedContent =
                  message.role === "assistant" ? cleanMessageText(message.content) : message.content

                return (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="flex items-start space-x-2 max-w-[80%]">
                      {/* Assistant Avatar */}
                      {message.role === "assistant" && (
                        <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                          <Image
                            src="/images/kongzilla-chat-avatar.png"
                            alt="Assistant"
                            fill
                            className="object-cover"
                            sizes="24px"
                          />
                        </div>
                      )}

                      <div
                        className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap break-words ${
                          message.role === "user" ? "bg-green-800 text-white" : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {cleanedContent}

                        {/* Display sources for assistant messages */}
                        {message.role === "assistant" && sources.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-gray-300">
                            <p className="text-xs font-semibold flex items-center text-gray-600 mb-2">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Sources from Crown Royal microsite:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {sources.map((source, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    const route = getSourceRoute(source)
                                    router.push(route)
                                  }}
                                  className="text-xs bg-green-100 hover:bg-green-200 text-green-800 px-2 py-1 rounded-full flex items-center gap-1 transition-colors cursor-pointer"
                                  title={`Go to ${source} page`}
                                >
                                  {source}
                                  <ExternalLink className="h-2 w-2" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                      <Image
                        src="/images/kongzilla-chat-avatar.png"
                        alt="Assistant"
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                    <div className="bg-gray-100 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-gray-600">Analyzing microsite content...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="border-t p-4 flex-shrink-0 bg-white rounded-b-lg">
              <form onSubmit={handleFormSubmit} className="flex items-end space-x-2">
                <div className="flex-1">
                  <Textarea
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask KongZilla about Crown Royal..."
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
                  className="bg-green-800 hover:bg-green-900 mb-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 3px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: #065F46;
          border-radius: 3px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #064E3B;
        }
      `}</style>
    </>
  )
}
