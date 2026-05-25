import { describe, expect, it, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { isCronAuthorized, isCronGetAllowed } from "@/lib/cron-auth"

function makeRequest(url: string, headers?: Record<string, string>) {
  return new NextRequest(new URL(url, "http://localhost:3000"), { headers })
}

describe("isCronAuthorized", () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv, CRON_SECRET: "test-secret" }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it("accepts Bearer token", () => {
    const req = makeRequest("/api/cron/live-scores", {
      authorization: "Bearer test-secret",
    })
    expect(isCronAuthorized(req)).toBe(true)
  })

  it("rejects missing auth", () => {
    expect(isCronAuthorized(makeRequest("/api/cron/live-scores"))).toBe(false)
  })

  it("allows query secret outside production", () => {
    vi.stubEnv("NODE_ENV", "development")
    const req = makeRequest("/api/cron/live-scores?secret=test-secret")
    expect(isCronAuthorized(req)).toBe(true)
    vi.unstubAllEnvs()
  })

  it("rejects query secret in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    const req = makeRequest("/api/cron/live-scores?secret=test-secret")
    expect(isCronAuthorized(req)).toBe(false)
    vi.unstubAllEnvs()
  })
})

describe("isCronGetAllowed", () => {
  it("disallows GET in production", () => {
    vi.stubEnv("NODE_ENV", "production")
    expect(isCronGetAllowed()).toBe(false)
    vi.unstubAllEnvs()
  })

  it("allows GET in development", () => {
    vi.stubEnv("NODE_ENV", "development")
    expect(isCronGetAllowed()).toBe(true)
    vi.unstubAllEnvs()
  })
})
