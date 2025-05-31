"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
import "./globals.css"

function NavigationContent({ children }: { children: React.ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useAuth()

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

  // Don't show navigation on auth pages
  const isAuthPage = pathname?.startsWith("/auth")

  if (isAuthPage) {
    return <div className="font-sans">{children}</div>
  }

  return (
    <div className="font-sans">
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

              {/* Admin Dashboard Link - only show for admin users */}
              {user &&
                (user.email?.includes("admin") ||
                  user.email?.includes("@bignerd") ||
                  user.email?.includes("@carterhales")) && (
                  <a href="/admin" className="text-slate-600 hover:text-slate-900 transition-colors">
                    Admin Dashboard
                  </a>
                )}

              {/* User Menu */}
              {user && (
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200">
                  <div className="flex items-center gap-2 text-slate-600">
                    <User className="h-4 w-4" />
                    <span className="text-xs">{user.email}</span>
                  </div>
                  <Button onClick={signOut} variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              )}
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

              {/* Mobile Admin Dashboard Link */}
              {user &&
                (user.email?.includes("admin") ||
                  user.email?.includes("@bignerd") ||
                  user.email?.includes("@carterhales")) && (
                  <a
                    href="/admin"
                    className="block text-slate-600 hover:text-slate-900 transition-colors py-2 px-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </a>
                )}

              {/* Mobile User Menu */}
              {user && (
                <div className="pt-3 border-t border-slate-200 mt-3">
                  <div className="flex items-center gap-2 text-slate-600 py-2 px-2 text-sm">
                    <User className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  <Button
                    onClick={signOut}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-slate-600 hover:text-slate-900"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              )}
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
    </div>
  )
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NavigationContent>
        <ProtectedRoute>{children}</ProtectedRoute>
      </NavigationContent>
    </AuthProvider>
  )
}
