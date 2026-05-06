import Link from "next/link"
import { GuestNotice } from "./components/GuestNotice"

export default function HomePage() {
  return (
    <main className="max-w-3xl mx-auto">
      <GuestNotice />

      {/* ─── Hero ─── */}
      <section className="text-center pt-6 sm:pt-10 pb-10 sm:pb-14">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-white uppercase tracking-[0.22em] mb-6 px-5 py-2.5 rounded-full wc26-chip hero-chip-readable">
          <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-wc-gold to-cyan-300 animate-pulse shrink-0 shadow-[0_0_8px_rgba(240,180,41,0.8)]" />
          USA · Mexico · Canada · 2026
        </div>

        <h1 className="text-5xl sm:text-8xl font-black tracking-tight mb-5 text-gradient-hero leading-[1.02] [font-family:var(--font-outfit),var(--font-geist-sans)] drop-shadow-[0_2px_16px_rgba(0,0,0,0.75)]">
          WC26 Predictor
        </h1>

        <p className="text-base sm:text-lg text-white mb-10 max-w-lg mx-auto leading-relaxed [text-shadow:0_0_1px_rgba(0,0,0,1),0_1px_3px_rgba(0,0,0,0.95),0_2px_16px_rgba(0,0,0,0.85)]">
          A crisp, futuristic score ledger for the biggest tournament on Earth — predict, pick MVP, climb private leagues and the global board.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Link
            href="/games"
            className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
            </svg>
            View Games
          </Link>
          <Link
            href="/leagues"
            className="btn-outline-ice inline-flex items-center justify-center gap-2 px-7 py-3.5 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden>
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
            Leagues
          </Link>
        </div>

        <p className="text-xs font-semibold text-white/90 tracking-[0.35em] uppercase [text-shadow:0_1px_3px_rgba(0,0,0,0.9)]">
          Predict · Compete · Climb
        </p>
      </section>

      {/* ─── Feature cards ─── */}
      <section className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/games"
          className="group glass rounded-2xl p-6 hover:-translate-y-1.5 opacity-0 animate-fade-in-up stagger-1 block cursor-pointer transition-all duration-250"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(240,180,41,0.35)] group-hover:shadow-[0_6px_20px_rgba(240,180,41,0.5)] transition-shadow duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
                <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 mb-1 group-hover:text-wc-gold transition-colors">Predict</div>
              <p className="text-sm text-slate-400 leading-snug">Guess scores and pick the MVP for each match</p>
            </div>
          </div>
        </Link>

        <Link
          href="/groups"
          className="group glass rounded-2xl p-6 hover:-translate-y-1.5 opacity-0 animate-fade-in-up stagger-2 block cursor-pointer transition-all duration-250"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(22,163,74,0.35)] group-hover:shadow-[0_6px_20px_rgba(22,163,74,0.5)] transition-shadow duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
                <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM6 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM1.49 15.326a.78.78 0 0 1-.358-.442 3 3 0 0 1 4.308-3.516 6.484 6.484 0 0 0-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 0 1-2.07-.655ZM16.44 15.98a4.97 4.97 0 0 0 2.07-.654.78.78 0 0 0 .357-.442 3 3 0 0 0-4.308-3.517 6.484 6.484 0 0 1 1.907 3.96 2.32 2.32 0 0 1-.026.654ZM18 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM5.304 16.19a.844.844 0 0 1-.277-.71 5 5 0 0 1 9.947 0 .843.843 0 0 1-.277.71A6.975 6.975 0 0 1 10 18a6.974 6.974 0 0 1-4.696-1.81Z"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 mb-1 group-hover:text-emerald-300 transition-colors">Groups</div>
              <p className="text-sm text-slate-400 leading-snug">Set group standings and pick who qualifies</p>
            </div>
          </div>
        </Link>

        <Link
          href="/questions"
          className="group glass rounded-2xl p-6 hover:-translate-y-1.5 opacity-0 animate-fade-in-up stagger-3 block cursor-pointer transition-all duration-250"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(139,92,246,0.35)] group-hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] transition-shadow duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 mb-1 group-hover:text-violet-300 transition-colors">Questions</div>
              <p className="text-sm text-slate-400 leading-snug">Answer special questions about the tournament</p>
            </div>
          </div>
        </Link>

        <Link
          href="/five-a-side"
          className="group glass rounded-2xl p-6 hover:-translate-y-1.5 opacity-0 animate-fade-in-up stagger-4 block cursor-pointer transition-all duration-250"
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 to-blue-700 flex items-center justify-center shrink-0 shadow-[0_4px_14px_rgba(14,165,233,0.35)] group-hover:shadow-[0_6px_20px_rgba(14,165,233,0.5)] transition-shadow duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white" aria-hidden>
                <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 0 1-1.162-.682 22.045 22.045 0 0 1-2.582-2.063C4.4 12.661 2.5 10.558 2.5 8a5.5 5.5 0 0 1 8.25-4.764.75.75 0 0 0 .5.025A5.5 5.5 0 0 1 17.5 8c0 2.558-1.9 4.661-3.385 6.157a22.046 22.046 0 0 1-2.582 2.063 20.758 20.758 0 0 1-1.162.682l-.019.01-.005.003h-.001a.752.752 0 0 1-.686 0h-.001Z"/>
              </svg>
            </div>
            <div>
              <div className="text-base font-bold text-slate-100 mb-1 group-hover:text-sky-300 transition-colors">5-A-Side</div>
              <p className="text-sm text-slate-400 leading-snug">Pick your fantasy team (1 GK, 1 DF, 2 MID, 1 ST)</p>
            </div>
          </div>
        </Link>
      </section>

      {/* ─── How points work ─── */}
      <section className="mt-10 glass-dark rounded-2xl p-6 border border-cyan-400/15">
        <h2 className="text-sm font-semibold text-wc-gold uppercase tracking-wider mb-4">How points work</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { pts: "3", label: "Exact score" },
            { pts: "1", label: "Correct winner" },
            { pts: "1", label: "Correct MVP" },
            { pts: "+1", label: "Combo bonus" },
          ].map(({ pts, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-black text-wc-gold [font-family:var(--font-outfit)] mb-0.5">{pts}</div>
              <div className="text-xs text-white/85 leading-tight font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

    </main>
  )
}
