'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Lang } from '@/types/database'

interface UIState {
  lang: Lang
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  setLang: (lang: Lang) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebarCollapsed: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      lang: 'en',
      sidebarOpen: false,
      sidebarCollapsed: false,
      setLang: (lang) => set({ lang }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebarCollapsed: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
    }),
    { name: 'complyze_ui' }
  )
)
