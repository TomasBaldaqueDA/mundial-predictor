import { describe, expect, it } from "vitest"
import { getAuthCallbackUrl, getAppOrigin, OAUTH_SIGNUP_FLOW } from "@/lib/auth-oauth"

describe("auth-oauth", () => {
  it("builds callback URL with safe next path", () => {
    const url = getAuthCallbackUrl("/games", "https://mundial-predictor.vercel.app")
    expect(url).toBe("https://mundial-predictor.vercel.app/auth/callback?next=%2Fgames")
  })

  it("adds signup flow to callback URL", () => {
    const url = getAuthCallbackUrl(undefined, "https://mundial-predictor.vercel.app", {
      flow: OAUTH_SIGNUP_FLOW,
    })
    expect(url).toBe(
      "https://mundial-predictor.vercel.app/auth/callback?flow=signup"
    )
  })

  it("blocks open redirects in next", () => {
    const url = getAuthCallbackUrl("//evil.com", "https://mundial-predictor.vercel.app")
    expect(url).toBe("https://mundial-predictor.vercel.app/auth/callback")
  })

  it("uses env site URL when set", () => {
    const prev = process.env.NEXT_PUBLIC_SITE_URL
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com"
    expect(getAppOrigin()).toBe("https://example.com")
    process.env.NEXT_PUBLIC_SITE_URL = prev
  })
})
