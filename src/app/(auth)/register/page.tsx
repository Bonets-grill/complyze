'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { lang } = useUIStore()
  const [fullName, setFullName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [consentPrivacy, setConsentPrivacy] = useState(false)
  const [consentTerms, setConsentTerms] = useState(false)
  const [consentAi, setConsentAi] = useState(false)

  const canSubmit = consentPrivacy && consentTerms && consentAi

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName,
          consent_privacy: true,
          consent_terms: true,
          consent_ai_processing: true,
          consent_timestamp: new Date().toISOString(),
        },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{T[lang].registerTitle}</CardTitle>
        <CardDescription>{T[lang].registerSubtitle}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">{T[lang].fullName}</Label>
            <Input
              id="fullName"
              placeholder={T[lang].fullNamePlaceholder}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">{T[lang].companyName}</Label>
            <Input
              id="companyName"
              placeholder={T[lang].companyNamePlaceholder}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
            />
          </div>
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
            <Label htmlFor="password">{T[lang].password}</Label>
            <Input
              id="password"
              type="password"
              placeholder={T[lang].passwordPlaceholder}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>

          {/* Legal consents */}
          <div className="space-y-3 rounded-lg border p-4">
            <p className="text-sm font-medium">{LEGAL[lang].consentRequired}</p>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={consentPrivacy}
                onChange={(e) => setConsentPrivacy(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
                required
              />
              <span>
                {LEGAL[lang].iHaveRead}{' '}
                <Link href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                  {T[lang].privacy}
                </Link>
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={consentTerms}
                onChange={(e) => setConsentTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
                required
              />
              <span>
                {LEGAL[lang].iHaveRead}{' '}
                <Link href="/terms" target="_blank" className="text-blue-600 hover:underline">
                  {T[lang].terms}
                </Link>
              </span>
            </label>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={consentAi}
                onChange={(e) => setConsentAi(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300"
                required
              />
              <span>{LEGAL[lang].consentAiProcessing}</span>
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={loading || !canSubmit}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {T[lang].register}
          </Button>
          <p className="text-sm text-muted-foreground">
            {T[lang].hasAccount}{' '}
            <Link href="/login" className="text-blue-600 hover:underline">
              {T[lang].login}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
