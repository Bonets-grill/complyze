'use client'

import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export default function TermsOfServicePage() {
  const { lang } = useUIStore()
  const L = LEGAL[lang]

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              C
            </div>
            <span className="text-lg font-bold">Complyze</span>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold sm:text-4xl">{L.tosTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{L.tosLastUpdated}: April 7, 2026</p>

        <p className="mt-6 leading-relaxed">{L.tosIntro}</p>

        {/* Acceptance */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosAcceptance}</h2>
        <p className="mt-3 leading-relaxed">{L.tosAcceptanceDesc}</p>

        {/* Service Description */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosService}</h2>
        <p className="mt-3 leading-relaxed">{L.tosServiceDesc}</p>

        {/* AI Disclaimer */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosAiDisclaimer}</h2>
        <p className="mt-3 leading-relaxed">{L.tosAiDisclaimerDesc}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>{L.tosAiDisclaimerDetail1}</li>
          <li>{L.tosAiDisclaimerDetail2}</li>
          <li>{L.tosAiDisclaimerDetail3}</li>
        </ul>

        {/* Accounts */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosAccounts}</h2>
        <p className="mt-3 leading-relaxed">{L.tosAccountsDesc}</p>

        {/* Payment */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosPayment}</h2>
        <p className="mt-3 leading-relaxed">{L.tosPaymentDesc}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>{L.tosPaymentDetail1}</li>
          <li>{L.tosPaymentDetail2}</li>
          <li>{L.tosPaymentDetail3}</li>
        </ul>

        {/* Refunds */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosRefunds}</h2>
        <p className="mt-3 leading-relaxed">{L.tosRefundsDesc}</p>

        {/* Intellectual Property */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosIntellectualProperty}</h2>
        <p className="mt-3 leading-relaxed">{L.tosIntellectualPropertyDesc}</p>

        {/* Acceptable Use */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosAcceptableUse}</h2>
        <p className="mt-3 leading-relaxed">{L.tosAcceptableUseDesc}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>{L.tosProhibited1}</li>
          <li>{L.tosProhibited2}</li>
          <li>{L.tosProhibited3}</li>
          <li>{L.tosProhibited4}</li>
        </ul>

        {/* Limitation of Liability */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosLiability}</h2>
        <p className="mt-3 leading-relaxed">{L.tosLiabilityDesc}</p>

        {/* Indemnification */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosIndemnification}</h2>
        <p className="mt-3 leading-relaxed">{L.tosIndemnificationDesc}</p>

        {/* Termination */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosTermination}</h2>
        <p className="mt-3 leading-relaxed">{L.tosTerminationDesc}</p>

        {/* Governing Law */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosGoverningLaw}</h2>
        <p className="mt-3 leading-relaxed">{L.tosGoverningLawDesc}</p>

        {/* Entire Agreement */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosEntirety}</h2>
        <p className="mt-3 leading-relaxed">{L.tosEntiretyDesc}</p>

        {/* Contact */}
        <h2 className="mt-10 text-2xl font-semibold">{L.tosContactInfo}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyContactDesc}</p>
      </main>

      {/* Footer with legal links */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">{L.privacyPolicyTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/terms" className="font-medium text-foreground">{L.tosTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/cookies" className="hover:text-foreground">{L.cookiePolicyTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/legal-notice" className="hover:text-foreground">{L.legalNoticeTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/dpa" className="hover:text-foreground">{L.dpaTitle}</Link>
          </nav>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Complyze. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
