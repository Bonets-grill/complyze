'use client'

import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LanguageSwitcher } from '@/components/layout/language-switcher'

export default function CookiePolicyPage() {
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
        <h1 className="text-3xl font-bold sm:text-4xl">{L.cookiePolicyTitle}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{L.privacyLastUpdated}: April 7, 2026</p>

        <p className="mt-6 leading-relaxed">{L.cookiePolicyIntro}</p>

        {/* What Are Cookies */}
        <h2 className="mt-10 text-2xl font-semibold">{L.cookieWhatAre}</h2>
        <p className="mt-3 leading-relaxed">{L.cookieWhatAreDesc}</p>

        {/* Types of Cookies */}
        <h2 className="mt-10 text-2xl font-semibold">{L.cookieTypesTitle}</h2>

        <h3 className="mt-6 text-lg font-medium">{L.cookieNecessaryTitle}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{L.cookieNecessaryPolicyDesc}</p>

        <h3 className="mt-6 text-lg font-medium">{L.cookieAnalyticsTitle}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{L.cookieAnalyticsPolicyDesc}</p>

        <h3 className="mt-6 text-lg font-medium">{L.cookieMarketingTitle}</h3>
        <p className="mt-2 leading-relaxed text-muted-foreground">{L.cookieMarketingPolicyDesc}</p>

        {/* Managing Cookies */}
        <h2 className="mt-10 text-2xl font-semibold">{L.cookieManage}</h2>
        <p className="mt-3 leading-relaxed">{L.cookieManageDesc}</p>
      </main>

      {/* Footer with legal links */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-4xl px-4">
          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">{L.privacyPolicyTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/terms" className="hover:text-foreground">{L.tosTitle}</Link>
            <span className="text-muted-foreground/40">|</span>
            <Link href="/cookies" className="font-medium text-foreground">{L.cookiePolicyTitle}</Link>
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
