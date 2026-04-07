'use client'

import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'

export default function KnowledgeBasePage() {
  const { lang } = useUIStore()
  return (
    <div>
      <h1 className="text-2xl font-bold">{T[lang].knowledgeBase}</h1>
      <p className="text-muted-foreground mt-2">Module 8</p>
    </div>
  )
}
