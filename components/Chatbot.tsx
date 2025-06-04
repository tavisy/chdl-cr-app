"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
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
        <button onClick={toggleChat} className="chatbot-toggle">
          <div className="chatbot-avatar-container">
            <Image
              src="/images/kongzilla-chat-avatar.png"
              alt="KongZilla AI"
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window" data-chat-widget>
          <div className="chatbot-header">
            <div className="chatbot-header-title">
              <div className="chatbot-header-avatar">
                <Image
                  src="/images/kongzilla-chat-avatar.png"
                  alt="KongZilla AI"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <h2 className="text-lg font-semibold">KongZilla AI</h2>
            </div>
            <button onClick={toggleChat} className="chatbot-close-button">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col p-0 flex-1 overflow-hidden">
            {/* Error Display */}
            {error && (
              <div className="chatbot-error">
                <div className="chatbot-error-content">
                  <AlertCircle className="chatbot-error-icon" />
                  <p className="chatbot-error-text">{error}</p>
                </div>
              </div>
            )}

            {/* Messages Area - Custom scrollable container */}
            <div
              ref={messagesContainerRef}
              className="chatbot-messages-container chatbot-scrollbar"
              onWheel={(e) => {
                // Allow scrolling within the messages container
                e.stopPropagation()
              }}
            >
              {messages.length === 0 && (
                <div className="chatbot-welcome">
                  <div className="chatbot-welcome-avatar">
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
                  <div
                    key={message.id}
                    className={message.role === "user" ? "chatbot-user-message" : "chatbot-assistant-message"}
                  >
                    <div className="chatbot-message-content">
                      {/* Assistant Avatar */}
                      {message.role === "assistant" && (
                        <div className="chatbot-message-avatar">
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
                        className={`chatbot-message-bubble ${
                          message.role === "user" ? "chatbot-user-bubble" : "chatbot-assistant-bubble"
                        }`}
                      >
                        {cleanedContent}

                        {/* Display sources for assistant messages */}
                        {message.role === "assistant" && sources.length > 0 && (
                          <div className="chatbot-sources">
                            <p className="chatbot-sources-title">
                              <BookOpen className="h-3 w-3 mr-1" />
                              Sources from Crown Royal microsite:
                            </p>
                            <div className="chatbot-sources-list">
                              {sources.map((source, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => {
                                    const route = getSourceRoute(source)
                                    router.push(route)
                                  }}
                                  className="chatbot-source-button"
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
                <div className="chatbot-loading">
                  <div className="flex items-start space-x-2">
                    <div className="chatbot-message-avatar">
                      <Image
                        src="/images/kongzilla-chat-avatar.png"
                        alt="Assistant"
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                    <div className="chatbot-loading-content">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="chatbot-loading-text">Analyzing microsite content...</span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            <div className="chatbot-input-area">
              <form onSubmit={handleFormSubmit} className="chatbot-form">
                <div className="chatbot-textarea-container">
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
                <button type="submit" disabled={isChatLoading || !input.trim()} className="chatbot-send-button">
                  <Send className="h-4 w-4" />
                </button>
              </form>
              <p className="chatbot-hint">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
