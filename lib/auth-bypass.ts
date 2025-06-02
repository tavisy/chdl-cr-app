/**
 * Utility functions for handling authentication bypass
 * Used to temporarily disable authentication for web crawlers
 */

// List of common web crawler user agents
const CRAWLER_USER_AGENTS = [
  "googlebot",
  "bingbot",
  "slurp", // Yahoo
  "duckduckbot",
  "baiduspider",
  "yandexbot",
  "facebookexternalhit",
  "twitterbot",
  "linkedinbot",
  "whatsapp",
  "telegrambot",
  "applebot",
  "crawler",
  "spider",
  "bot",
  "scraper",
]

/**
 * Check if authentication should be bypassed based on environment variable and user agent
 */
export function shouldAllowPublicAccess(userAgent?: string): boolean {
  // Check environment variable first
  const bypassEnv = process.env.NEXT_PUBLIC_BYPASS_AUTH

  if (bypassEnv === "true" || bypassEnv === "1") {
    console.log("🚨 Auth bypass: Environment variable NEXT_PUBLIC_BYPASS_AUTH is enabled")
    return true
  }

  // Check for web crawlers even if env var is not set
  if (userAgent) {
    const ua = userAgent.toLowerCase()
    const isCrawler = CRAWLER_USER_AGENTS.some((crawler) => ua.includes(crawler))

    if (isCrawler) {
      console.log("🤖 Auth bypass: Detected web crawler:", userAgent)
      return true
    }
  }

  return false
}

/**
 * Get the current bypass status for display purposes
 */
export function getBypassStatus(): {
  isActive: boolean
  reason: string
  envValue: string | undefined
} {
  const envValue = process.env.NEXT_PUBLIC_BYPASS_AUTH
  const isActive = envValue === "true" || envValue === "1"

  return {
    isActive,
    reason: isActive ? "Environment variable enabled" : "Environment variable disabled or not set",
    envValue,
  }
}
