'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { ChevronRight, Home } from 'lucide-react'

const routeLabels: Record<string, keyof typeof T['en']> = {
  dashboard: 'dashboard',
  systems: 'systems',
  assessments: 'assessments',
  documents: 'documents',
  compliance: 'compliance',
  'knowledge-base': 'knowledgeBase',
  settings: 'settings',
  profile: 'profile',
  tenant: 'tenant',
  team: 'team',
  billing: 'billing',
}

export function Breadcrumbs() {
  const pathname = usePathname()
  const { lang } = useUIStore()
  const segments = pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <Link href="/dashboard" className="hover:text-foreground">
        <Home className="h-4 w-4" />
      </Link>
      {segments.map((segment, i) => {
        const href = '/' + segments.slice(0, i + 1).join('/')
        const labelKey = routeLabels[segment]
        const label = labelKey ? T[lang][labelKey] : segment
        const isLast = i === segments.length - 1

        return (
          <span key={href} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3" />
            {isLast ? (
              <span className="text-foreground font-medium">{label}</span>
            ) : (
              <Link href={href} className="hover:text-foreground">
                {label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
