'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { useSystemsStore } from '@/stores/systems-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from 'lucide-react'
import type { RiskCategory } from '@/types/database'

const STEPS = ['Basic Info', 'Purpose & Usage', 'AI Classification', 'Review & Confirm'] as const

const RISK_COLORS: Record<RiskCategory, string> = {
  prohibited: 'bg-red-600 text-white',
  high_risk: 'bg-orange-500 text-white',
  limited_risk: 'bg-yellow-500 text-black',
  minimal_risk: 'bg-green-500 text-white',
}

const RISK_LABELS: Record<RiskCategory, string> = {
  prohibited: 'Prohibited',
  high_risk: 'High Risk',
  limited_risk: 'Limited Risk',
  minimal_risk: 'Minimal Risk',
}

interface FormData {
  name: string
  provider: string
  model_name: string
  description: string
  purpose: string
  data_types: string
  users: string
}

interface ClassificationResult {
  category: RiskCategory
  risk_score: number
  reasoning: string
}

export default function NewSystemPage() {
  const { lang } = useUIStore()
  const { addSystem } = useSystemsStore()
  const router = useRouter()

  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>({
    name: '',
    provider: '',
    model_name: '',
    description: '',
    purpose: '',
    data_types: '',
    users: '',
  })
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [classifying, setClassifying] = useState(false)
  const [classifyError, setClassifyError] = useState('')
  const [manualMode, setManualMode] = useState(false)
  const [manualCategory, setManualCategory] = useState<RiskCategory>('minimal_risk')
  const [manualReasoning, setManualReasoning] = useState('')

  const updateForm = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0
    if (step === 1) return form.purpose.trim().length > 0
    if (step === 2) return classification !== null || manualMode
    return true
  }

  const handleClassify = async () => {
    setClassifying(true)
    setClassifyError('')
    try {
      const res = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Classification failed')
      const data = await res.json()
      setClassification({
        category: data.category,
        risk_score: data.risk_score,
        reasoning: data.reasoning,
      })
    } catch {
      setClassifyError('Classification failed. Use manual classification instead.')
    } finally {
      setClassifying(false)
    }
  }

  const handleSave = () => {
    const cat = manualMode ? manualCategory : classification?.category ?? null
    const score = manualMode ? null : classification?.risk_score ?? null
    const reasoning = manualMode
      ? manualReasoning
      : classification?.reasoning ?? ''

    addSystem({
      name: form.name,
      description: form.description,
      provider: form.provider,
      model_name: form.model_name,
      purpose: form.purpose,
      data_types: form.data_types,
      users: form.users,
      category: cat,
      risk_score: score,
      status: 'draft',
      classification_reasoning: reasoning,
      classified_at: cat ? new Date().toISOString() : null,
      completedActions: [],
    })

    router.push('/systems')
  }

  const finalCategory = manualMode ? manualCategory : classification?.category ?? null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/systems">
          <Button variant="ghost" size="icon-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{T[lang].addSystem}</h1>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                i < step
                  ? 'bg-primary text-primary-foreground'
                  : i === step
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary/30'
                    : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`hidden text-xs sm:inline ${i === step ? 'font-semibold' : 'text-muted-foreground'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="hidden h-px w-4 bg-border sm:block" />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="space-y-4 pt-2">
          {step === 0 && (
            <>
              <CardHeader className="px-0">
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">{T[lang].systemName} *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => updateForm('name', e.target.value)}
                    placeholder="e.g., Customer Support Chatbot"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="provider">{T[lang].provider}</Label>
                  <Input
                    id="provider"
                    value={form.provider}
                    onChange={(e) => updateForm('provider', e.target.value)}
                    placeholder="e.g., OpenAI, Google, Anthropic, Custom"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="model_name">{T[lang].model}</Label>
                  <Input
                    id="model_name"
                    value={form.model_name}
                    onChange={(e) => updateForm('model_name', e.target.value)}
                    placeholder="e.g., GPT-4, Gemini Pro, Claude 3.5"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">{T[lang].description}</Label>
                  <textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => updateForm('description', e.target.value)}
                    placeholder="Brief description of this AI system..."
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                </div>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <CardHeader className="px-0">
                <CardTitle>Purpose & Usage</CardTitle>
              </CardHeader>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="purpose">{T[lang].purpose} *</Label>
                  <textarea
                    id="purpose"
                    value={form.purpose}
                    onChange={(e) => updateForm('purpose', e.target.value)}
                    placeholder="What does this AI system do? What is its use case?"
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                </div>
                <div>
                  <Label htmlFor="data_types">Data Types Processed</Label>
                  <textarea
                    id="data_types"
                    value={form.data_types}
                    onChange={(e) => updateForm('data_types', e.target.value)}
                    placeholder="What kind of data does this system process? (e.g., personal data, biometric data, financial records...)"
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                </div>
                <div>
                  <Label htmlFor="users">Users</Label>
                  <textarea
                    id="users"
                    value={form.users}
                    onChange={(e) => updateForm('users', e.target.value)}
                    placeholder="Who uses this system? (e.g., marketing team, customer service, all employees...)"
                    rows={2}
                    className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <CardHeader className="px-0">
                <CardTitle>AI Risk Classification</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                {!classification && !manualMode && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Classify this AI system according to the EU AI Act risk framework. You can use
                      AI-powered classification or classify manually.
                    </p>
                    <div className="flex gap-2">
                      <Button onClick={handleClassify} disabled={classifying}>
                        {classifying ? (
                          <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="mr-1.5 h-4 w-4" />
                        )}
                        {classifying ? 'Classifying...' : 'Classify with AI'}
                      </Button>
                      <Button variant="outline" onClick={() => setManualMode(true)}>
                        Manual Classification
                      </Button>
                    </div>
                    {classifyError && (
                      <p className="text-sm text-red-500">{classifyError}</p>
                    )}
                  </div>
                )}

                {classification && !manualMode && (
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Classification Result</h3>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_COLORS[classification.category]}`}>
                        {RISK_LABELS[classification.category]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Risk Score:</span>
                      <span className="font-bold">{classification.risk_score}/100</span>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Reasoning:</span>
                      <p className="mt-1 text-sm">{classification.reasoning}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setClassification(null)
                        setManualMode(false)
                      }}
                    >
                      Re-classify
                    </Button>
                  </div>
                )}

                {manualMode && (
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Manual Classification</h3>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setManualMode(false)}
                      >
                        Use AI instead
                      </Button>
                    </div>
                    <div>
                      <Label htmlFor="manualCategory">{T[lang].riskCategory}</Label>
                      <select
                        id="manualCategory"
                        value={manualCategory}
                        onChange={(e) => setManualCategory(e.target.value as RiskCategory)}
                        className="mt-1 h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                      >
                        <option value="prohibited">{RISK_LABELS.prohibited}</option>
                        <option value="high_risk">{RISK_LABELS.high_risk}</option>
                        <option value="limited_risk">{RISK_LABELS.limited_risk}</option>
                        <option value="minimal_risk">{RISK_LABELS.minimal_risk}</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="manualReasoning">Reasoning</Label>
                      <textarea
                        id="manualReasoning"
                        value={manualReasoning}
                        onChange={(e) => setManualReasoning(e.target.value)}
                        placeholder="Why did you choose this risk category?"
                        rows={3}
                        className="mt-1 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <CardHeader className="px-0">
                <CardTitle>Review & Confirm</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground">{T[lang].systemName}</p>
                    <p className="font-medium">{form.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{T[lang].provider}</p>
                    <p className="font-medium">{form.provider || '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{T[lang].model}</p>
                    <p className="font-medium">{form.model_name || '--'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{T[lang].riskCategory}</p>
                    {finalCategory ? (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${RISK_COLORS[finalCategory]}`}>
                        {RISK_LABELS[finalCategory]}
                      </span>
                    ) : (
                      <p className="font-medium">Not classified</p>
                    )}
                  </div>
                </div>
                {form.description && (
                  <div>
                    <p className="text-xs text-muted-foreground">{T[lang].description}</p>
                    <p className="text-sm">{form.description}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">{T[lang].purpose}</p>
                  <p className="text-sm">{form.purpose}</p>
                </div>
                {form.data_types && (
                  <div>
                    <p className="text-xs text-muted-foreground">Data Types</p>
                    <p className="text-sm">{form.data_types}</p>
                  </div>
                )}
                {form.users && (
                  <div>
                    <p className="text-xs text-muted-foreground">Users</p>
                    <p className="text-sm">{form.users}</p>
                  </div>
                )}
                {(classification?.reasoning || manualReasoning) && (
                  <div>
                    <p className="text-xs text-muted-foreground">Classification Reasoning</p>
                    <p className="text-sm">{manualMode ? manualReasoning : classification?.reasoning}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          {T[lang].back}
        </Button>
        {step < 3 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            {T[lang].next}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSave}>
            <Check className="mr-1.5 h-4 w-4" />
            {T[lang].save}
          </Button>
        )}
      </div>
    </div>
  )
}
