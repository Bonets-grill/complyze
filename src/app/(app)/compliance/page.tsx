'use client'

import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, CheckSquare, Clock, AlertTriangle, Bell, TrendingUp } from 'lucide-react'

export default function CompliancePage() {
  const { lang } = useUIStore()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{T[lang].compliance}</h1>
        <p className="text-muted-foreground mt-1">
          {lang === 'es' ? 'Vista global del cumplimiento de tu organización con el EU AI Act' :
           'Global view of your organization\'s EU AI Act compliance status'}
        </p>
      </div>

      {/* Compliance score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">{T[lang].complianceScore}</h3>
              <p className="text-sm text-muted-foreground">
                {lang === 'es' ? 'Basado en sistemas registrados, evaluaciones y documentación' :
                 'Based on registered systems, assessments, and documentation'}
              </p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-muted">
              <span className="text-2xl font-bold text-muted-foreground">--%</span>
            </div>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full bg-muted-foreground/20" style={{ width: '0%' }} />
          </div>
        </CardContent>
      </Card>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {T[lang].totalSystems}
            </CardTitle>
            <Shield className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {T[lang].compliantSystems}
            </CardTitle>
            <CheckSquare className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {T[lang].pendingReviews}
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {T[lang].activeAlerts}
            </CardTitle>
            <Bell className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
      </div>

      {/* Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            {lang === 'es' ? 'Fechas clave del EU AI Act' : 'EU AI Act Key Deadlines'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'es' ? 'Prohibiciones de IA (Art. 5)' : 'AI Prohibitions (Art. 5)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === 'es' ? 'Sistemas de IA prohibidos deben cesar' : 'Prohibited AI systems must cease'}
                </p>
              </div>
              <Badge className="bg-red-500 text-white">Feb 2025</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'es' ? 'Modelos de propósito general (Art. 51-52)' : 'General Purpose AI Models (Art. 51-52)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === 'es' ? 'Requisitos de transparencia para GPAI' : 'Transparency requirements for GPAI'}
                </p>
              </div>
              <Badge className="bg-yellow-500 text-white">Aug 2025</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-blue-600/30 bg-blue-600/5">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'es' ? 'Sistemas de alto riesgo (Art. 6-49)' : 'High-Risk AI Systems (Art. 6-49)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === 'es' ? 'Cumplimiento completo obligatorio' : 'Full compliance required'}
                </p>
              </div>
              <Badge className="bg-blue-600 text-white">Aug 2026</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border">
              <div>
                <p className="text-sm font-medium">
                  {lang === 'es' ? 'Sistemas existentes (Anexo III)' : 'Existing Systems (Annex III)'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {lang === 'es' ? 'Sistemas ya en el mercado deben cumplir' : 'Systems already on market must comply'}
                </p>
              </div>
              <Badge variant="secondary">Aug 2027</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Empty state for checklist */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Shield className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {lang === 'es' ? 'Checklist de cumplimiento' : 'Compliance Checklist'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {lang === 'es'
              ? 'El checklist de cumplimiento se generará automáticamente cuando registres y clasifiques tu primer sistema AI.'
              : 'The compliance checklist will be auto-generated when you register and classify your first AI system.'}
          </p>
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {lang === 'es' ? 'Registra un sistema AI para comenzar' : 'Register an AI system to begin'}
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
