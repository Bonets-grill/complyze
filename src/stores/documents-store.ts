'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DocType, DocStatus } from '@/types/database'

export interface DocumentLocal {
  id: string
  ai_system_id: string
  doc_type: DocType
  title: string
  content: string
  version: number
  status: DocStatus
  generated_by: 'ai' | 'manual'
  approved_at: string | null
  created_at: string
  updated_at: string
}

interface DocumentsState {
  documents: DocumentLocal[]
  addDocument: (doc: Omit<DocumentLocal, 'id' | 'created_at' | 'updated_at'>) => string
  updateDocument: (id: string, data: Partial<DocumentLocal>) => void
  deleteDocument: (id: string) => void
  getDocumentsForSystem: (systemId: string) => DocumentLocal[]
  getDocument: (id: string) => DocumentLocal | undefined
}

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      documents: [],
      addDocument: (doc) => {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        set((s) => ({
          documents: [...s.documents, { ...doc, id, created_at: now, updated_at: now }],
        }))
        return id
      },
      updateDocument: (id, data) =>
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, ...data, updated_at: new Date().toISOString() } : d
          ),
        })),
      deleteDocument: (id) =>
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) })),
      getDocumentsForSystem: (systemId) =>
        get().documents.filter((d) => d.ai_system_id === systemId),
      getDocument: (id) => get().documents.find((d) => d.id === id),
    }),
    { name: 'complyze_documents' }
  )
)
