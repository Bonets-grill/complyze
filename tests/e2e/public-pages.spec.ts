import { test, expect } from '@playwright/test'

test.describe('Public pages load without authentication', () => {
  test('landing page loads with Complyze branding', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    expect(bodyText).toContain('Complyze')
    expect(bodyText).toContain('EU AI Act')
  })

  test('/privacy loads', async ({ page }) => {
    await page.goto('/privacy')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    const hasContent = bodyText.includes('Privacy') || bodyText.includes('Privacidad')
    expect(hasContent).toBe(true)
  })

  test('/terms loads', async ({ page }) => {
    await page.goto('/terms')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    const hasContent = bodyText.includes('Terms') || bodyText.includes('Términos')
    expect(hasContent).toBe(true)
  })

  test('/cookies loads', async ({ page }) => {
    await page.goto('/cookies')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    expect(bodyText).toContain('Cookie')
  })

  test('/legal-notice loads', async ({ page }) => {
    await page.goto('/legal-notice')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    const hasContent = bodyText.includes('Legal') || bodyText.includes('Aviso')
    expect(hasContent).toBe(true)
  })

  test('/dpa loads', async ({ page }) => {
    await page.goto('/dpa')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    const hasContent = bodyText.includes('Data Processing') || bodyText.includes('Tratamiento')
    expect(hasContent).toBe(true)
  })

  test('/login shows login form', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    // Verify form elements exist
    const emailInput = page.locator('input[type="email"], input[name="email"]')
    await expect(emailInput).toBeVisible()
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeVisible()
  })

  test('/register shows register form', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    const bodyText = await page.locator('body').innerText()
    expect(bodyText).not.toContain('Application error')
    // Verify form elements exist
    const emailInput = page.locator('input[type="email"], input[name="email"]')
    await expect(emailInput).toBeVisible()
  })
})
