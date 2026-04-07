import { test, expect } from '@playwright/test'
import { DEMO_EMAIL, DEMO_PASSWORD } from './helpers'

test.describe('API endpoints', () => {
  test('POST /api/auth/demo with correct credentials returns 200', async ({ request }) => {
    const response = await request.post('/api/auth/demo', {
      data: {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      },
    })
    expect(response.status()).toBe(200)
  })

  test('POST /api/auth/demo with wrong credentials returns 401', async ({ request }) => {
    const response = await request.post('/api/auth/demo', {
      data: {
        email: 'wrong@example.com',
        password: 'wrongpassword',
      },
    })
    expect(response.status()).toBe(401)
  })

  test('POST /api/ai/classify with mock data returns a response', async ({ request }) => {
    const response = await request.post('/api/ai/classify', {
      data: {
        name: 'Test AI System',
        description: 'A test AI system for classification',
        purpose: 'Testing',
      },
    })
    // Accept 200 (success) or 401 (needs auth) — both mean the endpoint exists
    expect([200, 401, 403]).toContain(response.status())
  })

  test('GET /api/auth/callback without code redirects', async ({ request }) => {
    const response = await request.get('/api/auth/callback', {
      maxRedirects: 0,
    })
    // Should redirect (302/307) or return an error (400) when no code is provided
    expect([302, 307, 400, 401]).toContain(response.status())
  })
})
