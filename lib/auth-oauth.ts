import { safeRedirectPath } from "@/lib/safe-redirect"
import type { SupabaseClient } from "@supabase/supabase-js"

export const OAUTH_SIGNUP_FLOW = "signup"

/** Base URL for OAuth redirects (production Site URL when set). */
export function getAppOrigin(fallbackOrigin?: string): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "")
  if (fromEnv) return fromEnv
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "")
  if (typeof window !== "undefined") return window.location.origin
  return "https://www.wcup26predictor.com"
}

type AuthCallbackOptions = {
  flow?: typeof OAUTH_SIGNUP_FLOW
}

/** Callback URL after Google OAuth — must be allowlisted in Supabase Auth → URL Configuration. */
export function getAuthCallbackUrl(
  next?: string,
  origin?: string,
  options?: AuthCallbackOptions
): string {
  const base = getAppOrigin(origin)
  const url = new URL("/auth/callback", base)
  const safeNext = safeRedirectPath(next, "/")
  if (safeNext && safeNext !== "/") {
    url.searchParams.set("next", safeNext)
  }
  if (options?.flow) {
    url.searchParams.set("flow", options.flow)
  }
  return url.toString()
}

/** Clear any existing session so OAuth does not silently reuse a stale account. */
export async function signOutBeforeOAuth(supabase: SupabaseClient): Promise<void> {
  await supabase.auth.signOut({ scope: "global" })
}