'use client'

import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold sm:text-4xl">{L.privacyPolicyTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{L.privacyLastUpdated}: April 7, 2026</p>

        <p className="mt-6 leading-relaxed">{L.privacyIntro}</p>

        {/* Data Controller */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyDataController}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyDataControllerDesc}</p>

        {/* Data We Collect */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyDataWeCollect}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyDataWeCollectDesc}</p>

        <h3 className="mt-6 text-lg font-medium">{L.privacyAccountData}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{L.privacyAccountDataDesc}</p>

        <h3 className="mt-6 text-lg font-medium">{L.privacyUsageData}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{L.privacyUsageDataDesc}</p>

        <h3 className="mt-6 text-lg font-medium">{L.privacyAiData}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{L.privacyAiDataDesc}</p>

        <h3 className="mt-6 text-lg font-medium">{L.privacyPaymentData}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{L.privacyPaymentDataDesc}</p>

        {/* Purposes */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyPurposes}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>{L.privacyPurpose1}</li>
          <li>{L.privacyPurpose2}</li>
          <li>{L.privacyPurpose3}</li>
          <li>{L.privacyPurpose4}</li>
        </ul>

        {/* Legal Basis */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyLegalBasis}</h2>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>{L.privacyLegalBasis1}</li>
          <li>{L.privacyLegalBasis2}</li>
          <li>{L.privacyLegalBasis3}</li>
        </ul>

        {/* Sub-processors */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacySubprocessors}</h2>
        <p className="mt-3 leading-relaxed">{L.privacySubprocessorsDesc}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
          <li>{L.privacySubprocessorSupabase}</li>
          <li>{L.privacySubprocessorAnthropic}</li>
          <li>{L.privacySubprocessorStripe}</li>
          <li>{L.privacySubprocessorVercel}</li>
        </ul>

        {/* Data Retention */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyRetention}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyRetentionDesc}</p>

        {/* Your Rights */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyRights}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyRightsDesc}</p>
        <ul className="mt-3 list-disc space-y-2 pl-6">
          <li>{L.privacyRightAccess}</li>
          <li>{L.privacyRightRectification}</li>
          <li>{L.privacyRightErasure}</li>
          <li>{L.privacyRightPortability}</li>
          <li>{L.privacyRightObjection}</li>
          <li>{L.privacyRightRestriction}</li>
          <li>{L.privacyRightWithdraw}</li>
          <li>{L.privacyRightComplaint}</li>
        </ul>

        {/* International Transfers */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyInternationalTransfers}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyInternationalTransfersDesc}</p>

        {/* Security */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacySecurity}</h2>
        <p className="mt-3 leading-relaxed">{L.privacySecurityDesc}</p>

        {/* Children */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyChildren}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyChildrenDesc}</p>

        {/* Changes */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyChanges}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyChangesDesc}</p>

        {/* Contact */}
        <h2 className="mt-10 text-2xl font-semibold">{L.privacyContact}</h2>
        <p className="mt-3 leading-relaxed">{L.privacyContactDesc}</p>
      </main>

      {/* Footer with legal links */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="font-medium text-foreground">{L.privacyPolicyTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/terms" className="hover:text-foreground">{L.tosTitle}</Link>
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
