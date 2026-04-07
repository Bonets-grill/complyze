'use client'

import Link from 'next/link'
import { useLegalConfigStore } from '@/stores/legal-config-store'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Building2,
  FileCheck,
  Receipt,
  Shield,
  Scale,
  CheckCircle,
  XCircle,
  ArrowRight,
} from 'lucide-react'

export default function AdminPage() {
  const { entity, subprocessors, tax, insurance, lawyer } = useLegalConfigStore()

  const entityDone = !!(entity.companyName && entity.vatId && entity.address && entity.responsiblePerson)
  const entityPartial = !!(entity.companyName || entity.vatId)
  const dpaDone = subprocessors.every((s) => s.dpaSigned)
  const dpaPartial = subprocessors.some((s) => s.dpaSigned)
  const taxDone = !!(tax.vatOssRegistered || tax.stripeTaxEnabled) && !!entity.vatId
  const taxPartial = !!(entity.vatId || tax.vatOssRegistered)
  const insuranceDone = insurance.hasInsurance && !!insurance.provider && !!insurance.policyNumber
  const insurancePartial = insurance.hasInsurance
  const lawyerDone = lawyer.reviewStatus === 'completed' || lawyer.reviewStatus === 'approved'
  const lawyerPartial = lawyer.hasConsulted || lawyer.reviewStatus === 'scheduled'

  const sections = [
    { href: '/admin/legal-entity', icon: Building2, title: 'Legal Entity', desc: 'Company name, address, VAT, responsible person', done: entityDone, partial: entityPartial },
    { href: '/admin/dpa-tracker', icon: FileCheck, title: 'DPA Tracker', desc: 'Data Processing Agreements with subprocessors', done: dpaDone, partial: dpaPartial },
    { href: '/admin/tax', icon: Receipt, title: 'Tax Configuration', desc: 'VAT/IGIC, VAT OSS, Stripe Tax', done: taxDone, partial: taxPartial },
    { href: '/admin/insurance', icon: Shield, title: 'Insurance', desc: 'Professional liability insurance (RC)', done: insuranceDone, partial: insurancePartial },
    { href: '/admin/lawyer', icon: Scale, title: 'Legal Review', desc: 'Lawyer consultation and review status', done: lawyerDone, partial: lawyerPartial },
  ]

  const checklist = [
    { label: 'Privacy Policy page', done: true, detail: '/privacy — 5 languages' },
    { label: 'Terms of Service', done: true, detail: '/terms — AI disclaimer included' },
    { label: 'Cookie consent banner', done: true, detail: 'GDPR opt-in, 3 categories' },
    { label: 'Cookie Policy page', done: true, detail: '/cookies' },
    { label: 'Legal Notice / Imprint', done: entityDone, detail: entityDone ? 'Configured' : 'Fill in Legal Entity' },
    { label: 'Data Processing Agreement', done: true, detail: '/dpa' },
    { label: 'DPAs signed with subprocessors', done: dpaDone, detail: `${subprocessors.filter(s => s.dpaSigned).length}/${subprocessors.length} signed` },
    { label: 'AI transparency disclaimer', done: true, detail: 'EU AI Act Art. 50' },
    { label: 'Registration consent checkboxes', done: true, detail: 'Privacy + Terms + AI' },
    { label: 'GDPR data export/deletion', done: true, detail: 'Settings > Data Rights' },
    { label: 'Company registered', done: !!(entity.companyName && entity.companyType), detail: entity.companyName ? `${entity.companyName} (${entity.companyType})` : 'Register S.L./autónomo' },
    { label: 'VAT/Tax ID', done: !!entity.vatId, detail: entity.vatId || 'Add NIF/CIF' },
    { label: 'VAT OSS registration', done: tax.vatOssRegistered, detail: tax.vatOssRegistered ? tax.vatOssNumber : 'For EU cross-border sales' },
    { label: 'Stripe Tax', done: tax.stripeTaxEnabled, detail: tax.stripeTaxEnabled ? 'Active' : 'Auto tax calculation' },
    { label: 'Professional insurance', done: insuranceDone, detail: insuranceDone ? `${insurance.provider}` : 'Get RC profesional' },
    { label: 'Legal review', done: lawyerDone, detail: lawyerDone ? `${lawyer.lawyerName}` : 'Consult a lawyer' },
  ]

  const doneCount = checklist.filter((c) => c.done).length
  const percentage = Math.round((doneCount / checklist.length) * 100)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Super Admin — Legal Compliance</h1>
        <p className="text-muted-foreground mt-1">Configure your business details. Everything propagates to legal pages automatically.</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Compliance Readiness</span>
            <span className="text-sm font-bold">{doneCount}/{checklist.length} ({percentage}%)</span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${percentage === 100 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-blue-600' : 'bg-yellow-500'}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          {percentage === 100 ? (
            <p className="mt-2 text-sm text-emerald-500 font-medium flex items-center gap-1">
              <CheckCircle className="h-4 w-4" /> All compliance requirements met!
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">{checklist.length - doneCount} items remaining</p>
          )}
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="cursor-pointer transition-colors hover:bg-accent h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <s.icon className="h-8 w-8 text-blue-600" />
                  {s.done ? (
                    <Badge className="bg-emerald-500 text-white">Complete</Badge>
                  ) : s.partial ? (
                    <Badge className="bg-yellow-500 text-white">In Progress</Badge>
                  ) : (
                    <Badge variant="secondary">Not Started</Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-2">{s.title}</CardTitle>
                <CardDescription>{s.desc}</CardDescription>
                <div className="flex items-center gap-1 text-sm text-blue-600 mt-2">
                  Configure <ArrowRight className="h-3 w-3" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Full Compliance Checklist</CardTitle>
          <CardDescription>Everything needed for legal EU operation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-start gap-3">
                {item.done ? (
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
