import { describe, expect, it } from "vitest"
import { MIN_PASSWORD_LENGTH, validatePasswordLength } from "@/lib/auth-password"

describe("validatePasswordLength", () => {
  it("requires at least MIN_PASSWORD_LENGTH characters", () => {
    expect(MIN_PASSWORD_LENGTH).toBe(8)
    expect(validatePasswordLength("short")).toMatch(/8 characters/)
    expect(validatePasswordLength("longenough")).toBeNull()
  })
})
