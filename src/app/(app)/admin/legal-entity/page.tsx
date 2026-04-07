'use client'

import { useState, useEffect } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { useLegalConfigStore } from '@/stores/legal-config-store'
import type { LegalEntity } from '@/stores/legal-config-store'
import { T } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const COMPANY_TYPES = ['S.L.', 'S.A.', 'Autónomo', 'GmbH', 'Ltd', 'SAS', 'S.r.l.', 'Other']

export default function LegalEntityPage() {
  const { lang } = useUIStore()
  const { entity, setEntity, lastUpdated } = useLegalConfigStore()

  const [form, setForm] = useState<LegalEntity>({ ...entity })

  useEffect(() => {
    setForm({ ...entity })
  }, [entity])

  function update(field: keyof LegalEntity, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setEntity(form)
    toast.success(T[lang].save + ' OK')
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Legal Entity</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last saved: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={form.companyName}
                  onChange={(e) => update('companyName', e.target.value)}
                  placeholder="Complyze S.L."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyType">Company Type</Label>
                <select
                  id="companyType"
                  value={form.companyType}
                  onChange={(e) => update('companyType', e.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <option value="">-- Select --</option>
                  {COMPANY_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => update('address', e.target.value)}
                  placeholder="Calle Example 123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  placeholder="Santa Cruz de Tenerife"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={form.postalCode}
                  onChange={(e) => update('postalCode', e.target.value)}
                  placeholder="38001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={form.country}
                  onChange={(e) => update('country', e.target.value)}
                  placeholder="Spain"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vatId">VAT / Tax ID</Label>
                <Input
                  id="vatId"
                  value={form.vatId}
                  onChange={(e) => update('vatId', e.target.value)}
                  placeholder="B12345678"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+34 600 000 000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  placeholder="info@complyze.eu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="legalEmail">Legal Email</Label>
                <Input
                  id="legalEmail"
                  type="email"
                  value={form.legalEmail}
                  onChange={(e) => update('legalEmail', e.target.value)}
                  placeholder="legal@complyze.eu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacyEmail">Privacy Email</Label>
                <Input
                  id="privacyEmail"
                  type="email"
                  value={form.privacyEmail}
                  onChange={(e) => update('privacyEmail', e.target.value)}
                  placeholder="privacy@complyze.eu"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsiblePerson">Responsible Person</Label>
                <Input
                  id="responsiblePerson"
                  value={form.responsiblePerson}
                  onChange={(e) => update('responsiblePerson', e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="responsibleRole">Responsible Role</Label>
                <Input
                  id="responsibleRole"
                  value={form.responsibleRole}
                  onChange={(e) => update('responsibleRole', e.target.value)}
                  placeholder="CEO / DPO"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commercialRegister">Commercial Register</Label>
                <Input
                  id="commercialRegister"
                  value={form.commercialRegister}
                  onChange={(e) => update('commercialRegister', e.target.value)}
                  placeholder="Registro Mercantil de Tenerife"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="commercialRegisterNumber">Register Number</Label>
                <Input
                  id="commercialRegisterNumber"
                  value={form.commercialRegisterNumber}
                  onChange={(e) => update('commercialRegisterNumber', e.target.value)}
                  placeholder="Tomo 1234, Folio 56, Hoja TF-7890"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {T[lang].save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
