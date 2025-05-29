import type React from "react"
import type { Metadata } from "next"
import ClientLayout from "./ClientLayout"

export const metadata: Metadata = {
  title: "Crown Royal Strategic Report | Premiumization & Market Analysis",
  description:
    "Comprehensive strategic analysis for Crown Royal's transformation into a compelling alternative for bourbon enthusiasts",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientLayout>{children}</ClientLayout>
}


import './globals.css'