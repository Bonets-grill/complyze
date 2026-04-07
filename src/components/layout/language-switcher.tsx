'use client'

import { useUIStore } from '@/stores/ui-store'
import { LANGUAGES } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Globe } from 'lucide-react'
import type { Lang } from '@/types/database'

export function LanguageSwitcher() {
  const { lang, setLang } = useUIStore()
  const current = LANGUAGES.find((l) => l.code === lang)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((l) => (
          <DropdownMenuItem
            key={l.code}
            onClick={() => setLang(l.code as Lang)}
            className={lang === l.code ? 'bg-accent' : ''}
          >
            <span className="mr-2">{l.flag}</span>
            {l.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
