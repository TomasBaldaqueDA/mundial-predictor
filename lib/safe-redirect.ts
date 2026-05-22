/** Allow only same-origin relative paths (blocks open redirects). */
export function safeRedirectPath(next: string | null | undefined, fallback = "/"): string {
  if (!next || typeof next !== "string") return fallback
  const trimmed = next.trim()
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return fallback
  if (trimmed.includes("\\") || trimmed.includes("\0")) return fallback
  try {
    const u = new URL(trimmed, "http://local")
    if (u.origin !== "http://local") return fallback
    return u.pathname + u.search + u.hash
  } catch {
    return fallback
  }
}
