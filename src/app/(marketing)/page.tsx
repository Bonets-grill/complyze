'use client'

import Link from 'next/link'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { LanguageSwitcher } from '@/components/layout/language-switcher'
import {
  Brain,
  FileText,
  Bell,
  ClipboardCheck,
  CheckSquare,
  Code,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { useState } from 'react'

export default function LandingPage() {
  const { lang } = useUIStore()

  const features = [
    { icon: Brain, title: T[lang].featureClassification, desc: T[lang].featureClassificationDesc },
    { icon: FileText, title: T[lang].featureDocuments, desc: T[lang].featureDocumentsDesc },
    { icon: Bell, title: T[lang].featureMonitoring, desc: T[lang].featureMonitoringDesc },
    { icon: ClipboardCheck, title: T[lang].featureAssessment, desc: T[lang].featureAssessmentDesc },
    { icon: CheckSquare, title: T[lang].featureChecklist, desc: T[lang].featureChecklistDesc },
    { icon: Code, title: T[lang].featureApi, desc: T[lang].featureApiDesc },
  ]

  const plans = [
    {
      name: T[lang].starter,
      price: '49',
      desc: T[lang].starterDesc,
      features: [T[lang].starterFeature1, T[lang].starterFeature2, T[lang].starterFeature3],
      cta: T[lang].startTrial,
      popular: false,
    },
    {
      name: T[lang].professional,
      price: '199',
      desc: T[lang].professionalDesc,
      features: [T[lang].proFeature1, T[lang].proFeature2, T[lang].proFeature3],
      cta: T[lang].startTrial,
      popular: true,
    },
    {
      name: T[lang].enterprise,
      price: '499',
      desc: T[lang].enterpriseDesc,
      features: [T[lang].enterpriseFeature1, T[lang].enterpriseFeature2, T[lang].enterpriseFeature3],
      cta: T[lang].contactSales,
      popular: false,
    },
  ]

  const faqs = [
    { q: T[lang].faq1Q, a: T[lang].faq1A },
    { q: T[lang].faq2Q, a: T[lang].faq2A },
    { q: T[lang].faq3Q, a: T[lang].faq3A },
    { q: T[lang].faq4Q, a: T[lang].faq4A },
  ]

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              C
            </div>
            <span className="text-lg font-bold">Complyze</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">{T[lang].features}</a>
            <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">{T[lang].pricing}</a>
            <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">{T[lang].faq}</a>
          </nav>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">{T[lang].login}</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">{T[lang].getStarted}</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 py-20 text-center lg:py-32">
        <Badge className="mb-6 bg-blue-600/10 text-blue-600 hover:bg-blue-600/10">EU AI Act 2026</Badge>
        <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl whitespace-pre-line">
          {T[lang].heroTitle}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          {T[lang].heroSubtitle}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">{T[lang].getStarted}</Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline">{T[lang].learnMore}</Button>
          </a>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{T[lang].trialInfo}</p>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">{T[lang].features}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <f.icon className="h-10 w-10 text-blue-600 mb-2" />
                  <CardTitle>{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{f.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">{T[lang].pricingTitle}</h2>
          <p className="mt-4 text-center text-muted-foreground">{T[lang].pricingSubtitle}</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.popular ? 'border-blue-600 shadow-lg' : ''}>
                <CardHeader>
                  {plan.popular && (
                    <Badge className="w-fit bg-blue-600 mb-2">Popular</Badge>
                  )}
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">EUR{T[lang].perMonth}</span>
                  </div>
                  <CardDescription>{plan.desc}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="block">
                    <Button className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                      {plan.cta}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-bold">{T[lang].faq}</h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
                  C
                </div>
                <span className="text-lg font-bold">Complyze</span>
              </div>
              <p className="text-sm text-muted-foreground">{T[lang].footerTagline}</p>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">{T[lang].product}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground">{T[lang].features}</a></li>
                <li><a href="#pricing" className="hover:text-foreground">{T[lang].pricing}</a></li>
                <li><a href="#faq" className="hover:text-foreground">{T[lang].faq}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">{T[lang].company}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{T[lang].about}</a></li>
                <li><a href="#" className="hover:text-foreground">{T[lang].blog}</a></li>
                <li><a href="#" className="hover:text-foreground">{T[lang].contact}</a></li>
              </ul>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold">{T[lang].legal}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">{T[lang].privacy}</a></li>
                <li><a href="#" className="hover:text-foreground">{T[lang].terms}</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Complyze. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-lg border">
      <button
        className="flex w-full items-center justify-between p-4 text-left text-sm font-medium"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        {question}
        {open ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
      </button>
      {open && (
        <div className="border-t px-4 pb-4 pt-2 text-sm text-muted-foreground">
          {answer}
        </div>
      )}
    </div>
  )
}
