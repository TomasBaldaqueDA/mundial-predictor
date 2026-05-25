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
    desc: "Guess scores and pick the MVP for each match",
    gradient: "from-amber-400 to-amber-600",
    shadow: "shadow-[0_4px_14px_rgba(240,180,41,0.35)] group-hover:shadow-[0_6px_20px_rgba(240,180,41,0.5)]",
    titleColor: "group-hover:text-wc-gold",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 .664 10.59ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd"/>
      </svg>
    ),
    stagger: "stagger-1",
  },
  {
    href: "/groups",
    title: "Groups",
    desc: "Set group standings and pick who qualifies",
    gradient: "from-emerald-500 to-green-700",
    shadow: "shadow-[0_4px_14px_rgba(22,163,74,0.35)] group-hover:shadow-[0_6px_20px_rgba(22,163,74,0.5)]",
    titleColor: "group-hover:text-emerald-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path fillRule="evenodd" d="M.99 5.24A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25l.01 9.5A2.25 2.25 0 0 1 16.76 17H3.26A2.267 2.267 0 0 1 1 14.74l-.01-9.5Zm8.26 9.52v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v.615c0 .414.336.75.75.75h5.373a.75.75 0 0 0 .627-.74Zm1.5 0a.75.75 0 0 0 .627.74h5.373a.75.75 0 0 0 .75-.75v-.615a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75v.625Zm6.75-3.63v-.625a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75v.625c0 .414.336.75.75.75h5.25a.75.75 0 0 0 .75-.75Zm-8.25 0v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75v.625c0 .414.336.75.75.75H8.5a.75.75 0 0 0 .75-.75ZM17.5 7.5v-.625a.75.75 0 0 0-.75-.75H11.5a.75.75 0 0 0-.75.75V7.5c0 .414.336.75.75.75h5.25a.75.75 0 0 0 .75-.75Zm-8.25 0v-.625a.75.75 0 0 0-.75-.75H3.25a.75.75 0 0 0-.75.75V7.5c0 .414.336.75.75.75H8.5a.75.75 0 0 0 .75-.75Z" clipRule="evenodd"/>
      </svg>
    ),
    stagger: "stagger-2",
  },
  {
    href: "/questions",
    title: "Questions",
    desc: "Answer special questions about the tournament",
    gradient: "from-violet-500 to-purple-700",
    shadow: "shadow-[0_4px_14px_rgba(139,92,246,0.35)] group-hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)]",
    titleColor: "group-hover:text-violet-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
      </svg>
    ),
    stagger: "stagger-3",
  },
  {
    href: "/five-a-side",
    title: "5-A-Side",
    desc: "Pick your fantasy team (1 GK · 1 DF · 2 MF · 1 FW)",
    gradient: "from-sky-500 to-blue-700",
    shadow: "shadow-[0_4px_14px_rgba(14,165,233,0.35)] group-hover:shadow-[0_6px_20px_rgba(14,165,233,0.5)]",
    titleColor: "group-hover:text-sky-300",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
        <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z"/>
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
  { pts: "+1", label: "Correct qualifier (knockout)" },
]

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <GuestNotice />

      {/* ─── Hero ─── */}
      <section className="text-center pt-4 sm:pt-10 pb-8 sm:pb-12">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-[0.22em] mb-5 px-5 py-2.5 rounded-full wc26-chip hero-chip-readable">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-wc-gold to-cyan-300 animate-pulse shrink-0 shadow-[0_0_8px_rgba(240,180,41,0.8)]" />
          USA · Mexico · Canada · 2026
        </div>

        <h1 className="text-4xl sm:text-7xl font-black tracking-tight mb-4 text-gradient-hero leading-[1.02] [font-family:var(--font-outfit),var(--font-geist-sans)] drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)]">
          WC26 Predictor
        </h1>

        <p className="text-sm sm:text-lg text-white/80 mb-6 max-w-lg mx-auto leading-relaxed [text-shadow:0_1px_3px_rgba(0,0,0,0.95)]">
          Predict scores · Pick MVPs · Build your fantasy team · Climb private leagues
        </p>

        {/* Countdown */}
        <TournamentCountdown />

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <Link
            href="/games"
            className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 .664 10.59ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
            </svg>
            Start predicting
          </Link>
          <Link
            href="/leagues"
            className="btn-outline-ice inline-flex items-center justify-center gap-2 px-5 py-3.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path fillRule="evenodd" d="M10 1c-1.716 0-3.408.106-5.07.31C3.806 1.45 3 2.414 3 3.517V16.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5V5h12v11.5a.5.5 0 0 0 .5.5h.5a.5.5 0 0 0 .5-.5V3.517c0-1.103-.806-2.068-1.93-2.207A41.403 41.403 0 0 0 10 1ZM8.5 6.5a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1h-3Z" clipRule="evenodd" />
            </svg>
            Leagues
          </Link>
        </div>

        <p className="mt-6 text-xs font-semibold text-white/60 tracking-[0.35em] uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
          Predict · Compete · Climb
        </p>
      </section>

      {/* ─── Feature cards ─── */}
      <section className="grid sm:grid-cols-2 gap-3 sm:gap-4">
        {features.map(({ href, title, desc, gradient, shadow, titleColor, icon, stagger }) => (
          <Link
            key={href}
            href={href}
            className={`group glass rounded-2xl p-5 sm:p-6 hover:-translate-y-1.5 opacity-0 animate-fade-in-up ${stagger} block cursor-pointer transition-all duration-250`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 ${shadow} transition-shadow duration-200`}>
                {icon}
              </div>
              <div className="min-w-0">
                <div className={`text-base font-bold text-slate-100 mb-1 ${titleColor} transition-colors`}>{title}</div>
                <p className="text-sm text-slate-400 leading-snug">{desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* ─── How points work ─── */}
      <section className="mt-6 glass-dark rounded-2xl p-5 sm:p-6 border border-cyan-400/15">
        <h2 className="text-xs font-semibold text-wc-gold uppercase tracking-wider mb-4">How points work</h2>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {pointsRules.map(({ pts, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-wc-gold [font-family:var(--font-outfit)] mb-0.5">{pts}</div>
              <div className="text-[11px] text-white/70 leading-tight font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Ranking teaser ─── */}
      <section className="mt-4">
        <Link
          href="/ranking"
          className="group flex items-center justify-between glass rounded-2xl px-5 py-4 hover:-translate-y-0.5 transition-all duration-200 border border-wc-gold/15 hover:border-wc-gold/30"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-wc-gold/30 to-amber-600/20 flex items-center justify-center text-lg">
              🏆
            </div>
            <div>
              <div className="text-sm font-bold text-white group-hover:text-wc-gold transition-colors">Global Ranking</div>
              <div className="text-xs text-white/40">See the leaderboard</div>
            </div>
          </div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-white/30 group-hover:text-wc-gold/70 group-hover:translate-x-0.5 transition-all duration-200" aria-hidden>
            <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z" clipRule="evenodd" />
          </svg>
        </Link>
      </section>
    </main>
  )
}
