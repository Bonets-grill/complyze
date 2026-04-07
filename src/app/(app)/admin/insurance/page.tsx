'use client'

import { useState, useEffect } from 'react'
import { useLegalConfigStore } from '@/stores/legal-config-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Shield, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export default function InsurancePage() {
  const { insurance, setInsurance } = useLegalConfigStore()
  const [form, setForm] = useState(insurance)

  useEffect(() => {
    setForm(insurance)
  }, [insurance])

  function handleSave() {
    setInsurance(form)
    toast.success('Insurance configuration saved')
  }

  function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Insurance</h1>
          <p className="text-muted-foreground text-sm">
            Professional liability insurance configuration
          </p>
        </div>
        <Badge variant={form.hasInsurance ? 'default' : 'secondary'}>
          {form.hasInsurance ? 'Insured' : 'Not insured'}
        </Badge>
      </div>

      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="flex gap-3 pt-6">
          <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-medium mb-1">Why is RC profesional important?</p>
            <p>
              SaaS products that use AI to process personal data or provide automated advice carry
              inherent liability risk. Professional liability insurance (RC profesional) protects
              your company against claims arising from data breaches, AI errors, incorrect
              compliance advice, or service interruptions. In the EU, regulators increasingly
              expect SaaS providers to demonstrate adequate insurance coverage, especially for
              AI-powered products subject to the EU AI Act.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Shield className="h-5 w-5" />
            Insurance Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasInsurance}
              onChange={(e) => updateField('hasInsurance', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Has professional liability insurance
          </Label>

          {form.hasInsurance && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="provider">Provider Name</Label>
                <Input
                  id="provider"
                  placeholder="e.g. Hiscox, AXA, Zurich"
                  value={form.provider}
                  onChange={(e) => updateField('provider', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="policyNumber">Policy Number</Label>
                <Input
                  id="policyNumber"
                  placeholder="e.g. POL-2026-12345"
                  value={form.policyNumber}
                  onChange={(e) => updateField('policyNumber', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverageAmount">Coverage Amount</Label>
                <Input
                  id="coverageAmount"
                  placeholder="e.g. 1,000,000 EUR"
                  value={form.coverageAmount}
                  onChange={(e) => updateField('coverageAmount', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coverageType">Coverage Type</Label>
                <Input
                  id="coverageType"
                  placeholder="e.g. Professional liability"
                  value={form.coverageType}
                  onChange={(e) => updateField('coverageType', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) => updateField('expiryDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="insurance@provider.com"
                  value={form.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Insurance Config
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
