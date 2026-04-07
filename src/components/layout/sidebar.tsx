'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Cpu,
  ClipboardCheck,
  FileText,
  Shield,
  BookOpen,
  Settings,
  ChevronsLeft,
  ChevronsRight,
  X,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export function Sidebar() {
  const pathname = usePathname()
  const { lang, sidebarCollapsed, sidebarOpen, toggleSidebarCollapsed, setSidebarOpen } = useUIStore()

  const items = [
    { href: '/dashboard', icon: LayoutDashboard, label: T[lang].dashboard },
    { href: '/systems', icon: Cpu, label: T[lang].systems },
    { href: '/assessments', icon: ClipboardCheck, label: T[lang].assessments },
    { href: '/documents', icon: FileText, label: T[lang].documents },
    { href: '/compliance', icon: Shield, label: T[lang].compliance },
    { href: '/knowledge-base', icon: BookOpen, label: T[lang].knowledgeBase },
    { href: '/settings', icon: Settings, label: T[lang].settings },
    { href: '/admin', icon: ShieldCheck, label: 'Admin' },
  ]

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-card transition-all duration-300 lg:relative',
          sidebarCollapsed ? 'w-16' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                C
              </div>
              <span className="text-lg font-bold">Complyze</span>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link href="/dashboard" className="mx-auto">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                C
              </div>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={toggleSidebarCollapsed}
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-2">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-600/10 text-blue-600 dark:text-blue-400'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
