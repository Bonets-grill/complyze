'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Profile } from '@/types/database'

export default function TeamPage() {
  const { tenant, profile } = useAuthStore()
  const { lang } = useUIStore()
  const [members, setMembers] = useState<Profile[]>([])

  useEffect(() => {
    if (!tenant) return
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('*')
      .eq('tenant_id', tenant.id)
      .order('created_at')
      .then(({ data }) => {
        if (data) setMembers(data as unknown as Profile[])
      })
  }, [tenant])

  const roleColor: Record<string, string> = {
    owner: 'bg-blue-600 text-white',
    admin: 'bg-emerald-500 text-white',
    member: 'bg-gray-500 text-white',
    viewer: 'bg-gray-400 text-white',
  }

  const roleLabel = (role: string) => {
    const map: Record<string, string> = {
      owner: T[lang].owner,
      admin: T[lang].admin,
      member: T[lang].member,
      viewer: T[lang].viewer,
    }
    return map[role] ?? role
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{T[lang].teamMembers}</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{T[lang].team}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {members.map((m) => {
              const initials = m.full_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
              return (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-blue-600 text-white text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{m.full_name}</p>
                      <p className="text-xs text-muted-foreground">{m.email}</p>
                    </div>
                  </div>
                  <Badge className={roleColor[m.role]}>{roleLabel(m.role)}</Badge>
                </div>
              )
            })}
            {members.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">--</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
