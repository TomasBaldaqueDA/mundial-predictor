import { describe, expect, it } from "vitest"
import {
  googleUserNeedsProfileSetup,
  hasCompletedDisplayNameSetup,
  isGoogleAuthUser,
  isNewAuthUser,
  NEEDS_DISPLAY_NAME_KEY,
  userNeedsDisplayName,
} from "@/lib/auth-profile-setup"

describe("auth-profile-setup", () => {
  it("detects Google auth users", () => {
    expect(isGoogleAuthUser({ identities: [{ provider: "google" }] })).toBe(true)
    expect(isGoogleAuthUser({ user_metadata: { provider: "google" } })).toBe(true)
    expect(isGoogleAuthUser({ identities: [{ provider: "email" }] })).toBe(false)
    expect(isGoogleAuthUser(null)).toBe(false)
  })

  it("detects completed display name from profile row", () => {
    expect(hasCompletedDisplayNameSetup("Player")).toBe(true)
    expect(hasCompletedDisplayNameSetup("  ")).toBe(false)
    expect(hasCompletedDisplayNameSetup("")).toBe(false)
    expect(hasCompletedDisplayNameSetup(null)).toBe(false)
  })

  it("detects pending display name setup", () => {
    expect(
      userNeedsDisplayName({ user_metadata: { [NEEDS_DISPLAY_NAME_KEY]: true } })
    ).toBe(true)
    expect(
      userNeedsDisplayName({ user_metadata: { [NEEDS_DISPLAY_NAME_KEY]: false } })
    ).toBe(false)
    expect(userNeedsDisplayName({ user_metadata: {} })).toBe(false)
  })

  it("detects brand-new auth users", () => {
    const now = new Date().toISOString()
    expect(isNewAuthUser({ created_at: now, last_sign_in_at: now })).toBe(true)
    expect(
      isNewAuthUser({
        created_at: "2020-01-01T00:00:00Z",
        last_sign_in_at: "2024-01-01T00:00:00Z",
      })
    ).toBe(false)
  })

  it("forces profile setup on signup flow or missing profile", () => {
    const google = { identities: [{ provider: "google" }] }
    expect(googleUserNeedsProfileSetup(google, { signupFlow: true })).toBe(true)
    expect(googleUserNeedsProfileSetup(google, { hasProfile: false })).toBe(true)
    expect(
      googleUserNeedsProfileSetup(
        { ...google, user_metadata: { [NEEDS_DISPLAY_NAME_KEY]: false } },
        { hasProfile: true }
      )
    ).toBe(false)
  })
})
