import { NextResponse } from 'next/server'

const DEMO_EMAIL = 'admin@complyze.eu'
const DEMO_PASSWORD = 'Complyze2026!'

export async function POST(request: Request) {
  const { email, password } = await request.json()

  if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const response = NextResponse.json({
    user: {
      id: 'demo-user-001',
      email: DEMO_EMAIL,
    },
    profile: {
      id: 'demo-user-001',
      tenant_id: 'demo-tenant-001',
      email: DEMO_EMAIL,
      full_name: 'Admin Complyze',
      role: 'owner' as const,
      avatar_url: null,
      created_at: new Date().toISOString(),
    },
    tenant: {
      id: 'demo-tenant-001',
      name: 'Complyze Demo',
      slug: 'complyze-demo',
      plan: 'enterprise' as const,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      settings: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  })

  response.cookies.set('complyze_demo_session', 'true', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}
