'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import type { Profile } from '@/types/database'
import { T } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfileSettingsPage() {
  const { profile, setProfile } = useAuthStore()
  const { lang } = useUIStore()
  const [fullName, setFullName] = useState(profile?.full_name ?? '')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) setFullName(profile.full_name)
  }, [profile])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return
    setSaving(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName } as Record<string, unknown>)
      .eq('id', profile.id)
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else if (data) {
      setProfile(data as unknown as Profile)
      toast.success(T[lang].save + ' OK')
    }
    setSaving(false)
  }

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{T[lang].profileSettings}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{T[lang].profile}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{T[lang].email}</Label>
              <Input id="email" value={profile?.email ?? ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">{T[lang].fullName}</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>{T[lang].role}</Label>
              <Input value={profile?.role ?? ''} disabled />
            </div>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {T[lang].save}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
