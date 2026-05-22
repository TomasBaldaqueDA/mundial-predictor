import { describe, expect, it } from "vitest"
import { safeRedirectPath } from "@/lib/safe-redirect"

describe("safeRedirectPath", () => {
  it("allows relative paths", () => {
    expect(safeRedirectPath("/games")).toBe("/games")
    expect(safeRedirectPath("/app/games?filter=today")).toBe("/app/games?filter=today")
  })

  it("blocks open redirects", () => {
    expect(safeRedirectPath("//evil.com")).toBe("/")
    expect(safeRedirectPath("https://evil.com")).toBe("/")
    expect(safeRedirectPath(null, "/games")).toBe("/games")
  })
})
