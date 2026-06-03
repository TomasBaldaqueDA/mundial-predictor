import type { ReactNode } from "react"

/** Shared mark for favicon / PWA icons (OG ImageResponse). */
export function Wc26IconMark({ size }: { size: number }): ReactNode {
  const diameter = Math.round(size * 0.9)
  const wcSize = Math.max(10, Math.round(size * 0.2))
  const numSize = Math.max(9, Math.round(size * 0.18))

  return (
    <div
      style={{
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#02060f",
      }}
    >
      <div
        style={{
          width: diameter,
          height: diameter,
          borderRadius: "50%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f2c94c 0%, #f5d76e 38%, #9fd4e8 72%, #b8e0f0 100%)",
          color: "#000000",
          fontWeight: 900,
          lineHeight: 0.92,
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
          letterSpacing: "-0.02em",
        }}
      >
        <div style={{ fontSize: wcSize, marginTop: Math.round(size * 0.02) }}>WC</div>
        <div style={{ fontSize: numSize }}>26</div>
      </div>
    </div>
  )
}
