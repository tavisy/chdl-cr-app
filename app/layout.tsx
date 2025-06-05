import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import ClientRootLayout from "./ClientRootLayout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crown Royal Strategic Report | BigNERD Solutions x Carter Hales Design Lab",
  description: "Charting a Course for Premiumization and Bourbon Enthusiast Engagement",
  keywords: "Crown Royal, strategic report, bourbon, whiskey, premiumization, brand strategy",
  authors: [{ name: "BigNERD Solutions x Carter Hales Design Lab" }],
  openGraph: {
    title: "Crown Royal Strategic Report",
    description: "Charting a Course for Premiumization and Bourbon Enthusiast Engagement",
    type: "website",
  },
  generator: "v0.dev",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRootLayout>{children}</ClientRootLayout>

        {/* Required div for chatbot */}
        <div id="chat_form"></div>

        {/* Chatbot script - loaded directly in layout as recommended */}
        <Script
          src="https://chatapp.bignerdsolutions.com/js/chat_plugin.js"
          data-bot-id="51415"
          strategy="lazyOnload"
        />
      </body>
    </html>
  )
}
