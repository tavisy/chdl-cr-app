"use client"
import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import ClientLayout from "./ClientLayout"
import ClarityProvider from "@/components/ClarityProvider"

const inter = Inter({ subsets: ["latin"] })

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClarityProvider projectId={process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID} />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
