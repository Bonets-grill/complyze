'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { useSystemsStore, type AISystemLocal } from '@/stores/systems-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, Search, Cpu, Trash2, Eye, Edit } from 'lucide-react'
import type { RiskCategory, SystemStatus } from '@/types/database'

const RISK_COLORS: Record<RiskCategory, string> = {
  prohibited: 'bg-red-600 text-white',
  high_risk: 'bg-orange-500 text-white',
  limited_risk: 'bg-yellow-500 text-black',
  minimal_risk: 'bg-green-500 text-white',
}

const STATUS_COLORS: Record<SystemStatus, string> = {
  draft: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  compliant: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  non_compliant: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  archived: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}

const STATUS_FILTER_OPTIONS: (SystemStatus | 'all')[] = [
  'all',
  'draft',
  'under_review',
  'compliant',
  'non_compliant',
]

function riskLabel(lang: keyof typeof T, category: RiskCategory | null) {
  if (!category) return '--'
  const map: Record<RiskCategory, keyof typeof T['en']> = {
    prohibited: 'prohibited',
    high_risk: 'highRisk',
    limited_risk: 'limitedRisk',
    minimal_risk: 'minimalRisk',
  }
  return T[lang][map[category]]
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

export default function SystemsPage() {
  const { lang } = useUIStore()
  const { systems, deleteSystem } = useSystemsStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<SystemStatus | 'all'>('all')

  const filtered = systems.filter((sys) => {
    const matchesSearch = sys.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || sys.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const countByCategory = (cat: RiskCategory) =>
    systems.filter((s) => s.category === cat).length

  const handleDelete = (sys: AISystemLocal) => {
    if (window.confirm(`${T[lang].delete} "${sys.name}"?`)) {
      deleteSystem(sys.id)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{T[lang].aiSystems}</h1>
        <Link href="/systems/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            {T[lang].addSystem}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Card size="sm">
          <CardContent className="flex items-center gap-3">
            <Cpu className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">{T[lang].totalSystems}</p>
              <p className="text-xl font-bold">{systems.length}</p>
            </div>
          </CardContent>
        </Card>
        {(['prohibited', 'high_risk', 'limited_risk', 'minimal_risk'] as RiskCategory[]).map((cat) => (
          <Card size="sm" key={cat}>
            <CardContent className="flex items-center gap-3">
              <span className={`inline-block h-3 w-3 rounded-full ${RISK_COLORS[cat].split(' ')[0]}`} />
              <div>
                <p className="text-xs text-muted-foreground">{riskLabel(lang, cat)}</p>
                <p className="text-xl font-bold">{countByCategory(cat)}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`${T[lang].search}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex gap-1.5">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt}
              variant={statusFilter === opt ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter(opt)}
            >
              {opt === 'all' ? T[lang].all : statusLabel(lang, opt)}
            </Button>
          ))}
        </div>
      </div>

      {/* Systems List */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Cpu className="h-8 w-8 text-muted-foreground" />
            </div>
            {systems.length === 0 ? (
              <>
                <h3 className="text-lg font-semibold">Register your first AI system</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Start tracking and classifying the AI systems your organization uses.
                </p>
                <Link href="/systems/new" className="mt-4">
                  <Button>
                    <Plus className="mr-1.5 h-4 w-4" />
                    {T[lang].addSystem}
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted-foreground">No systems match your filters.</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="px-4 py-3 font-medium">{T[lang].name}</th>
                  <th className="px-4 py-3 font-medium">{T[lang].provider}</th>
                  <th className="px-4 py-3 font-medium">{T[lang].riskCategory}</th>
                  <th className="px-4 py-3 font-medium">{T[lang].status}</th>
                  <th className="px-4 py-3 font-medium">{T[lang].date}</th>
                  <th className="px-4 py-3 font-medium">{T[lang].actions}</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((sys) => (
                  <tr key={sys.id} className="border-b last:border-0 hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">
                      <Link href={`/systems/${sys.id}`} className="hover:underline">
                        {sys.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{sys.provider || '--'}</td>
                    <td className="px-4 py-3">
                      {sys.category ? (
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${RISK_COLORS[sys.category]}`}>
                          {riskLabel(lang, sys.category)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[sys.status]}`}>
                        {statusLabel(lang, sys.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(sys.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/systems/${sys.id}`}>
                          <Button variant="ghost" size="icon-xs">
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link href={`/systems/${sys.id}?tab=overview`}>
                          <Button variant="ghost" size="icon-xs">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(sys)}>
                          <Trash2 className="h-3.5 w-3.5 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
