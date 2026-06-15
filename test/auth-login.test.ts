import { describe, expect, it } from "vitest"
import { safeRedirectPath } from "@/lib/safe-redirect"

describe("login redirect safety", () => {
  it("allows five-a-side as next path", () => {
    expect(safeRedirectPath("/five-a-side", "/")).toBe("/five-a-side")
  })

  it("blocks external redirects", () => {
    expect(safeRedirectPath("//evil.com", "/")).toBe("/")
  })
})
