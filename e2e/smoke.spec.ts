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
})

test.describe("Auth middleware", () => {
  test("protected route redirects to login", async ({ page }) => {
    await page.goto("/games")
    await expect(page).toHaveURL(/\/login/)
  })
})
