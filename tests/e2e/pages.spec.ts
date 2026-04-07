import { test, expect } from '@playwright/test'
import { login, navigateAndVerify } from './helpers'

test.describe('Authenticated pages load correctly', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('/dashboard loads', async ({ page }) => {
    await navigateAndVerify(page, '/dashboard')
    const bodyText = await page.locator('body').innerText()
    const hasDashboard = bodyText.includes('Dashboard') || bodyText.includes('Panel')
    expect(hasDashboard).toBe(true)
  })

  test('/systems loads', async ({ page }) => {
    await navigateAndVerify(page, '/systems')
    const bodyText = await page.locator('body').innerText()
    const hasContent = bodyText.includes('AI Systems') || bodyText.includes('Sistemas AI') || bodyText.includes('Systems') || bodyText.includes('Sistemas')
    expect(hasContent).toBe(true)
  })

  test('/assessments loads', async ({ page }) => {
    await navigateAndVerify(page, '/assessments')
    const bodyText = await page.locator('body').innerText()
    const hasContent = bodyText.includes('Assessments') || bodyText.includes('Evaluaciones')
    expect(hasContent).toBe(true)
  })

  test('/documents loads', async ({ page }) => {
    await navigateAndVerify(page, '/documents')
    const bodyText = await page.locator('body').innerText()
    const hasContent = bodyText.includes('Documents') || bodyText.includes('Documentos')
    expect(hasContent).toBe(true)
  })

  test('/compliance loads', async ({ page }) => {
    await navigateAndVerify(page, '/compliance')
    const bodyText = await page.locator('body').innerText()
    const hasContent = bodyText.includes('Compliance') || bodyText.includes('Cumplimiento')
    expect(hasContent).toBe(true)
  })

  test('/knowledge-base loads', async ({ page }) => {
    await navigateAndVerify(page, '/knowledge-base')
    const bodyText = await page.locator('body').innerText()
    const hasContent = bodyText.includes('Knowledge Base') || bodyText.includes('Base de conocimiento') || bodyText.includes('Knowledge')
    expect(hasContent).toBe(true)
  })

  test('/settings loads', async ({ page }) => {
    await navigateAndVerify(page, '/settings')
    const bodyText = await page.locator('body').innerText()
    const hasContent = bodyText.includes('Settings') || bodyText.includes('Configuración') || bodyText.includes('Config')
    expect(hasContent).toBe(true)
  })

  test('/settings/profile loads', async ({ page }) => {
    await navigateAndVerify(page, '/settings/profile')
  })

  test('/settings/tenant loads', async ({ page }) => {
    await navigateAndVerify(page, '/settings/tenant')
  })

  test('/settings/team loads', async ({ page }) => {
    await navigateAndVerify(page, '/settings/team')
  })

  test('/settings/data-rights loads', async ({ page }) => {
    await navigateAndVerify(page, '/settings/data-rights')
  })

  test('/admin loads', async ({ page }) => {
    await navigateAndVerify(page, '/admin')
    const bodyText = await page.locator('body').innerText()
    const hasContent = bodyText.includes('Admin') || bodyText.includes('Compliance')
    expect(hasContent).toBe(true)
  })

  test('/admin/legal-entity loads', async ({ page }) => {
    await navigateAndVerify(page, '/admin/legal-entity')
  })

  test('/admin/dpa-tracker loads', async ({ page }) => {
    await navigateAndVerify(page, '/admin/dpa-tracker')
  })

  test('/admin/tax loads', async ({ page }) => {
    await navigateAndVerify(page, '/admin/tax')
  })

  test('/admin/insurance loads', async ({ page }) => {
    await navigateAndVerify(page, '/admin/insurance')
  })

  test('/admin/lawyer loads', async ({ page }) => {
    await navigateAndVerify(page, '/admin/lawyer')
  })
})
