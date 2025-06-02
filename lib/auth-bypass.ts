/**
 * Authentication bypass utility for web crawlers and temporary access
 */

/**
 * Check if authentication should be bypassed
 * This can be controlled via environment variable for temporary crawler access
 */
export function shouldBypassAuth(): boolean {
  // Check environment variable
  const bypassAuth = process.env.NEXT_PUBLIC_BYPASS_AUTH === "true"

  if (bypassAuth) {
    console.log("🚨 Authentication bypass is ENABLED - site is publicly accessible")
  }

  return bypassAuth
}

/**
 * Check if current request is from a known web crawler
 * This provides an additional layer of control
 */
export function isWebCrawler(userAgent?: string): boolean {
  if (!userAgent) {
    if (typeof window !== "undefined") {
      userAgent = window.navigator.userAgent
    } else {
      return false
    }
  }

  const crawlerPatterns = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegrambot/i,
    /crawler/i,
    /spider/i,
    /bot/i,
    /scraper/i,
  ]

  return crawlerPatterns.some((pattern) => pattern.test(userAgent))
}

/**
 * Check if authentication should be bypassed for current request
 * Combines environment variable and crawler detection
 */
export function shouldAllowPublicAccess(userAgent?: string): boolean {
  const envBypass = shouldBypassAuth()
  const isCrawler = isWebCrawler(userAgent)

  // Allow access if either condition is met
  const allowAccess = envBypass || isCrawler

  if (allowAccess && !envBypass) {
    console.log("🤖 Web crawler detected, allowing public access")
  }

  return allowAccess
}
