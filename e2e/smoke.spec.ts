import { test, expect } from "@playwright/test"

test.describe("Public pages", () => {
  test("home page loads", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { name: /WC26 Predictor/i })).toBeVisible()
  })

  test("rules page is public", async ({ page }) => {
    await page.goto("/rules")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  })

  test("login page loads", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByRole("heading", { name: /log in/i })).toBeVisible()
  })

  test("register page loads", async ({ page }) => {
    await page.goto("/register")
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible()
  })

  test("manifest is served", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest")
    expect(res.ok()).toBeTruthy()
    const json = (await res.json()) as { name?: string }
    expect(json.name).toContain("WC26")
  })
})

test.describe("Auth middleware", () => {
  test("protected route redirects to login", async ({ page }) => {
    await page.goto("/games")
    await expect(page).toHaveURL(/\/login/)
  })

  test("login preserves next param", async ({ page }) => {
    await page.goto("/login?next=%2Fleagues")
    await expect(page).toHaveURL(/next=%2Fleagues/)
  })
})

test.describe("404", () => {
  test("unknown route shows not found", async ({ page }) => {
    await page.goto("/this-route-does-not-exist-xyz")
    await expect(page.getByRole("heading", { name: /not found/i })).toBeVisible()
    await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible()
  })
})
