"use client"

/** Modern badge-style icon for correct (check) or incorrect (cross) prediction. */
export function ResultIcon({ correct, className = "" }: { correct: boolean; className?: string }) {
  return (
    <span
      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white shadow-sm ${className}`}
      style={{
        background: correct
          ? "linear-gradient(135deg, #059669 0%, #10b981 100%)"
          : "linear-gradient(135deg, #dc2626 0%, #ef4444 100%)",
        boxShadow: correct
          ? "0 2px 10px rgba(5, 150, 105, 0.4), 0 0 16px rgba(5, 150, 105, 0.2)"
          : "0 2px 8px rgba(220, 38, 38, 0.35)",
      }}
      aria-hidden
    >
      {correct ? (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <path d="M4 10.5l3.5 3.5L16 6" />
        </svg>
      ) : (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <path d="M6 6l8 8M14 6l-8 8" />
        </svg>
      )}
    </span>
  )
}
