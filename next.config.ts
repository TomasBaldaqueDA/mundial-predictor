import type { NextConfig } from "next"

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
]

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [
      // Legacy Portuguese URLs — keep old links working after the EN rename.
      { source: "/jogos", destination: "/games", permanent: true },
      { source: "/jogos/:path*", destination: "/games/:path*", permanent: true },
      { source: "/perguntas", destination: "/questions", permanent: true },
      { source: "/perguntas/:path*", destination: "/questions/:path*", permanent: true },
      // Legacy standalone predict page lives in /games via inline editor.
      { source: "/predict", destination: "/games", permanent: true },
    ]
  },
}

export default nextConfig
