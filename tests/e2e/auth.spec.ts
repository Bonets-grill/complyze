import { test, expect } from '@playwright/test'
import { login, DEMO_EMAIL, DEMO_PASSWORD } from './helpers'

test.describe('Authentication flow', () => {
  test('login page loads correctly', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('404')
    expect(bodyText).not.toContain('Application error')
  })

  test('demo button fills credentials', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await page.click('button:has-text("Demo")')
    // Verify email field was populated
    const emailInput = page.locator('input[type="email"], input[name="email"]')
    await expect(emailInput).toHaveValue(DEMO_EMAIL)
  })

  test('login succeeds and redirects to dashboard', async ({ page }) => {
    await login(page)
    expect(page.url()).toContain('/dashboard')
  })

  test('dashboard shows user name "Admin Complyze"', async ({ page }) => {
    await login(page)
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).toContain('Admin Complyze')
  })

  test('logout works and redirects to login', async ({ page }) => {
    await login(page)
    await page.waitForLoadState('networkidle')
    // Look for a logout button or user menu that reveals it
    const userMenu = page.locator('button:has-text("Admin"), [data-testid="user-menu"], button:has-text("Cerrar"), button:has-text("Logout"), button:has-text("Sign out")')
    if (await userMenu.first().isVisible()) {
      await userMenu.first().click()
      await page.waitForTimeout(500)
    }
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Cerrar sesión"), button:has-text("Sign out"), a:has-text("Logout"), a:has-text("Cerrar sesión")')
    await logoutButton.first().click()
    await page.waitForURL('**/login', { timeout: 15000 })
    expect(page.url()).toContain('/login')
  })

  test('protected pages redirect to login when not authenticated', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 15000 })
    expect(page.url()).toContain('/login')
  })
})
