import type { ReactNode } from "react"

/** Shared mark for favicon / PWA icons (OG ImageResponse). Transparent outside the badge. */
export function Wc26IconMark({ size }: { size: number }): ReactNode {
  const diameter = Math.round(size * 0.92)
  const wcSize = Math.max(10, Math.round(size * 0.2))
  const numSize = Math.max(9, Math.round(size * 0.19))
  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      <div
        style={{
          width: diameter,
          height: diameter,
          borderRadius: radius,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fcd34d 0%, #e8b84a 42%, #38bdf8 100%)",
          color: "#1a0f00",
          fontWeight: 900,
          lineHeight: 0.92,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          letterSpacing: "-0.03em",
          boxShadow: "0 2px 12px rgba(232,184,74,0.35)",
        }}
      >
        <div style={{ fontSize: wcSize, marginTop: Math.round(size * 0.02) }}>WC</div>
        <div style={{ fontSize: numSize }}>26</div>
      </div>
    </div>
  )
}
