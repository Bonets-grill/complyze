'use client'

import { useState, useEffect } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { useLegalConfigStore } from '@/stores/legal-config-store'
import type { TaxConfig } from '@/stores/legal-config-store'
import { T } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const TAX_REGIMES = ['IVA', 'IGIC', 'VAT', 'MwSt']

export default function TaxConfigPage() {
  const { lang } = useUIStore()
  const { tax, setTax, lastUpdated } = useLegalConfigStore()

  const [form, setForm] = useState<TaxConfig>({ ...tax })

  useEffect(() => {
    setForm({ ...tax })
  }, [tax])

  function updateField<K extends keyof TaxConfig>(field: K, value: TaxConfig[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setTax(form)
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
          <h1 className="text-2xl font-bold">Tax Configuration</h1>
          {lastUpdated && (
            <p className="text-sm text-muted-foreground">
              Last saved: {new Date(lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRegime">Tax Regime</Label>
                <select
                  id="taxRegime"
                  value={form.taxRegime}
                  onChange={(e) => updateField('taxRegime', e.target.value)}
                  className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  {TAX_REGIMES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxRate">Tax Rate</Label>
                <Input
                  id="taxRate"
                  value={form.taxRate}
                  onChange={(e) => updateField('taxRate', e.target.value)}
                  placeholder="21%"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="vatOssRegistered"
                  checked={form.vatOssRegistered}
                  onChange={(e) => updateField('vatOssRegistered', e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-blue-600"
                />
                <Label htmlFor="vatOssRegistered">VAT OSS Registered</Label>
              </div>
              {form.vatOssRegistered && (
                <div className="space-y-2 pl-7">
                  <Label htmlFor="vatOssNumber">VAT OSS Number</Label>
                  <Input
                    id="vatOssNumber"
                    value={form.vatOssNumber}
                    onChange={(e) => updateField('vatOssNumber', e.target.value)}
                    placeholder="EU123456789"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="stripeTaxEnabled"
                  checked={form.stripeTaxEnabled}
                  onChange={(e) => updateField('stripeTaxEnabled', e.target.checked)}
                  className="h-4 w-4 rounded border-input accent-blue-600"
                />
                <Label htmlFor="stripeTaxEnabled">Stripe Tax Enabled</Label>
              </div>
              {form.stripeTaxEnabled && (
                <div className="space-y-2 pl-7">
                  <Label htmlFor="stripeTaxId">Stripe Tax ID</Label>
                  <Input
                    id="stripeTaxId"
                    value={form.stripeTaxId}
                    onChange={(e) => updateField('stripeTaxId', e.target.value)}
                    placeholder="txr_..."
                  />
                </div>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                <Input
                  id="invoicePrefix"
                  value={form.invoicePrefix}
                  onChange={(e) => updateField('invoicePrefix', e.target.value)}
                  placeholder="CMP"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="invoiceNextNumber">Invoice Next Number</Label>
                <Input
                  id="invoiceNextNumber"
                  type="number"
                  min={1}
                  value={form.invoiceNextNumber}
                  onChange={(e) => updateField('invoiceNextNumber', parseInt(e.target.value) || 1)}
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
