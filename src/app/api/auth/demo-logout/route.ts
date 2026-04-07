import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('complyze_demo_session', '', {
    httpOnly: false,
    maxAge: 0,
    path: '/',
  })
  return response
}
