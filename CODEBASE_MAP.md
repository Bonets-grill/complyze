# CODEBASE_MAP.md — Complyze

> Auto-generated on 2026-04-07 by `node scripts/generate-codemap.js`

## Overview

- **Project**: Complyze — EU AI Act Compliance Platform
- **Stack**: Next.js 16 + React 19 + Supabase + Tailwind 4 + shadcn/ui + Zustand
- **Total source files**: 43
- **Pages**: 14
- **API Routes**: 1
- **Components**: 14
- **Stores**: 2

## Pages

| Route | File |
|-------|------|
| `/` | `src/app/.../(marketing)/page.tsx` |
| `/assessments` | `src/app/.../assessments/page.tsx` |
| `/compliance` | `src/app/.../compliance/page.tsx` |
| `/dashboard` | `src/app/.../dashboard/page.tsx` |
| `/documents` | `src/app/.../documents/page.tsx` |
| `/forgot-password` | `src/app/.../forgot-password/page.tsx` |
| `/knowledge-base` | `src/app/.../knowledge-base/page.tsx` |
| `/login` | `src/app/.../login/page.tsx` |
| `/register` | `src/app/.../register/page.tsx` |
| `/settings` | `src/app/.../settings/page.tsx` |
| `/settings/profile` | `src/app/.../settings/profile/page.tsx` |
| `/settings/team` | `src/app/.../settings/team/page.tsx` |
| `/settings/tenant` | `src/app/.../settings/tenant/page.tsx` |
| `/systems` | `src/app/.../systems/page.tsx` |

## API Routes

| Endpoint | File |
|----------|------|
| `/api/auth/callback` | `src/app/api/auth/callback/route.ts` |

## Components

| File |
|------|
| `src/components/layout/auth-provider.tsx` |
| `src/components/layout/breadcrumbs.tsx` |
| `src/components/layout/header.tsx` |
| `src/components/layout/language-switcher.tsx` |
| `src/components/layout/sidebar.tsx` |
| `src/components/layout/theme-toggle.tsx` |
| `src/components/ui/avatar.tsx` |
| `src/components/ui/badge.tsx` |
| `src/components/ui/button.tsx` |
| `src/components/ui/card.tsx` |
| `src/components/ui/dropdown-menu.tsx` |
| `src/components/ui/input.tsx` |
| `src/components/ui/label.tsx` |
| `src/components/ui/sonner.tsx` |

## Stores

| File |
|------|
| `src/stores/auth-store.ts` |
| `src/stores/ui-store.ts` |

## Libraries

| File |
|------|
| `src/lib/i18n/index.ts` |
| `src/lib/i18n/translations.ts` |
| `src/lib/supabase/client.ts` |
| `src/lib/supabase/middleware.ts` |
| `src/lib/supabase/server.ts` |
| `src/lib/utils.ts` |

## Database Migrations

| File |
|------|
| `supabase/migrations/001_foundation.sql` |

## Architecture

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth pages (login, register, forgot-password)
│   ├── (app)/        # Protected app pages (dashboard, systems, etc.)
│   ├── (marketing)/  # Public landing page
│   └── api/          # API routes
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # AppShell, Sidebar, Header, Breadcrumbs
│   └── ...           # Feature-specific components
├── lib/
│   ├── supabase/     # Supabase client + server + middleware
│   ├── i18n/         # Translation engine + 5 locales
│   ├── ai/           # Claude API helpers (future)
│   └── stripe/       # Stripe helpers (future)
├── stores/           # Zustand stores (auth, ui)
└── types/            # TypeScript types (database)
```

## i18n Languages

ES (Spanish), EN (English), FR (French), DE (German), IT (Italian)
