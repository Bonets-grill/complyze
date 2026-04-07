'use client'

import { Bot } from 'lucide-react'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { useUIStore } from '@/stores/ui-store'

export function TransparencyFooter() {
  const { lang } = useUIStore()

  return (
    <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground">
      <Bot className="h-3.5 w-3.5" />
      <span>{LEGAL[lang].aiTransparencyNotice}</span>
    </div>
  )
}
