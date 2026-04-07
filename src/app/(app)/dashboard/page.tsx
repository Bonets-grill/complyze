'use client'

import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cpu, CheckCircle, Clock, AlertTriangle, Plus, ArrowRight, Shield, FileText, ClipboardCheck } from 'lucide-react'

// Dynamic import to avoid SSR issues with store
import { useEffect, useState } from 'react'

interface SystemStats {
  total: number
  compliant: number
  pending: number
  alerts: number
  byCategory: Record<string, number>
}

export default function DashboardPage() {
  const { lang } = useUIStore()
  const { tenant } = useAuthStore()
  const [stats, setStats] = useState<SystemStats>({ total: 0, compliant: 0, pending: 0, alerts: 0, byCategory: {} })

  useEffect(() => {
    // Load systems from store dynamically
    import('@/stores/systems-store').then(({ useSystemsStore }) => {
      const systems = useSystemsStore.getState().systems
      const total = systems.length
      const compliant = systems.filter(s => s.status === 'compliant').length
      const pending = systems.filter(s => s.status === 'draft' || s.status === 'under_review').length
      const byCategory: Record<string, number> = {}
      systems.forEach(s => {
        if (s.category) byCategory[s.category] = (byCategory[s.category] || 0) + 1
      })
      setStats({ total, compliant, pending, alerts: 0, byCategory })
    }).catch(() => {})
  }, [])

  const statCards = [
    { label: T[lang].totalSystems, value: stats.total.toString(), icon: Cpu, color: 'text-blue-600' },
    { label: T[lang].compliantSystems, value: stats.compliant.toString(), icon: CheckCircle, color: 'text-emerald-500' },
    { label: T[lang].pendingReviews, value: stats.pending.toString(), icon: Clock, color: 'text-yellow-500' },
    { label: T[lang].activeAlerts, value: stats.alerts.toString(), icon: AlertTriangle, color: 'text-red-500' },
  ]

  const quickActions = [
    {
      href: '/systems/new',
      icon: Plus,
      title: lang === 'es' ? 'Registrar sistema AI' : 'Register AI System',
      desc: lang === 'es' ? 'Añade un nuevo sistema a tu registro' : 'Add a new system to your registry',
    },
    {
      href: '/systems',
      icon: Cpu,
      title: lang === 'es' ? 'Ver sistemas' : 'View Systems',
      desc: lang === 'es' ? 'Gestiona tus sistemas registrados' : 'Manage your registered systems',
    },
    {
      href: '/compliance',
      icon: Shield,
      title: lang === 'es' ? 'Estado de cumplimiento' : 'Compliance Status',
      desc: lang === 'es' ? 'Revisa tu progreso de compliance' : 'Check your compliance progress',
    },
    {
      href: '/admin',
      icon: ClipboardCheck,
      title: lang === 'es' ? 'Configuración legal' : 'Legal Configuration',
      desc: lang === 'es' ? 'Configura datos de empresa y DPAs' : 'Configure company data and DPAs',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{T[lang].dashboardTitle}</h1>
          {tenant && <p className="text-muted-foreground">{tenant.name}</p>}
        </div>
        <Link href="/systems/new">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            {T[lang].addSystem}
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance deadline banner */}
      <Card className="border-blue-600/30 bg-blue-600/5">
        <CardContent className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600" />
            <div>
              <p className="font-semibold text-sm">
                {lang === 'es' ? 'EU AI Act — Fecha límite: Agosto 2026' : 'EU AI Act — Deadline: August 2026'}
              </p>
              <p className="text-xs text-muted-foreground">
                {lang === 'es' ? 'Los sistemas de alto riesgo deben cumplir todos los requisitos' :
                 'High-risk AI systems must meet all requirements'}
              </p>
            </div>
          </div>
          <Link href="/compliance">
            <Button variant="outline" size="sm">
              {lang === 'es' ? 'Ver detalles' : 'View Details'}
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          {lang === 'es' ? 'Acciones rápidas' : 'Quick Actions'}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href}>
              <Card className="cursor-pointer transition-colors hover:bg-accent h-full">
                <CardContent className="flex items-center gap-4 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 shrink-0">
                    <action.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.desc}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Risk distribution */}
      {stats.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {lang === 'es' ? 'Distribución por riesgo' : 'Risk Distribution'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              {stats.byCategory.prohibited && (
                <Badge className="bg-red-600 text-white">{T[lang].prohibited}: {stats.byCategory.prohibited}</Badge>
              )}
              {stats.byCategory.high_risk && (
                <Badge className="bg-orange-500 text-white">{T[lang].highRisk}: {stats.byCategory.high_risk}</Badge>
              )}
              {stats.byCategory.limited_risk && (
                <Badge className="bg-yellow-500 text-white">{T[lang].limitedRisk}: {stats.byCategory.limited_risk}</Badge>
              )}
              {stats.byCategory.minimal_risk && (
                <Badge className="bg-emerald-500 text-white">{T[lang].minimalRisk}: {stats.byCategory.minimal_risk}</Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
