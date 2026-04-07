'use client'

import { useState, useEffect } from 'react'
import { useLegalConfigStore } from '@/stores/legal-config-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Scale, CheckCircle2, Info } from 'lucide-react'
import { toast } from 'sonner'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  approved: 'bg-green-200 text-green-900 font-bold dark:bg-green-800 dark:text-green-100',
}

const REVIEW_CHECKLIST = [
  'Privacy Policy',
  'Terms of Service',
  'AI disclaimers',
  'Data Processing Agreement (DPA)',
  'Cookie compliance',
  'GDPR data rights flow',
  'EU AI Act classification',
]

export default function LawyerPage() {
  const { lawyer, setLawyer } = useLegalConfigStore()
  const [form, setForm] = useState(lawyer)

  useEffect(() => {
    setForm(lawyer)
  }, [lawyer])

  function handleSave() {
    setLawyer(form)
    toast.success('Legal review configuration saved')
  }

  function updateField<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Legal Review</h1>
          <p className="text-muted-foreground text-sm">
            Track legal consultation and review status
          </p>
        </div>
        <Badge className={STATUS_COLORS[form.reviewStatus] || ''}>
          {form.reviewStatus.charAt(0).toUpperCase() + form.reviewStatus.slice(1)}
        </Badge>
      </div>

      <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20">
        <CardContent className="flex gap-3 pt-6">
          <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-900 dark:text-amber-200">
            <p className="font-medium mb-1">Recommendation</p>
            <p>
              We recommend consulting a tech/AI law specialist. Typical cost: 500-1,500 EUR for a
              full review. A qualified lawyer can ensure your SaaS complies with GDPR, the EU AI
              Act, and local regulations, reducing legal risk significantly.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Scale className="h-5 w-5" />
            Legal Consultation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.hasConsulted}
              onChange={(e) => updateField('hasConsulted', e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            Has consulted with a lawyer
          </Label>

          {form.hasConsulted && (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="lawyerName">Lawyer Name</Label>
                <Input
                  id="lawyerName"
                  placeholder="e.g. Maria Garcia Lopez"
                  value={form.lawyerName}
                  onChange={(e) => updateField('lawyerName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firmName">Law Firm</Label>
                <Input
                  id="firmName"
                  placeholder="e.g. Tech Legal Partners S.L."
                  value={form.firmName}
                  onChange={(e) => updateField('firmName', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="consultationDate">Consultation Date</Label>
                <Input
                  id="consultationDate"
                  type="date"
                  value={form.consultationDate}
                  onChange={(e) => updateField('consultationDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewStatus">Review Status</Label>
                <select
                  id="reviewStatus"
                  value={form.reviewStatus}
                  onChange={(e) => updateField('reviewStatus', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="pending">Pending</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="approved">Approved</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Notes from the consultation..."
                  value={form.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  placeholder="lawyer@firm.com"
                  value={form.contactEmail}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
              Save Legal Review Config
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckCircle2 className="h-5 w-5" />
            Lawyer Review Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">
            Ensure your lawyer reviews all of the following:
          </p>
          <ul className="space-y-2">
            {REVIEW_CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
