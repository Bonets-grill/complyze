'use client'

import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Cpu, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function DashboardPage() {
  const { lang } = useUIStore()
  const { tenant } = useAuthStore()

  const stats = [
    { label: T[lang].totalSystems, value: '0', icon: Cpu, color: 'text-blue-600' },
    { label: T[lang].compliantSystems, value: '0', icon: CheckCircle, color: 'text-emerald-500' },
    { label: T[lang].pendingReviews, value: '0', icon: Clock, color: 'text-yellow-500' },
    { label: T[lang].activeAlerts, value: '0', icon: AlertTriangle, color: 'text-red-500' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{T[lang].dashboardTitle}</h1>
        {tenant && (
          <p className="text-muted-foreground">{tenant.name}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{T[lang].complianceScore}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-8 border-muted">
                <span className="text-3xl font-bold">--</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{T[lang].recentActivity}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="py-8 text-center text-muted-foreground">
              {T[lang].noAccount ? '' : ''}
              --
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
