'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { useSystemsStore } from '@/stores/systems-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Loader2, Sparkles, AlertTriangle } from 'lucide-react'
import type { RiskCategory, SystemStatus } from '@/types/database'

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

type TabKey = 'overview' | 'classification' | 'status'

export default function SystemDetailPage() {
  const { lang } = useUIStore()
  const { systems, updateSystem } = useSystemsStore()
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const system = systems.find((s) => s.id === id)

  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [reclassifying, setReclassifying] = useState(false)
  const [newStatus, setNewStatus] = useState<SystemStatus | ''>('')

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

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'classification', label: 'Classification' },
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
