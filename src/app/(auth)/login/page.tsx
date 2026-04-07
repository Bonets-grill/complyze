'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { T } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { lang } = useUIStore()
  const { setUser, setProfile, setTenant, setLoading: setAuthLoading } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Try demo login first
    const demoRes = await fetch('/api/auth/demo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (demoRes.ok) {
      const data = await demoRes.json()
      setUser(data.user)
      setProfile(data.profile)
      setTenant(data.tenant)
      setAuthLoading(false)
      router.push('/dashboard')
      return
    }

    // Fall back to Supabase auth
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch {
      setError('Authentication service unavailable')
      setLoading(false)
    }
  }

  function fillDemoCredentials() {
    setEmail('admin@complyze.eu')
    setPassword('Complyze2026!')
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{T[lang].loginTitle}</CardTitle>
        <CardDescription>{T[lang].loginSubtitle}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">{T[lang].email}</Label>
            <Input
              id="email"
              type="email"
              placeholder={T[lang].emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{T[lang].password}</Label>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                {T[lang].forgotPassword}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={T[lang].passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {T[lang].login}
          </Button>

          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={fillDemoCredentials}
          >
            Demo: admin@complyze.eu
          </Button>

          <p className="text-sm text-muted-foreground">
            {T[lang].noAccount}{' '}
            <Link href="/register" className="text-blue-600 hover:underline">
              {T[lang].register}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
