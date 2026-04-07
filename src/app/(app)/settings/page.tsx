'use client'

import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { User, Building2, Users, Shield } from 'lucide-react'

export default function SettingsPage() {
  const { lang } = useUIStore()

  const sections = [
    { href: '/settings/profile', icon: User, title: T[lang].profileSettings, desc: T[lang].profile },
    { href: '/settings/tenant', icon: Building2, title: T[lang].tenantSettings, desc: T[lang].tenant },
    { href: '/settings/team', icon: Users, title: T[lang].teamMembers, desc: T[lang].team },
    { href: '/settings/data-rights', icon: Shield, title: LEGAL[lang].gdprDataRights, desc: 'GDPR' },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{T[lang].settings}</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="cursor-pointer transition-colors hover:bg-accent">
              <CardHeader>
                <s.icon className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg">{s.title}</CardTitle>
                <CardDescription>{s.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
