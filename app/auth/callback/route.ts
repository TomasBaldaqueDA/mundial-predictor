import { createClient } from "@/lib/supabase/server"
import {
  googleUserNeedsProfileSetup,
  NEEDS_DISPLAY_NAME_KEY,
} from "@/lib/auth-profile-setup"
import { OAUTH_SIGNUP_FLOW } from "@/lib/auth-oauth"
import { safeRedirectPath } from "@/lib/safe-redirect"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const oauthError = searchParams.get("error")
  const next = safeRedirectPath(searchParams.get("next"), "/")
  const isSignupFlow = searchParams.get("flow") === OAUTH_SIGNUP_FLOW

  if (oauthError) {
    const desc = searchParams.get("error_description") ?? oauthError
    const login = new URL("/login", origin)
    login.searchParams.set("error", oauthError)
    if (desc) login.searchParams.set("error_description", desc)
    if (next !== "/") login.searchParams.set("next", next)
    return NextResponse.redirect(login)
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { data: profile } = user
        ? await supabase.from("profiles").select("id").eq("id", user.id).maybeSingle()
        : { data: null }

      if (
        googleUserNeedsProfileSetup(user, {
          signupFlow: isSignupFlow,
          hasProfile: Boolean(profile),
        })
      ) {
        await supabase.auth.updateUser({
          data: { [NEEDS_DISPLAY_NAME_KEY]: true },
        })
        const profileUrl = new URL("/profile", origin)
        profileUrl.searchParams.set("setup", "1")
        if (next !== "/") profileUrl.searchParams.set("next", next)
        return NextResponse.redirect(profileUrl)
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
    const login = new URL("/login", origin)
    login.searchParams.set("error", "auth")
    login.searchParams.set("error_description", error.message)
    if (next !== "/") login.searchParams.set("next", next)
    return NextResponse.redirect(login)
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
