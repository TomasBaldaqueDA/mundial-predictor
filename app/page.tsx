import Link from "next/link"
import { GuestNotice } from "./components/GuestNotice"
import { TournamentCountdown } from "./components/TournamentCountdown"

export const metadata = {
  title: "WC26 Predictor — Predict the 2026 World Cup",
  description: "Predict scores, pick MVPs, build your fantasy 5-A-Side and compete with friends in private leagues.",
}

const features = [
  { href: "/games", title: "Predict", desc: "Guess scores and pick the MVP for every match" },
  { href: "/groups", title: "Groups", desc: "Set group standings and pick who qualifies" },
  { href: "/questions", title: "Questions", desc: "Answer special tournament questions for bonus points" },
  { href: "/five-a-side", title: "5-A-Side", desc: "Build your fantasy lineup — 1 GK · 1 DF · 2 MF · 1 FW" },
]

const pointsRules = [
  { pts: "3", label: "Exact score" },
  { pts: "1", label: "Correct winner" },
  { pts: "1", label: "Correct MVP" },
  { pts: "+1", label: "Combo bonus" },
  { pts: "+1", label: "Qualifier" },
]

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto">
      <GuestNotice />

      <section className="text-center pt-2 sm:pt-6 pb-8 sm:pb-10">
        <div className="wc26-chip hero-chip-readable mb-6">USA · Mexico · Canada · 2026</div>

        <h1 className="text-[2.75rem] sm:text-[4.5rem] font-black tracking-tight mb-5 text-gradient-hero leading-[0.95]">
          WC26 Predictor
        </h1>

        <p className="text-base sm:text-lg text-white/75 mb-2 max-w-xl mx-auto leading-relaxed">
          Predict every match. Compete in private leagues.
        </p>

        <TournamentCountdown />

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/games" className="btn-primary px-8 py-3.5 text-sm">
            Start predicting
          </Link>
          <Link href="/leagues" className="btn-outline-ice px-7 py-3.5 text-sm">
            Join a league
          </Link>
        </div>
      </section>

      <section className="grid sm:grid-cols-2 gap-2 sm:gap-3">
        {features.map(({ href, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="feature-card group glass px-5 py-4 sm:px-6 sm:py-5 border border-white/[0.06] hover:border-white/[0.12]"
          >
            <div className="text-base font-semibold text-slate-100 group-hover:text-wc-gold transition-colors">
              {title}
            </div>
            <p className="text-sm text-slate-400/90 leading-snug mt-1">{desc}</p>
          </Link>
        ))}
      </section>

      <section className="mt-6 glass-dark p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="section-kicker text-wc-gold">How points work</h2>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link href="/ranking" className="text-white/40 hover:text-wc-gold transition-colors">
              Global ranking →
            </Link>
            <Link href="/rules" className="text-white/40 hover:text-wc-gold transition-colors">
              Full rules →
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3">
          {pointsRules.map(({ pts, label }) => (
            <div key={label} className="stat-tile">
              <div className="stat-tile-value">{pts}</div>
              <div className="stat-tile-label">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
