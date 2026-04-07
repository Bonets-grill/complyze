'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RiskCategory, SystemStatus } from '@/types/database'

export interface AISystemLocal {
  id: string
  name: string
  description: string
  provider: string
  model_name: string
  purpose: string
  data_types: string
  users: string
  category: RiskCategory | null
  risk_score: number | null
  status: SystemStatus
  classification_reasoning: string
  classified_at: string | null
  completedActions: string[]
  created_at: string
  updated_at: string
}

interface SystemsState {
  systems: AISystemLocal[]
  addSystem: (system: Omit<AISystemLocal, 'id' | 'created_at' | 'updated_at'>) => string
  updateSystem: (id: string, data: Partial<AISystemLocal>) => void
  deleteSystem: (id: string) => void
  getSystem: (id: string) => AISystemLocal | undefined
  toggleAction: (systemId: string, actionId: string) => void
}

export const useSystemsStore = create<SystemsState>()(
  persist(
    (set, get) => ({
      systems: [],
      addSystem: (system) => {
        const id = crypto.randomUUID()
        const now = new Date().toISOString()
        const newSystem: AISystemLocal = {
          ...system,
          id,
          created_at: now,
          updated_at: now,
        }
        set((s) => ({ systems: [...s.systems, newSystem] }))
        return id
      },
      updateSystem: (id, data) =>
        set((s) => ({
          systems: s.systems.map((sys) =>
            sys.id === id
              ? { ...sys, ...data, updated_at: new Date().toISOString() }
              : sys
          ),
        })),
      deleteSystem: (id) =>
        set((s) => ({ systems: s.systems.filter((sys) => sys.id !== id) })),
      getSystem: (id) => get().systems.find((sys) => sys.id === id),
      toggleAction: (systemId, actionId) =>
        set((s) => ({
          systems: s.systems.map((sys) => {
            if (sys.id !== systemId) return sys
            const completed = sys.completedActions || []
            const has = completed.includes(actionId)
            return {
              ...sys,
              completedActions: has ? completed.filter((a) => a !== actionId) : [...completed, actionId],
              updated_at: new Date().toISOString(),
            }
          }),
        })),
    }),
    { name: 'complyze_systems' }
  )
)
