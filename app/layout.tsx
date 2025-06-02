import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import ClientLayout from "./ClientLayout"
import { ClarityProvider } from "@/components/ClarityProvider"
import FathomAnalytics from "@/components/FathomAnalytics"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Crown Royal Strategic Report",
  description: "Charting a Course for Premiumization and Bourbon Enthusiast Engagement",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ClarityProvider />
          <Suspense fallback={null}>
            <FathomAnalytics />
          </Suspense>
          <ClientLayout>{children}</ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
