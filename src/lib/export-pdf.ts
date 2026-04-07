'use client'

export function exportDocumentToPDF(docId: string) {
  window.open(`/documents/preview/${docId}`, '_blank')
}
