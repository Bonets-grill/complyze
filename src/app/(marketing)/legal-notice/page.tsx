'use client'

import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { useLegalConfigStore } from '@/stores/legal-config-store'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export default function LegalNoticePage() {
  const { lang } = useUIStore()
  const L = LEGAL[lang]
  const { entity } = useLegalConfigStore()

  const companyName = entity.companyName || L.legalNoticeCompanyNameDesc
  const address = entity.address
    ? `${entity.address}, ${entity.postalCode} ${entity.city}, ${entity.country}`
    : '--'
  const vatId = entity.vatId || '--'
  const responsible = entity.responsiblePerson
    ? `${entity.responsiblePerson} (${entity.responsibleRole})`
    : L.legalNoticeResponsibleDesc
  const register = entity.commercialRegister
    ? `${entity.commercialRegister} — ${entity.commercialRegisterNumber}`
    : L.legalNoticeRegisterDesc

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">C</div>
            <span className="text-lg font-bold">Complyze</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold sm:text-4xl">{L.legalNoticeTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{L.privacyLastUpdated}: April 7, 2026</p>

        <div className="mt-8 space-y-6">
          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">{L.legalNoticeCompanyName}</h2>
            <p className="mt-2 text-muted-foreground">
              {companyName}
              {entity.companyType && ` (${entity.companyType})`}
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">{L.legalNoticeAddress}</h2>
            <p className="mt-2 text-muted-foreground">{address}</p>
          </div>

          <div className="rounded-lg border p-6 space-y-2">
            <h2 className="text-lg font-semibold mb-2">Contact</h2>
            <p><span className="font-medium">{L.legalNoticeEmail}:</span> <span className="text-muted-foreground">{entity.email || '--'}</span></p>
            <p><span className="font-medium">{L.legalNoticePhone}:</span> <span className="text-muted-foreground">{entity.phone || '--'}</span></p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">{L.legalNoticeVat}</h2>
            <p className="mt-2 text-muted-foreground">{vatId}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">{L.legalNoticeResponsible}</h2>
            <p className="mt-2 text-muted-foreground">{responsible}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">{L.legalNoticeRegister}</h2>
            <p className="mt-2 text-muted-foreground">{register}</p>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-lg font-semibold">{L.legalNoticeDispute}</h2>
            <p className="mt-2 text-muted-foreground">{L.legalNoticeDisputeDesc}</p>
          </div>
        </div>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">{L.privacyPolicyTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/terms" className="hover:text-foreground">{L.tosTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/cookies" className="hover:text-foreground">{L.cookiePolicyTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/legal-notice" className="font-medium text-foreground">{L.legalNoticeTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/dpa" className="hover:text-foreground">{L.dpaTitle}</Link>
          </nav>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {companyName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
