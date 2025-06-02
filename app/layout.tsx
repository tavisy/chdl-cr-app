import type React from "react"
import type { Metadata } from "next"
import ClientRootLayout from "./ClientRootLayout"

export const metadata: Metadata = {
  title: "Crown Royal Strategic Report",
  description: "Comprehensive strategic analysis for Crown Royal",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ClientRootLayout>{children}</ClientRootLayout>
}


import './globals.css'