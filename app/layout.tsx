import type { Metadata } from "next"
import { Geist, Geist_Mono, Outfit } from "next/font/google"
import Link from "next/link"
import { AppBackground } from "./components/AppBackground"
import { HeaderAuth } from "./components/HeaderAuth"
import { NavLinks } from "./components/NavLinks"
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
  title: "WC26 Predictor",
  description: "Predict the 2026 World Cup. Guess scores, pick the MVP and compete with friends.",
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
        <AppBackground />
        <div className="pointer-events-none fixed inset-0 z-[1] bg-grid-fine opacity-[0.16]" aria-hidden />
        <header className="sticky top-0 z-30 bg-[#030812]/94 backdrop-blur-2xl border-b border-white/12 shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_40px_rgba(0,0,0,0.5)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 relative z-10">
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-wc-gold via-amber-400 to-cyan-400/90 flex flex-col items-center justify-center leading-none gap-0 shadow-[0_2px_16px_rgba(240,180,41,0.45),0_0_20px_rgba(34,211,238,0.15)] group-hover:shadow-[0_4px_24px_rgba(240,180,41,0.55)] transition-shadow duration-300 ring-1 ring-white/20 py-0.5">
                <span className="text-[#1a0f00] font-black text-[8px] tracking-tight [font-family:var(--font-outfit)] leading-none">WC</span>
                <span className="text-[#1a0f00] font-black text-[11px] tracking-tighter [font-family:var(--font-outfit)] leading-none">26</span>
              </div>
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-wc-gold transition-colors duration-200 [font-family:var(--font-outfit),var(--font-geist-sans)] hidden sm:block">
                WC26 Predictor
              </span>
            </Link>
            <div className="flex items-center gap-1 justify-end min-w-0 flex-1">
              <NavLinks />
              <HeaderAuth />
            </div>
          </div>
        </header>
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 sm:pt-8 pb-12 sm:pb-16 animate-fade-in-soft relative z-10">
          {children}
        </div>
      </body>
    </html>
  )
}
