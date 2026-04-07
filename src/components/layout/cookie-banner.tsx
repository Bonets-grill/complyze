'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { Button } from '@/components/ui/button'
import { Cookie, X } from 'lucide-react'

const STORAGE_KEY = 'complyze_cookie_consent'

interface CookieConsent {
  necessary: true
  analytics: boolean
  marketing: boolean
  timestamp: string
}

function getStoredConsent(): CookieConsent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as CookieConsent
  } catch {
    return null
  }
}

function saveConsent(consent: CookieConsent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent))
}

// Global event target for re-opening the banner
const bannerEvent = typeof window !== 'undefined' ? new EventTarget() : null

/** Call this to re-open the cookie settings banner */
export function openCookieSettings() {
  bannerEvent?.dispatchEvent(new Event('open'))
}

export function CookieBanner() {
  const lang = useUIStore((s) => s.lang)
  const t = LEGAL[lang]

  const [visible, setVisible] = useState(false)
  const [customizing, setCustomizing] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  // Show banner if no stored consent
  useEffect(() => {
    const consent = getStoredConsent()
    if (!consent) {
      setVisible(true)
    } else {
      setAnalytics(consent.analytics)
      setMarketing(consent.marketing)
    }
  }, [])

  // Listen for re-open events
  useEffect(() => {
    if (!bannerEvent) return
    const handler = () => {
      const consent = getStoredConsent()
      if (consent) {
        setAnalytics(consent.analytics)
        setMarketing(consent.marketing)
      }
      setCustomizing(true)
      setVisible(true)
    }
    bannerEvent.addEventListener('open', handler)
    return () => bannerEvent.removeEventListener('open', handler)
  }, [])

  const handleAcceptAll = useCallback(() => {
    const consent: CookieConsent = {
      necessary: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    saveConsent(consent)
    setAnalytics(true)
    setMarketing(true)
    setVisible(false)
    setCustomizing(false)
  }, [])

  const handleRejectAll = useCallback(() => {
    const consent: CookieConsent = {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    saveConsent(consent)
    setAnalytics(false)
    setMarketing(false)
    setVisible(false)
    setCustomizing(false)
  }, [])

  const handleSave = useCallback(() => {
    const consent: CookieConsent = {
      necessary: true,
      analytics,
      marketing,
      timestamp: new Date().toISOString(),
    }
    saveConsent(consent)
    setVisible(false)
    setCustomizing(false)
  }, [analytics, marketing])

  if (!visible) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card p-5 shadow-2xl dark:shadow-black/40">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Cookie className="size-5 shrink-0 text-primary" />
            <h3 className="text-base font-semibold text-foreground">
              {t.cookieBannerTitle}
            </h3>
          </div>
          <button
            onClick={() => { setVisible(false); setCustomizing(false) }}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          {t.cookieBannerDesc}
        </p>

        {/* Customization panel */}
        {customizing && (
          <div className="mb-4 space-y-3 rounded-lg border border-border bg-muted/50 p-3.5 dark:bg-muted/20">
            {/* Necessary - always on */}
            <ToggleRow
              label={t.cookieNecessary}
              description={t.cookieNecessaryDesc}
              checked={true}
              disabled
              onChange={() => {}}
            />

            {/* Analytics */}
            <ToggleRow
              label={t.cookieAnalytics}
              description={t.cookieAnalyticsDesc}
              checked={analytics}
              onChange={setAnalytics}
            />

            {/* Marketing */}
            <ToggleRow
              label={t.cookieMarketing}
              description={t.cookieMarketingDesc}
              checked={marketing}
              onChange={setMarketing}
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          {customizing ? (
            <Button onClick={handleSave} className="w-full sm:w-auto">
              {t.cookieSavePreferences}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleRejectAll}
                className="w-full sm:w-auto"
              >
                {t.cookieRejectAll}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCustomizing(true)}
                className="w-full sm:w-auto"
              >
                {t.cookieCustomize}
              </Button>
              <Button onClick={handleAcceptAll} className="w-full sm:w-auto">
                {t.cookieAcceptAll}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Inline toggle row (no Switch dependency)                          */
/* ------------------------------------------------------------------ */

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          'mt-0.5 inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          disabled ? 'cursor-not-allowed opacity-60' : '',
          checked ? 'bg-primary' : 'bg-input dark:bg-muted',
        ].join(' ')}
      >
        <span
          className={[
            'pointer-events-none block size-4 rounded-full bg-background shadow-sm ring-0 transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0',
          ].join(' ')}
        />
      </button>
    </label>
  )
}
