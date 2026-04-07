'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { useSystemsStore } from '@/stores/systems-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Sparkles, AlertTriangle, CheckCircle, Circle, Shield } from 'lucide-react'
import { getActionsForCategory, getComplianceScore, type ComplianceAction } from '@/lib/compliance-actions'
import { getRequiredDocs } from '@/lib/doc-templates'
import { useDocumentsStore } from '@/stores/documents-store'
import type { RiskCategory, SystemStatus, DocType } from '@/types/database'

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

const STATUS_COLORS: Record<SystemStatus, string> = {
  draft: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  compliant: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  non_compliant: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

function statusLabel(lang: keyof typeof T, status: SystemStatus) {
  const map: Record<SystemStatus, keyof typeof T['en']> = {
    draft: 'draft',
    under_review: 'underReview',
    compliant: 'compliant',
    non_compliant: 'nonCompliant',
    archived: 'archived',
  }
  return T[lang][map[status]]
}

type TabKey = 'overview' | 'classification' | 'actions' | 'status'

export default function SystemDetailPage() {
  const { lang } = useUIStore()
  const { systems, updateSystem, toggleAction } = useSystemsStore()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const system = systems.find((s) => s.id === id)

  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [reclassifying, setReclassifying] = useState(false)
  const [newStatus, setNewStatus] = useState<SystemStatus | ''>('')
  const [autoComplying, setAutoComplying] = useState(false)
  const [autoProgress, setAutoProgress] = useState('')
  const { addDocument, documents } = useDocumentsStore()

  if (!system) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">System not found</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          This AI system does not exist or has been deleted.
        </p>
        <Link href="/systems" className="mt-4">
          <Button variant="outline">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {T[lang].back}
          </Button>
        </Link>
      </div>
    )
  }

  const handleReclassify = async () => {
    setReclassifying(true)
    try {
      const res = await fetch('/api/ai/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: system.name,
          description: system.description,
          provider: system.provider,
          model_name: system.model_name,
          purpose: system.purpose,
          data_types: system.data_types,
          users: system.users,
        }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      updateSystem(id, {
        category: data.category,
        risk_score: data.risk_score,
        classification_reasoning: data.reasoning,
        classified_at: new Date().toISOString(),
      })
    } catch {
      // silently fail
    } finally {
      setReclassifying(false)
    }
  }

  const handleStatusChange = (status: SystemStatus) => {
    updateSystem(id, { status })
    setNewStatus('')
  }

  const handleAutoComply = async () => {
    if (!system.category) return
    setAutoComplying(true)

    try {
      // Step 1: Complete all actions
      setAutoProgress(lang === 'es' ? 'Completando acciones de cumplimiento...' : 'Completing compliance actions...')
      const allActions = getActionsForCategory(system.category)
      const allActionIds = allActions.map(a => a.id)
      const currentCompleted = system.completedActions || []
      const missing = allActionIds.filter(id => !currentCompleted.includes(id))
      if (missing.length > 0) {
        updateSystem(id, { completedActions: allActionIds })
      }
      await new Promise(r => setTimeout(r, 500))

      // Step 2: Generate all required documents
      const requiredDocs = getRequiredDocs(system.category)
      const existingDocs = documents.filter(d => d.ai_system_id === id)

      for (const docInfo of requiredDocs) {
        const exists = existingDocs.some(d => d.doc_type === docInfo.type)
        if (exists) continue

        setAutoProgress(lang === 'es'
          ? `Generando: ${docInfo.title_es}...`
          : `Generating: ${docInfo.title_en}...`)

        try {
          const res = await fetch('/api/ai/generate-document', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ system, docType: docInfo.type }),
          })

          if (res.ok) {
            const data = await res.json()
            addDocument({
              ai_system_id: id,
              doc_type: docInfo.type as DocType,
              title: docInfo.title_en,
              content: data.content,
              version: 1,
              status: 'approved',
              generated_by: 'ai',
              approved_at: new Date().toISOString(),
            })
          }
        } catch {
          // Continue with next doc
        }
        await new Promise(r => setTimeout(r, 300))
      }

      // Step 3: Set status to compliant
      setAutoProgress(lang === 'es' ? 'Marcando como conforme...' : 'Setting status to compliant...')
      updateSystem(id, { status: 'compliant' })
      await new Promise(r => setTimeout(r, 500))

      setAutoProgress(lang === 'es' ? 'Cumplimiento completo!' : 'Compliance complete!')
    } catch {
      setAutoProgress(lang === 'es' ? 'Error — intente de nuevo' : 'Error — try again')
    } finally {
      setTimeout(() => {
        setAutoComplying(false)
        setAutoProgress('')
      }, 1500)
    }
  }

  const actions = getActionsForCategory(system.category)
  const completedActions = system.completedActions || []
  const complianceScore = getComplianceScore(system.category, completedActions)

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'classification', label: 'Classification' },
    { key: 'actions', label: `Action Plan (${completedActions.length}/${actions.length})` },
    { key: 'status', label: T[lang].status },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Link href="/systems">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{system.name}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[system.status]}`}>
                {statusLabel(lang, system.status)}
              </span>
              {system.category && (
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RISK_COLORS[system.category]}`}>
                  {RISK_LABELS[system.category]}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* One-Click Compliance */}
      {system.category && system.status !== 'compliant' && (
        <Card className="border-blue-600/30 bg-blue-600/5">
          <CardContent className="flex items-center justify-between py-4">
            <div>
              <p className="font-semibold text-sm">
                {lang === 'es' ? 'Cumplimiento automático' : 'Automatic Compliance'}
              </p>
              <p className="text-xs text-muted-foreground">
                {autoProgress || (lang === 'es'
                  ? 'Completa todas las acciones, genera todos los documentos y marca como conforme — con un solo clic.'
                  : 'Complete all actions, generate all documents, and mark as compliant — with one click.')}
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 shrink-0"
              onClick={handleAutoComply}
              disabled={autoComplying}
            >
              {autoComplying ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              {autoComplying
                ? (lang === 'es' ? 'Procesando...' : 'Processing...')
                : (lang === 'es' ? 'Completar cumplimiento' : 'Complete Compliance')}
            </Button>
          </CardContent>
        </Card>
      )}

      {system.status === 'compliant' && complianceScore === 100 && (
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="flex items-center gap-3 py-4">
            <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
            <div>
              <p className="font-semibold text-sm text-emerald-600 dark:text-emerald-400">
                {lang === 'es' ? 'Sistema conforme con el EU AI Act' : 'System compliant with EU AI Act'}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === 'es'
                  ? 'Todas las acciones completadas, todos los documentos generados y aprobados.'
                  : 'All actions completed, all documents generated and approved.'}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-primary text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{T[lang].systemName}</p>
                <p className="font-medium">{system.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{T[lang].provider}</p>
                <p className="font-medium">{system.provider || '--'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{T[lang].model}</p>
                <p className="font-medium">{system.model_name || '--'}</p>
              </div>
              {system.description && (
                <div>
                  <p className="text-xs text-muted-foreground">{T[lang].description}</p>
                  <p className="text-sm">{system.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Purpose & Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">{T[lang].purpose}</p>
                <p className="text-sm">{system.purpose || '--'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Data Types</p>
                <p className="text-sm">{system.data_types || '--'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Users</p>
                <p className="text-sm">{system.users || '--'}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">{new Date(system.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p className="text-sm">{new Date(system.updated_at).toLocaleString()}</p>
                </div>
                {system.classified_at && (
                  <div>
                    <p className="text-xs text-muted-foreground">Classified</p>
                    <p className="text-sm">{new Date(system.classified_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'classification' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Classification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {system.category ? (
                <>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{T[lang].riskCategory}</p>
                      <span className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${RISK_COLORS[system.category]}`}>
                        {RISK_LABELS[system.category]}
                      </span>
                    </div>
                    {system.risk_score !== null && (
                      <div>
                        <p className="text-xs text-muted-foreground">Risk Score</p>
                        <p className="mt-1 text-2xl font-bold">{system.risk_score}<span className="text-sm text-muted-foreground">/100</span></p>
                      </div>
                    )}
                  </div>
                  {system.classification_reasoning && (
                    <div>
                      <p className="text-xs text-muted-foreground">Reasoning</p>
                      <p className="mt-1 text-sm leading-relaxed">{system.classification_reasoning}</p>
                    </div>
                  )}
                  {system.classified_at && (
                    <p className="text-xs text-muted-foreground">
                      Classified on {new Date(system.classified_at).toLocaleString()}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This system has not been classified yet.
                </p>
              )}
              <Button onClick={handleReclassify} disabled={reclassifying} variant="outline">
                {reclassifying ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-1.5 h-4 w-4" />
                )}
                {system.category ? 'Reclassify' : 'Classify with AI'}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'actions' && (
        <div className="space-y-4">
          {/* Compliance score */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">
                    {lang === 'es' ? 'Puntuación de cumplimiento' : 'Compliance Score'}
                  </span>
                </div>
                <span className="text-sm font-bold">{complianceScore}%</span>
              </div>
              <div className="h-3 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    complianceScore === 100 ? 'bg-emerald-500' : complianceScore >= 50 ? 'bg-blue-600' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${complianceScore}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {completedActions.length}/{actions.length} {lang === 'es' ? 'acciones completadas' : 'actions completed'}
                {complianceScore === 100 && (
                  <span className="ml-2 text-emerald-500 font-medium">
                    {lang === 'es' ? '— Cumplimiento completo' : '— Fully compliant'}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>

          {/* Actions by priority */}
          {(['critical', 'high', 'medium', 'low'] as const).map((priority) => {
            const priorityActions = actions.filter(a => a.priority === priority)
            if (priorityActions.length === 0) return null
            const priorityLabels = {
              critical: { en: 'Critical', es: 'Crítico', color: 'bg-red-500 text-white' },
              high: { en: 'High', es: 'Alto', color: 'bg-orange-500 text-white' },
              medium: { en: 'Medium', es: 'Medio', color: 'bg-yellow-500 text-black' },
              low: { en: 'Low', es: 'Bajo', color: 'bg-gray-400 text-white' },
            }
            const pl = priorityLabels[priority]
            return (
              <Card key={priority}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Badge className={pl.color}>{lang === 'es' ? pl.es : pl.en}</Badge>
                    <CardTitle className="text-sm">
                      {lang === 'es' ? 'Prioridad' : 'Priority'}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {priorityActions.map((action) => {
                      const isDone = completedActions.includes(action.id)
                      return (
                        <button
                          key={action.id}
                          className="flex items-start gap-3 w-full text-left p-3 rounded-lg border transition-colors hover:bg-accent"
                          onClick={() => toggleAction(id, action.id)}
                        >
                          {isDone ? (
                            <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>
                                {lang === 'es' ? action.title_es : action.title_en}
                              </p>
                              <Badge variant="secondary" className="text-xs shrink-0">{action.article}</Badge>
                            </div>
                            <p className={`text-xs mt-1 ${isDone ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                              {lang === 'es' ? action.description_es : action.description_en}
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {actions.length === 0 && (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">
                  {lang === 'es' ? 'Clasifica el sistema primero para ver las acciones requeridas.' : 'Classify the system first to see required actions.'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === 'status' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${STATUS_COLORS[system.status]}`}>
                  {statusLabel(lang, system.status)}
                </span>
              </div>

              <div>
                <Label htmlFor="changeStatus">Change Status</Label>
                <div className="mt-1 flex items-center gap-2">
                  <select
                    id="changeStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as SystemStatus)}
                    className="h-8 w-full max-w-xs rounded-lg border border-input bg-transparent px-2.5 text-sm focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
                  >
                    <option value="">Select new status...</option>
                    {(['draft', 'under_review', 'compliant', 'non_compliant', 'archived'] as SystemStatus[])
                      .filter((s) => s !== system.status)
                      .map((s) => (
                        <option key={s} value={s}>
                          {statusLabel(lang, s)}
                        </option>
                      ))}
                  </select>
                  <Button
                    size="sm"
                    disabled={!newStatus}
                    onClick={() => newStatus && handleStatusChange(newStatus as SystemStatus)}
                  >
                    {T[lang].save}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">System created</p>
                    <p className="text-xs text-muted-foreground">{new Date(system.created_at).toLocaleString()}</p>
                  </div>
                </div>
                {system.classified_at && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm font-medium">Risk classified: {system.category ? RISK_LABELS[system.category] : '--'}</p>
                      <p className="text-xs text-muted-foreground">{new Date(system.classified_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
                {system.updated_at !== system.created_at && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Last updated</p>
                      <p className="text-xs text-muted-foreground">{new Date(system.updated_at).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
