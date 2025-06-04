import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
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
      </body>
    </html>
  )
}
