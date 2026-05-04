import Link from "next/link"

export default function NotFound() {
  return (
    <main className="max-w-xl mx-auto text-center pt-12 sm:pt-16 space-y-6">
      <p className="text-xs font-semibold text-wc-gold uppercase tracking-[0.22em]">404</p>
      <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gradient-hero [font-family:var(--font-outfit)]">
        Page not found
      </h1>
      <p className="text-slate-300/90">
        This route doesn&apos;t exist. Try the games board or head back home.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/" className="btn-primary inline-flex items-center justify-center px-6 py-3 text-sm">
          Back to home
        </Link>
        <Link
          href="/jogos"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-white/15 text-slate-200 hover:bg-white/8 text-sm font-medium transition-all"
        >
          View games
        </Link>
      </div>
    </main>
  )
}
