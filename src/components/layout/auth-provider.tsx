'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import type { Profile, Tenant } from '@/types/database'

function isDemoSession(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes('complyze_demo_session=true')
}

const DEMO_PROFILE: Profile = {
  id: 'demo-user-001',
  tenant_id: 'demo-tenant-001',
  email: 'admin@complyze.eu',
  full_name: 'Admin Complyze',
  role: 'owner',
  avatar_url: null,
  created_at: new Date().toISOString(),
}

const DEMO_TENANT: Tenant = {
  id: 'demo-tenant-001',
  name: 'Complyze Demo',
  slug: 'complyze-demo',
  plan: 'enterprise',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  settings: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setTenant, setLoading } = useAuthStore()

  useEffect(() => {
    async function loadSession() {
      // Check demo session first
      if (isDemoSession()) {
        setUser({ id: 'demo-user-001', email: 'admin@complyze.eu' } as never)
        setProfile(DEMO_PROFILE)
        setTenant(DEMO_TENANT)
        setLoading(false)
        return
      }

      // Try Supabase auth
      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)

        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          if (profile) {
            setProfile(profile as unknown as Profile)
            const { data: tenant } = await supabase
              .from('tenants')
              .select('*')
              .eq('id', (profile as unknown as Profile).tenant_id)
              .single()
            setTenant(tenant as unknown as Tenant | null)
          }
        }
      } catch {
        // Supabase not configured
      }
      setLoading(false)
    }

    loadSession()
  }, [setUser, setProfile, setTenant, setLoading])

  return <>{children}</>
}
