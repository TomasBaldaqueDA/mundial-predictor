import type { Metadata } from "next"
import { Geist, Geist_Mono, Outfit } from "next/font/google"
import { AppViewShell } from "./components/AppViewShell"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://mundial-predictor.vercel.app"),
  title: {
    default: "WC26 Predictor",
    template: "%s · WC26 Predictor",
  },
  description: "Predict the 2026 World Cup. Guess scores, pick the MVP and compete with friends.",
  applicationName: "WC26 Predictor",
  openGraph: {
    title: "WC26 Predictor",
    description: "Predict the 2026 World Cup. Guess scores, pick the MVP and compete with friends.",
    type: "website",
    siteName: "WC26 Predictor",
  },
  twitter: {
    card: "summary",
    title: "WC26 Predictor",
    description: "Predict the 2026 World Cup. Guess scores, pick the MVP and compete with friends.",
  },
  icons: { icon: "/favicon.ico" },
}

export const viewport = {
  themeColor: "#02060f",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased min-h-screen flex flex-col bg-pitch-pattern bg-mesh-animated font-sans relative`}
      >
        <AppViewShell>{children}</AppViewShell>
      </body>
    </html>
  )
}
