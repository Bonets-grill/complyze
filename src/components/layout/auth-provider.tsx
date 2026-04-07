'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/stores/auth-store'
import type { Profile, Tenant } from '@/types/database'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setTenant, setLoading } = useAuthStore()

  useEffect(() => {
    const supabase = createClient()

    async function loadSession() {
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
      setLoading(false)
    }

    loadSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (!session?.user) {
          setProfile(null)
          setTenant(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [setUser, setProfile, setTenant, setLoading])

  return <>{children}</>
}
