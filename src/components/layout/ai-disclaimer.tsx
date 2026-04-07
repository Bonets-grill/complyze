'use client'

import { useState } from 'react'
import { AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { useUIStore } from '@/stores/ui-store'
import { Button } from '@/components/ui/button'

export function AIDisclaimer() {
  const { lang } = useUIStore()
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-amber-950/20">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
            {LEGAL[lang].aiDisclaimer}
          </p>
          {expanded && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {LEGAL[lang].aiDisclaimerFull}
            </p>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={() => setExpanded(!expanded)}
            className="text-amber-700 hover:text-amber-900 dark:text-amber-300 dark:hover:text-amber-100"
          >
            {expanded ? (
              <>
                <ChevronUp className="mr-1 h-3 w-3" />
                {lang === 'es' ? 'Menos' : lang === 'fr' ? 'Moins' : lang === 'de' ? 'Weniger' : lang === 'it' ? 'Meno' : 'Less'}
              </>
            ) : (
              <>
                <ChevronDown className="mr-1 h-3 w-3" />
                {lang === 'es' ? 'Más info' : lang === 'fr' ? 'En savoir plus' : lang === 'de' ? 'Mehr erfahren' : lang === 'it' ? 'Scopri di più' : 'Learn more'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
