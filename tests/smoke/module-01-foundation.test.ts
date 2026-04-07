import { describe, it, expect } from 'vitest'
import { T, LANGUAGES } from '@/lib/i18n/translations'
import type { Lang } from '@/types/database'

describe('Module 1: Foundation & Auth', () => {
  // i18n tests
  describe('i18n — 5 languages', () => {
    const langs: Lang[] = ['es', 'en', 'fr', 'de', 'it']

    it('should have all 5 languages defined', () => {
      expect(LANGUAGES).toHaveLength(5)
      for (const lang of langs) {
        expect(T[lang]).toBeDefined()
      }
    })

    it('should have all translation keys in every language', () => {
      const enKeys = Object.keys(T.en)
      for (const lang of langs) {
        const langKeys = Object.keys(T[lang])
        expect(langKeys).toEqual(enKeys)
      }
    })

    it('should have non-empty values for all keys in all languages', () => {
      const enKeys = Object.keys(T.en) as (keyof typeof T['en'])[]
      for (const lang of langs) {
        for (const key of enKeys) {
          expect(T[lang][key], `Missing ${lang}.${key}`).toBeTruthy()
        }
      }
    })

    it('should have unique values per language (not all identical to EN)', () => {
      for (const lang of langs) {
        if (lang === 'en') continue
        // At least some keys should differ from English
        const enKeys = Object.keys(T.en) as (keyof typeof T['en'])[]
        const differentKeys = enKeys.filter(k => T[lang][k] !== T.en[k])
        expect(differentKeys.length).toBeGreaterThan(10)
      }
    })
  })

  // Auth flow structure tests
  describe('Auth pages exist', () => {
    it('login page module should be importable', async () => {
      const mod = await import('@/app/(auth)/login/page')
      expect(mod.default).toBeDefined()
    })

    it('register page module should be importable', async () => {
      const mod = await import('@/app/(auth)/register/page')
      expect(mod.default).toBeDefined()
    })

    it('forgot-password page module should be importable', async () => {
      const mod = await import('@/app/(auth)/forgot-password/page')
      expect(mod.default).toBeDefined()
    })
  })

  // Layout components
  describe('Layout components', () => {
    it('sidebar should be importable', async () => {
      const mod = await import('@/components/layout/sidebar')
      expect(mod.Sidebar).toBeDefined()
    })

    it('header should be importable', async () => {
      const mod = await import('@/components/layout/header')
      expect(mod.Header).toBeDefined()
    })

    it('breadcrumbs should be importable', async () => {
      const mod = await import('@/components/layout/breadcrumbs')
      expect(mod.Breadcrumbs).toBeDefined()
    })

    it('auth-provider should be importable', async () => {
      const mod = await import('@/components/layout/auth-provider')
      expect(mod.AuthProvider).toBeDefined()
    })

    it('theme-toggle should be importable', async () => {
      const mod = await import('@/components/layout/theme-toggle')
      expect(mod.ThemeToggle).toBeDefined()
    })

    it('language-switcher should be importable', async () => {
      const mod = await import('@/components/layout/language-switcher')
      expect(mod.LanguageSwitcher).toBeDefined()
    })
  })

  // Stores
  describe('Zustand stores', () => {
    it('auth store should have correct initial state', async () => {
      const { useAuthStore } = await import('@/stores/auth-store')
      const state = useAuthStore.getState()
      expect(state.user).toBeNull()
      expect(state.profile).toBeNull()
      expect(state.tenant).toBeNull()
      expect(state.loading).toBe(true)
    })

    it('ui store should have correct initial state', async () => {
      const { useUIStore } = await import('@/stores/ui-store')
      const state = useUIStore.getState()
      expect(state.lang).toBeDefined()
      expect(typeof state.sidebarOpen).toBe('boolean')
      expect(typeof state.sidebarCollapsed).toBe('boolean')
    })

    it('ui store lang setter should work', async () => {
      const { useUIStore } = await import('@/stores/ui-store')
      useUIStore.getState().setLang('fr')
      expect(useUIStore.getState().lang).toBe('fr')
      useUIStore.getState().setLang('en') // reset
    })
  })

  // Role types
  describe('Roles and permissions types', () => {
    it('should define correct role types', async () => {
      // Type-level check: if this compiles, the types are correct
      const roles: import('@/types/database').Role[] = ['owner', 'admin', 'member', 'viewer']
      expect(roles).toHaveLength(4)
    })

    it('should define correct plan types', async () => {
      const plans: import('@/types/database').Plan[] = ['trial', 'starter', 'professional', 'enterprise']
      expect(plans).toHaveLength(4)
    })
  })

  // App pages
  describe('App pages exist', () => {
    it('dashboard page should be importable', async () => {
      const mod = await import('@/app/(app)/dashboard/page')
      expect(mod.default).toBeDefined()
    })

    it('settings page should be importable', async () => {
      const mod = await import('@/app/(app)/settings/page')
      expect(mod.default).toBeDefined()
    })

    it('settings/profile page should be importable', async () => {
      const mod = await import('@/app/(app)/settings/profile/page')
      expect(mod.default).toBeDefined()
    })

    it('settings/tenant page should be importable', async () => {
      const mod = await import('@/app/(app)/settings/tenant/page')
      expect(mod.default).toBeDefined()
    })

    it('settings/team page should be importable', async () => {
      const mod = await import('@/app/(app)/settings/team/page')
      expect(mod.default).toBeDefined()
    })
  })

  // Landing page
  describe('Landing page', () => {
    it('marketing page should be importable', async () => {
      const mod = await import('@/app/(marketing)/page')
      expect(mod.default).toBeDefined()
    })
  })

  // Database types
  describe('Database types', () => {
    it('should export all entity interfaces', async () => {
      const types = await import('@/types/database')
      // Type-level validation — these exist if the import doesn't fail
      expect(types).toBeDefined()
    })
  })

  // Supabase client
  describe('Supabase client', () => {
    it('client module should be importable', async () => {
      const mod = await import('@/lib/supabase/client')
      expect(mod.createClient).toBeDefined()
    })
  })

  // Migration exists
  describe('DB migration', () => {
    it('foundation migration should exist', () => {
      const fs = require('fs')
      const exists = fs.existsSync(
        require('path').resolve(__dirname, '../../supabase/migrations/001_foundation.sql')
      )
      expect(exists).toBe(true)
    })
  })
})
