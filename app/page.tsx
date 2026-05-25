import Link from "next/link"
import { GuestNotice } from "./components/GuestNotice"
import { TournamentCountdown } from "./components/TournamentCountdown"

export const metadata = {
  title: "WC26 Predictor — Predict the 2026 World Cup",
  description: "Predict scores, pick MVPs, build your fantasy 5-A-Side and compete with friends in private leagues.",
}

const features = [
  {
    href: "/games",
    title: "Predict",
    desc: "Guess scores and pick the MVP for every match",
    gradient: "from-amber-300 via-amber-500 to-orange-600",
    accent: "group-hover:text-amber-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 .664 10.59ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
      </svg>
    ),
    stagger: "stagger-1",
  },
  {
    href: "/groups",
    title: "Groups",
    desc: "Set group standings and pick who qualifies",
    gradient: "from-emerald-400 to-green-700",
    accent: "group-hover:text-emerald-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.267 2.267 0 0 1 1 14.74l-.01-9.5Zm8.26 9.52v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 0 0 .627-.74Zm1.5 0a.75.75 0 0 0 .627.74h5.373a.75.75 0 0 0 .75-.75v-.615a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75v.625Zm6.75-3.63v-.625a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75v.625c0 .414.336.75.75.75h5.25a.75.75 0 0 0 .75-.75Zm-8.25 0v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v.625c0 .414.336.75.75.75H8.5a.75.75 0 0 0 .75-.75ZM17.5 7.5v-.625a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75V7.5c0 .414.336.75.75.75h5.25a.75.75 0 0 0 .75-.75Zm-8.25 0v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75V7.5c0 .414.336.75.75.75H8.5a.75.75 0 0 0 .75-.75Z" clipRule="evenodd" />
      </svg>
    ),
    stagger: "stagger-2",
  },
  {
    href: "/questions",
    title: "Questions",
    desc: "Answer special tournament questions for bonus points",
    gradient: "from-violet-400 to-purple-700",
    accent: "group-hover:text-violet-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
      </svg>
    ),
    stagger: "stagger-3",
  },
  {
    href: "/five-a-side",
    title: "5-A-Side",
    desc: "Build your fantasy lineup — 1 GK · 1 DF · 2 MF · 1 FW",
    gradient: "from-sky-400 to-blue-700",
    accent: "group-hover:text-sky-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z" />
      </svg>
    ),
    stagger: "stagger-4",
  },
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

      <section className="relative text-center pt-2 sm:pt-6 pb-10 sm:pb-14">
        <div
          className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[min(100%,28rem)] h-56 opacity-60"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 30%, rgba(232,184,74,0.2) 0%, rgba(56,189,248,0.08) 50%, transparent 75%)",
          }}
          aria-hidden
        />

        <div className="wc26-chip hero-chip-readable mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-wc-gold to-sky-300 animate-pulse shadow-[0_0_10px_rgba(232,184,74,0.9)]" />
          USA · Mexico · Canada · 2026
        </div>

        <h1 className="text-[2.75rem] sm:text-[4.5rem] font-black tracking-tight mb-5 text-gradient-hero leading-[0.95] drop-shadow-[0_4px_32px_rgba(0,0,0,0.6)]">
          WC26 Predictor
        </h1>

        <p className="text-base sm:text-lg text-white/75 mb-2 max-w-xl mx-auto leading-relaxed [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
          Predict scores · Pick MVPs · Build your fantasy team · Climb private leagues
        </p>

        <TournamentCountdown />

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <Link href="/games" className="btn-primary px-8 py-3.5 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 .664 10.59ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
            </svg>
            Start predicting
          </Link>
          <Link href="/leagues" className="btn-outline-ice px-7 py-3.5 text-sm">
            Join a league
          </Link>
        </div>

        <p className="mt-8 text-[10px] font-bold text-white/40 tracking-[0.35em] uppercase">Predict · Compete · Win</p>
      </section>

      <section className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {features.map(({ href, title, desc, gradient, accent, icon, stagger }) => (
          <Link
            key={href}
            href={href}
            className={`feature-card group glass p-5 sm:p-6 opacity-0 animate-fade-in-up ${stagger}`}
          >
            <div className="flex items-start gap-4">
              <div className={`feature-icon bg-gradient-to-br ${gradient}`}>{icon}</div>
              <div className="min-w-0 pt-0.5">
                <div className={`text-base font-bold text-slate-100 mb-1.5 ${accent} transition-colors`}>{title}</div>
                <p className="text-sm text-slate-400/90 leading-snug">{desc}</p>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4 text-white/20 group-hover:text-wc-gold/60 group-hover:translate-x-0.5 transition-all shrink-0 mt-1"
                aria-hidden
              >
                <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
              </svg>
            </div>
          </Link>
        ))}
      </section>

      <section className="mt-6 glass-dark p-5 sm:p-7">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[11px] font-bold text-wc-gold uppercase tracking-[0.2em]">How points work</h2>
          <Link href="/rules" className="text-xs font-semibold text-white/40 hover:text-wc-gold transition-colors">
            Full rules →
          </Link>
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

      <section className="mt-4">
        <Link href="/ranking" className="feature-card group glass flex items-center justify-between px-5 py-4 sm:py-5 border border-wc-gold/10 hover:border-wc-gold/25">
          <div className="flex items-center gap-4">
            <div className="feature-icon bg-gradient-to-br from-wc-gold/40 to-amber-700/60 text-xl">🏆</div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-wc-gold transition-colors">Global Ranking</div>
              <div className="text-xs text-white/40 mt-0.5">See where you stand against everyone</div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white/25 group-hover:text-wc-gold/70 group-hover:translate-x-1 transition-all" aria-hidden>
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
          </svg>
        </Link>
      </section>
    </main>
  )
}
