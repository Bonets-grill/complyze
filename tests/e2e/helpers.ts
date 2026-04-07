import { Page, expect } from '@playwright/test'

export const DEMO_EMAIL = 'admin@complyze.eu'
export const DEMO_PASSWORD = 'Complyze2026!'

export async function login(page: Page) {
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  // Click demo button to fill credentials
  await page.click('button:has-text("Demo")')
  // Submit form
  await page.click('button[type="submit"]')
  // Wait for redirect to dashboard
  await page.waitForURL('**/dashboard', { timeout: 15000 })
}

export async function navigateAndVerify(page: Page, path: string, expectedText?: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
  // Verify no 404/500 by checking for error indicators
  const bodyText = await page.locator('body').innerText()
  expect(bodyText).not.toContain('404')
  expect(bodyText).not.toContain('Application error')
  if (expectedText) {
    expect(bodyText).toContain(expectedText)
  }
}
