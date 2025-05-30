"use client"
import type React from "react"
import { useState, useEffect } from "react"
import "./globals.css"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setMobileMenuOpen(false)
    }

    if (mobileMenuOpen) {
      document.addEventListener("click", handleClickOutside)
    }

    return () => {
      document.removeEventListener("click", handleClickOutside)
    }
  }, [mobileMenuOpen])

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="font-sans">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
          <div className="container mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/chdlscriptlogoxBigNERD-horizontal-blacktext.png"
                  alt="Carter Hales x BIGNERD"
                  className="h-6 md:h-8 w-auto"
                />
              </div>

              {/* Mobile menu button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setMobileMenuOpen(!mobileMenuOpen)
                }}
                className="md:hidden flex flex-col justify-center items-center w-8 h-8 p-1 relative z-50"
                aria-label="Toggle menu"
              >
                <span
                  className={`w-5 h-0.5 bg-slate-900 transition-all duration-300 absolute ${
                    mobileMenuOpen ? "rotate-45" : "-translate-y-1.5"
                  }`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-slate-900 transition-all duration-300 ${mobileMenuOpen ? "opacity-0" : ""}`}
                ></span>
                <span
                  className={`w-5 h-0.5 bg-slate-900 transition-all duration-300 absolute ${
                    mobileMenuOpen ? "-rotate-45" : "translate-y-1.5"
                  }`}
                ></span>
              </button>

              {/* Desktop navigation */}
              <div className="hidden md:flex items-center gap-6 text-sm">
                <a href="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Overview
                </a>
                <a href="/market-disruption" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Market Disruption
                </a>
                <a href="/competitive-analysis" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Competitive Analysis
                </a>
                <a href="/consumer-insights" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Consumer Insights
                </a>
                <a href="/recommendations" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Recommendations
                </a>
              </div>
            </div>

            {/* Mobile navigation menu */}
            <div
              className={`md:hidden transition-all duration-300 ease-in-out ${
                mobileMenuOpen ? "max-h-96 opacity-100 visible" : "max-h-0 opacity-0 invisible"
              } overflow-hidden`}
            >
              <div className="py-4 space-y-3 border-t border-slate-200 mt-3 bg-white">
                <a
                  href="/"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2 px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Overview
                </a>
                <a
                  href="/market-disruption"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2 px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Market Disruption
                </a>
                <a
                  href="/competitive-analysis"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2 px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Competitive Analysis
                </a>
                <a
                  href="/consumer-insights"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2 px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Consumer Insights
                </a>
                <a
                  href="/recommendations"
                  className="block text-slate-600 hover:text-slate-900 transition-colors py-2 px-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Recommendations
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
        <footer className="bg-slate-900 text-white py-12">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Crown Royal Strategic Report</h3>
              <p className="text-slate-300 mb-6">
                Charting a Course for Premiumization and Bourbon Enthusiast Engagement
              </p>
              <div className="text-sm text-slate-400">© 2025 BigNERD Solutions x Carter Hales Design Lab</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
