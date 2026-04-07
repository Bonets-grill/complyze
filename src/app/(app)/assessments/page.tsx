'use client'

import { useState } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardCheck, Plus, Clock, CheckCircle, AlertTriangle } from 'lucide-react'

export default function AssessmentsPage() {
  const { lang } = useUIStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{T[lang].assessments}</h1>
          <p className="text-muted-foreground mt-1">
            {lang === 'es' ? 'Evaluaciones de riesgo de tus sistemas AI según el EU AI Act' :
             lang === 'fr' ? 'Évaluations des risques de vos systèmes IA selon le EU AI Act' :
             lang === 'de' ? 'Risikobewertungen Ihrer KI-Systeme gemäß dem EU AI Act' :
             lang === 'it' ? 'Valutazioni dei rischi dei tuoi sistemi IA secondo l\'EU AI Act' :
             'Risk assessments of your AI systems according to the EU AI Act'}
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" disabled>
          <Plus className="mr-2 h-4 w-4" />
          {lang === 'es' ? 'Nueva evaluación' : lang === 'fr' ? 'Nouvelle évaluation' : lang === 'de' ? 'Neue Bewertung' : lang === 'it' ? 'Nuova valutazione' : 'New Assessment'}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {lang === 'es' ? 'Total evaluaciones' : 'Total Assessments'}
            </CardTitle>
            <ClipboardCheck className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {lang === 'es' ? 'Pendientes' : 'Pending'}
            </CardTitle>
            <Clock className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {lang === 'es' ? 'Completadas' : 'Completed'}
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent><p className="text-3xl font-bold">0</p></CardContent>
        </Card>
      </div>

      {/* Empty state */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <ClipboardCheck className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {lang === 'es' ? 'No hay evaluaciones aún' : lang === 'fr' ? 'Pas encore d\'évaluations' : lang === 'de' ? 'Noch keine Bewertungen' : lang === 'it' ? 'Nessuna valutazione ancora' : 'No assessments yet'}
          </h3>
          <p className="text-muted-foreground text-center max-w-md mb-4">
            {lang === 'es' ? 'Primero registra un sistema AI en la sección de Sistemas AI, luego podrás realizar evaluaciones de riesgo.' :
             'First register an AI system in the AI Systems section, then you can perform risk assessments.'}
          </p>
          <Badge variant="secondary" className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            {lang === 'es' ? 'Requiere al menos 1 sistema AI registrado' : 'Requires at least 1 registered AI system'}
          </Badge>
        </CardContent>
      </Card>

      {/* How it works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {lang === 'es' ? 'Cómo funciona' : 'How it works'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="text-center p-4">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center mb-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h4 className="font-medium text-sm mb-1">
                {lang === 'es' ? 'Seleccionar sistema' : 'Select system'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {lang === 'es' ? 'Elige el sistema AI a evaluar' : 'Choose the AI system to assess'}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center mb-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h4 className="font-medium text-sm mb-1">
                {lang === 'es' ? 'Responder cuestionario' : 'Answer questionnaire'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {lang === 'es' ? 'Cuestionario adaptativo según categoría de riesgo' : 'Adaptive questionnaire based on risk category'}
              </p>
            </div>
            <div className="text-center p-4">
              <div className="mx-auto h-10 w-10 rounded-full bg-blue-600/10 flex items-center justify-center mb-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h4 className="font-medium text-sm mb-1">
                {lang === 'es' ? 'Obtener recomendaciones' : 'Get recommendations'}
              </h4>
              <p className="text-xs text-muted-foreground">
                {lang === 'es' ? 'AI genera recomendaciones basadas en tus respuestas' : 'AI generates recommendations based on your answers'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
