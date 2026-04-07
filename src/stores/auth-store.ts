'use client'

import { create } from 'zustand'
import type { Profile, Tenant } from '@/types/database'
import type { User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  profile: Profile | null
  tenant: Tenant | null
  loading: boolean
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setTenant: (tenant: Tenant | null) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  profile: null,
  tenant: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setTenant: (tenant) => set({ tenant }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, profile: null, tenant: null, loading: false }),
}))
