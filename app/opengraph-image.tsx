import { ImageResponse } from "next/og"

export const alt = "WC26 Predictor"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #02060f 0%, #0b2840 45%, #1a0f00 100%)",
          color: "#f8fafc",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, color: "#e8b84a", letterSpacing: 6, marginBottom: 16 }}>
          WORLD CUP 2026
        </div>
        <div style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.05 }}>WC26 Predictor</div>
        <div style={{ fontSize: 32, marginTop: 24, color: "rgba(248,250,252,0.85)", maxWidth: 800 }}>
          Predict scores · Pick MVPs · Compete in private leagues
        </div>
      </div>
    ),
    { ...size }
  )
}
