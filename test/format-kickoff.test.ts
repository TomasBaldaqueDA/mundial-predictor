import { describe, expect, it } from "vitest"
import { formatKickoffInBrowserTimezone, getKickoffTimestamp, parseKickoffInstant } from "@/lib/format-kickoff"

describe("parseKickoffInstant", () => {
  it("parses ISO with Z", () => {
    const d = parseKickoffInstant("2026-06-11T20:00:00.000Z")
    expect(d?.toISOString()).toBe("2026-06-11T20:00:00.000Z")
  })

  it("parses naive timestamps as UTC", () => {
    const d = parseKickoffInstant("2026-06-11 20:00:00")
    expect(d?.toISOString()).toBe("2026-06-11T20:00:00.000Z")
  })

  it("returns null for invalid input", () => {
    expect(parseKickoffInstant("not-a-date")).toBeNull()
  })
})

describe("getKickoffTimestamp", () => {
  it("matches parseKickoffInstant", () => {
    const iso = "2026-06-11T20:00:00.000Z"
    expect(getKickoffTimestamp(iso)).toBe(parseKickoffInstant(iso)!.getTime())
  })
})

describe("formatKickoffInBrowserTimezone", () => {
  it("formats using the runtime timezone", () => {
    const formatted = formatKickoffInBrowserTimezone("2026-06-11T20:00:00.000Z")
    const expected = new Date("2026-06-11T20:00:00.000Z").toLocaleString(undefined, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    expect(formatted).toBe(expected)
  })
})
