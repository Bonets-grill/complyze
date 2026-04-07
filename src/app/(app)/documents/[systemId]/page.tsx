'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { useSystemsStore } from '@/stores/systems-store'
import { useDocumentsStore, type DocumentLocal } from '@/stores/documents-store'
import { getRequiredDocs, type DocTypeInfo } from '@/lib/doc-templates'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  ArrowLeft,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  RefreshCw,
  Eye,
  Send,
  ShieldCheck,
  Download,
  FileDown,
} from 'lucide-react'
import { exportDocumentToPDF } from '@/lib/export-pdf'
import { toast } from 'sonner'
import type { DocType, DocStatus, RiskCategory } from '@/types/database'

const RISK_COLORS: Record<RiskCategory, string> = {
  prohibited: 'bg-red-600 text-white',
  high_risk: 'bg-orange-500 text-white',
  limited_risk: 'bg-yellow-500 text-black',
  minimal_risk: 'bg-green-500 text-white',
}

const STATUS_BADGE: Record<DocStatus, { variant: 'default' | 'secondary' | 'outline' | 'destructive'; icon: typeof Clock }> = {
  draft: { variant: 'secondary', icon: FileText },
  review: { variant: 'outline', icon: Clock },
  approved: { variant: 'default', icon: CheckCircle2 },
  expired: { variant: 'destructive', icon: Clock },
}

function statusLabel(lang: string, status: DocStatus) {
  const map: Record<DocStatus, { en: string; es: string }> = {
    draft: { en: 'Draft', es: 'Borrador' },
    review: { en: 'In Review', es: 'En revision' },
    approved: { en: 'Approved', es: 'Aprobado' },
    expired: { en: 'Expired', es: 'Expirado' },
  }
  return lang === 'es' ? map[status].es : map[status].en
}

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

export default function SystemDocumentsPage() {
  const params = useParams()
  const systemId = params.systemId as string
  const { lang } = useUIStore()
  const { getSystem } = useSystemsStore()
  const { getDocumentsForSystem, addDocument, updateDocument } = useDocumentsStore()

  const [generatingType, setGeneratingType] = useState<DocType | null>(null)
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)

  const system = getSystem(systemId)

  if (!system) {
    return (
      <div className="space-y-6">
        <Link href="/documents">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {lang === 'es' ? 'Volver' : 'Back'}
          </Button>
        </Link>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <h3 className="text-lg font-semibold">
              {lang === 'es' ? 'Sistema no encontrado' : 'System not found'}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === 'es'
                ? 'El sistema AI solicitado no existe o fue eliminado.'
                : 'The requested AI system does not exist or was deleted.'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const requiredDocs = getRequiredDocs(system.category)
  const existingDocs = getDocumentsForSystem(systemId)

  function findExistingDoc(docType: DocType): DocumentLocal | undefined {
    return existingDocs.find((d) => d.doc_type === docType)
  }

  async function handleGenerate(docInfo: DocTypeInfo) {
    setGeneratingType(docInfo.type)
    try {
      const res = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, docType: docInfo.type }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Generation failed')
      }

      const data = await res.json()

      addDocument({
        ai_system_id: systemId,
        doc_type: docInfo.type,
        title: docInfo.title_en,
        content: data.content,
        version: 1,
        status: 'draft',
        generated_by: 'ai',
        approved_at: null,
      })

      toast.success(
        lang === 'es' ? 'Documento generado correctamente' : 'Document generated successfully'
      )
    } catch (err) {
      toast.error(
        lang === 'es'
          ? `Error al generar: ${(err as Error).message}`
          : `Generation error: ${(err as Error).message}`
      )
    } finally {
      setGeneratingType(null)
    }
  }

  async function handleRegenerate(docInfo: DocTypeInfo, existingDoc: DocumentLocal) {
    setGeneratingType(docInfo.type)
    try {
      const res = await fetch('/api/ai/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, docType: docInfo.type }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || 'Generation failed')
      }

      const data = await res.json()

      updateDocument(existingDoc.id, {
        content: data.content,
        version: existingDoc.version + 1,
        status: 'draft',
        approved_at: null,
      })

      toast.success(
        lang === 'es' ? 'Documento regenerado (v' + (existingDoc.version + 1) + ')' : 'Document regenerated (v' + (existingDoc.version + 1) + ')'
      )
    } catch (err) {
      toast.error(
        lang === 'es'
          ? `Error al regenerar: ${(err as Error).message}`
          : `Regeneration error: ${(err as Error).message}`
      )
    } finally {
      setGeneratingType(null)
    }
  }

  function handleSubmitForReview(doc: DocumentLocal) {
    updateDocument(doc.id, { status: 'review' })
    toast.success(
      lang === 'es' ? 'Enviado a revision' : 'Submitted for review'
    )
  }

  function handleApprove(doc: DocumentLocal) {
    updateDocument(doc.id, {
      status: 'approved',
      approved_at: new Date().toISOString(),
    })
    toast.success(
      lang === 'es' ? 'Documento aprobado' : 'Document approved'
    )
  }

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div>
        <Link href="/documents">
          <Button variant="ghost" size="sm" className="mb-3">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            {lang === 'es' ? 'Volver a documentos' : 'Back to documents'}
          </Button>
        </Link>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{system.name}</h1>
          {system.category && (
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${RISK_COLORS[system.category]}`}
            >
              {riskLabel(lang, system.category)}
            </span>
          )}
        </div>
        <p className="text-muted-foreground mt-1">
          {lang === 'es'
            ? 'Genera y gestiona la documentacion obligatoria para este sistema.'
            : 'Generate and manage mandatory documentation for this system.'}
        </p>
        {existingDocs.length > 0 && (
          <div className="mt-3 flex gap-2">
            {existingDocs.map((d) => (
              <Button
                key={d.id}
                variant="outline"
                size="sm"
                onClick={() => exportDocumentToPDF(d.id)}
              >
                <FileDown className="mr-1.5 h-4 w-4" />
                {d.title.split(' ').slice(0, 3).join(' ')}... PDF
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Required documents */}
      {requiredDocs.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              {lang === 'es'
                ? 'No se requieren documentos para la categoria de riesgo actual. Clasifica el sistema primero.'
                : 'No documents are required for the current risk category. Classify the system first.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {requiredDocs.map((docInfo) => {
            const existingDoc = findExistingDoc(docInfo.type)
            const isGenerating = generatingType === docInfo.type
            const isExpanded = expandedDoc === docInfo.type
            const statusInfo = existingDoc ? STATUS_BADGE[existingDoc.status] : null

            return (
              <Card key={docInfo.type}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">
                          {lang === 'es' ? docInfo.title_es : docInfo.title_en}
                        </CardTitle>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {docInfo.article}
                        </Badge>
                      </div>
                      <CardDescription>
                        {lang === 'es' ? docInfo.description_es : docInfo.description_en}
                      </CardDescription>
                    </div>

                    {/* Status + Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {existingDoc && statusInfo && (
                        <Badge variant={statusInfo.variant}>
                          {statusLabel(lang, existingDoc.status)}
                        </Badge>
                      )}

                      {existingDoc ? (
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setExpandedDoc(isExpanded ? null : docInfo.type)
                            }
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            {lang === 'es' ? 'Ver' : 'View'}
                            {isExpanded ? (
                              <ChevronUp className="ml-1 h-3 w-3" />
                            ) : (
                              <ChevronDown className="ml-1 h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => exportDocumentToPDF(existingDoc.id)}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            PDF
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRegenerate(docInfo, existingDoc)}
                            disabled={isGenerating}
                          >
                            {isGenerating ? (
                              <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                            ) : (
                              <RefreshCw className="mr-1 h-4 w-4" />
                            )}
                            {lang === 'es' ? 'Regenerar' : 'Regenerate'}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleGenerate(docInfo)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                          ) : (
                            <FileText className="mr-1 h-4 w-4" />
                          )}
                          {lang === 'es' ? 'Generar' : 'Generate'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                {/* Expanded content */}
                {isExpanded && existingDoc && (
                  <CardContent className="border-t pt-4">
                    {/* Document content */}
                    <div className="rounded-lg border bg-muted/30 p-4 max-h-[500px] overflow-y-auto mb-4">
                      <pre className="whitespace-pre-wrap text-sm font-sans leading-relaxed">
                        {existingDoc.content}
                      </pre>
                    </div>

                    {/* Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span>
                        {lang === 'es' ? 'Version' : 'Version'}: {existingDoc.version}
                      </span>
                      <span>
                        {lang === 'es' ? 'Generado' : 'Generated'}:{' '}
                        {new Date(existingDoc.created_at).toLocaleDateString()}
                      </span>
                      {existingDoc.approved_at && (
                        <span>
                          {lang === 'es' ? 'Aprobado' : 'Approved'}:{' '}
                          {new Date(existingDoc.approved_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Status workflow buttons */}
                    <div className="flex items-center gap-2">
                      {existingDoc.status === 'draft' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSubmitForReview(existingDoc)}
                        >
                          <Send className="mr-1.5 h-4 w-4" />
                          {lang === 'es' ? 'Enviar a revision' : 'Submit for Review'}
                        </Button>
                      )}
                      {existingDoc.status === 'review' && (
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleApprove(existingDoc)}
                        >
                          <ShieldCheck className="mr-1.5 h-4 w-4" />
                          {lang === 'es' ? 'Aprobar' : 'Approve'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
