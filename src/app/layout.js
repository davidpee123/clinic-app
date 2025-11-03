import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/react"
import { Suspense } from "react"
import "./globals.css"

export const metadata = {
  title: "MediCare Clinic - Excellence in Healthcare",
  description:
    "Professional healthcare services with experienced doctors, modern facilities, and comprehensive medical care. Book your appointment today.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
