'use client'

import { useState } from 'react'
import { Download, Trash2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { LEGAL } from '@/lib/i18n/legal-translations'
import { useUIStore } from '@/stores/ui-store'
import { useAuthStore } from '@/stores/auth-store'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CONFIRM_WORDS: Record<string, string> = {
  en: 'DELETE',
  es: 'ELIMINAR',
  fr: 'SUPPRIMER',
  de: 'LÖSCHEN',
  it: 'ELIMINA',
}

export default function DataRightsPage() {
  const { lang } = useUIStore()
  const { user } = useAuthStore()
  const [confirmText, setConfirmText] = useState('')
  const [exportLoading, setExportLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const confirmWord = CONFIRM_WORDS[lang] ?? CONFIRM_WORDS.en
  const canDelete = confirmText === confirmWord

  function handleExport() {
    setExportLoading(true)
    setTimeout(() => {
      toast.success(LEGAL[lang].gdprExportRequested)
      setExportLoading(false)
    }, 800)
  }

  function handleDelete() {
    if (!canDelete) return
    setDeleteLoading(true)
    setTimeout(() => {
      toast.success(LEGAL[lang].gdprDeleteRequested)
      setDeleteLoading(false)
      setConfirmText('')
    }, 800)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">{LEGAL[lang].gdprDataRights}</h1>

      {/* Export Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-blue-600" />
            {LEGAL[lang].gdprExportData}
          </CardTitle>
          <CardDescription>{LEGAL[lang].gdprExportDataDesc}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleExport} disabled={exportLoading}>
            <Download className="mr-2 h-4 w-4" />
            {exportLoading ? LEGAL[lang].gdprRequestPending : LEGAL[lang].gdprExportData}
          </Button>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <Card className="ring-red-300 dark:ring-red-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <Trash2 className="h-5 w-5" />
            {LEGAL[lang].gdprDeleteAccount}
          </CardTitle>
          <CardDescription>{LEGAL[lang].gdprDeleteAccountDesc}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/30">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <p className="text-sm text-red-700 dark:text-red-300">
              {LEGAL[lang].gdprDeleteWarning}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              {LEGAL[lang].gdprDeleteConfirm}
            </label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText((e.target as HTMLInputElement).value)}
              placeholder={confirmWord}
              className="max-w-xs"
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canDelete || deleteLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteLoading ? LEGAL[lang].gdprRequestPending : LEGAL[lang].gdprDeleteAccount}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
