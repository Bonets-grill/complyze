'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import type { Tenant } from '@/types/database'
import { T } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function TenantSettingsPage() {
  const { tenant, profile, setTenant } = useAuthStore()
  const { lang } = useUIStore()
  const [name, setName] = useState(tenant?.name ?? '')
  const [saving, setSaving] = useState(false)
  const isEditable = profile?.role === 'owner' || profile?.role === 'admin'

  useEffect(() => {
    if (tenant) setName(tenant.name)
  }, [tenant])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!tenant) return
    setSaving(true)

    const supabase = createClient()
    const { data, error } = await supabase
      .from('tenants')
      .update({ name } as Record<string, unknown>)
      .eq('id', tenant.id)
      .select()
      .single()

    if (error) {
      toast.error(error.message)
    } else if (data) {
      setTenant(data as unknown as Tenant)
      toast.success(T[lang].save + ' OK')
    }
    setSaving(false)
  }

  const planLabel = tenant?.plan === 'trial' ? 'Trial' :
    tenant?.plan === 'starter' ? T[lang].starter :
    tenant?.plan === 'professional' ? T[lang].professional :
    T[lang].enterprise

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{T[lang].tenantSettings}</h1>
      <Card>
        <CardHeader>
          <CardTitle>{T[lang].tenant}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{T[lang].name}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={!isEditable}
              />
            </div>
            <div className="space-y-2">
              <Label>{T[lang].currentPlan}</Label>
              <div>
                <Badge variant="secondary" className="text-sm">{planLabel}</Badge>
              </div>
            </div>
            {isEditable && (
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {T[lang].save}
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
