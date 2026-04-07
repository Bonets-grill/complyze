'use client'

import { useState } from 'react'
import { useUIStore } from '@/stores/ui-store'
import { T } from '@/lib/i18n'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, BookOpen, ChevronDown, ChevronUp, ExternalLink, Shield, AlertTriangle, Eye, Ban } from 'lucide-react'

interface Article {
  number: string
  title_en: string
  title_es: string
  summary_en: string
  summary_es: string
  category: 'prohibited' | 'high_risk' | 'limited_risk' | 'minimal_risk' | 'general' | 'governance'
  chapter: string
}

const EU_AI_ACT_ARTICLES: Article[] = [
  // Title I — General Provisions
  { number: 'Art. 1', title_en: 'Subject matter', title_es: 'Objeto', summary_en: 'Establishes rules for AI systems placed on the market or used in the EU, ensuring safety, fundamental rights, and innovation.', summary_es: 'Establece normas para sistemas de IA comercializados o utilizados en la UE, garantizando seguridad, derechos fundamentales e innovación.', category: 'general', chapter: 'I' },
  { number: 'Art. 2', title_en: 'Scope', title_es: 'Ámbito de aplicación', summary_en: 'Applies to providers, deployers, importers and distributors of AI systems in the EU, regardless of where they are established.', summary_es: 'Se aplica a proveedores, implementadores, importadores y distribuidores de sistemas de IA en la UE, independientemente de su sede.', category: 'general', chapter: 'I' },
  { number: 'Art. 3', title_en: 'Definitions', title_es: 'Definiciones', summary_en: 'Defines key terms: AI system, provider, deployer, high-risk, biometric, emotion recognition, and 60+ other concepts.', summary_es: 'Define términos clave: sistema de IA, proveedor, implementador, alto riesgo, biométrico, reconocimiento de emociones y más de 60 conceptos.', category: 'general', chapter: 'I' },
  { number: 'Art. 4', title_en: 'AI literacy', title_es: 'Alfabetización en IA', summary_en: 'Providers and deployers must ensure staff have sufficient AI literacy to operate and oversee AI systems.', summary_es: 'Proveedores e implementadores deben garantizar que el personal tenga suficiente alfabetización en IA para operar y supervisar sistemas de IA.', category: 'general', chapter: 'I' },

  // Title II — Prohibited AI Practices
  { number: 'Art. 5', title_en: 'Prohibited AI practices', title_es: 'Prácticas de IA prohibidas', summary_en: 'Bans: social scoring, real-time remote biometric ID (with exceptions), subliminal manipulation, exploitation of vulnerabilities, emotion recognition in workplaces/education, and untargeted facial recognition scraping.', summary_es: 'Prohíbe: puntuación social, identificación biométrica remota en tiempo real (con excepciones), manipulación subliminal, explotación de vulnerabilidades, reconocimiento de emociones en trabajo/educación y recopilación no dirigida de reconocimiento facial.', category: 'prohibited', chapter: 'II' },

  // Title III — High-Risk AI Systems
  { number: 'Art. 6', title_en: 'Classification rules for high-risk AI', title_es: 'Reglas de clasificación de alto riesgo', summary_en: 'AI systems in Annex III areas (biometrics, critical infrastructure, education, employment, essential services, law enforcement, migration, justice) are high-risk.', summary_es: 'Los sistemas de IA en áreas del Anexo III (biometría, infraestructura crítica, educación, empleo, servicios esenciales, aplicación de la ley, migración, justicia) son de alto riesgo.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 8', title_en: 'Compliance with requirements', title_es: 'Cumplimiento de requisitos', summary_en: 'High-risk AI systems must comply with Articles 9-15 throughout their lifecycle.', summary_es: 'Los sistemas de IA de alto riesgo deben cumplir los Artículos 9-15 durante todo su ciclo de vida.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 9', title_en: 'Risk management system', title_es: 'Sistema de gestión de riesgos', summary_en: 'Requires a continuous, iterative risk management system identifying, analyzing, evaluating and mitigating risks. Must include testing with real-world data.', summary_es: 'Requiere un sistema de gestión de riesgos continuo e iterativo que identifique, analice, evalúe y mitigue riesgos. Debe incluir pruebas con datos reales.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 10', title_en: 'Data and data governance', title_es: 'Datos y gobernanza de datos', summary_en: 'Training, validation and testing datasets must be relevant, representative, free of errors, and complete. Requires data governance practices and bias examination.', summary_es: 'Los conjuntos de datos de entrenamiento, validación y prueba deben ser relevantes, representativos, libres de errores y completos. Requiere prácticas de gobernanza de datos y examen de sesgos.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 11', title_en: 'Technical documentation', title_es: 'Documentación técnica', summary_en: 'Must be drawn up before the system is placed on the market and kept up to date. Covers design, development, testing, monitoring procedures.', summary_es: 'Debe elaborarse antes de comercializar el sistema y mantenerse actualizada. Cubre diseño, desarrollo, pruebas y procedimientos de monitoreo.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 12', title_en: 'Record-keeping', title_es: 'Mantenimiento de registros', summary_en: 'Systems must allow automatic logging of events (logs) throughout their lifecycle for traceability.', summary_es: 'Los sistemas deben permitir el registro automático de eventos (logs) durante todo su ciclo de vida para trazabilidad.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 13', title_en: 'Transparency and information', title_es: 'Transparencia e información', summary_en: 'Must be designed to allow deployers to interpret output and use the system appropriately. Instructions for use must be provided.', summary_es: 'Deben diseñarse para permitir a los implementadores interpretar los resultados y usar el sistema apropiadamente. Se deben proporcionar instrucciones de uso.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 14', title_en: 'Human oversight', title_es: 'Supervisión humana', summary_en: 'Must be designed to allow effective human oversight, including ability to understand, monitor, interpret and intervene/override the system.', summary_es: 'Deben diseñarse para permitir supervisión humana efectiva, incluyendo capacidad de comprender, monitorear, interpretar e intervenir/anular el sistema.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 15', title_en: 'Accuracy, robustness and cybersecurity', title_es: 'Precisión, robustez y ciberseguridad', summary_en: 'Must achieve appropriate levels of accuracy, robustness, and cybersecurity. Must be resilient against errors, faults, and adversarial attacks.', summary_es: 'Deben alcanzar niveles apropiados de precisión, robustez y ciberseguridad. Deben ser resilientes contra errores, fallos y ataques adversarios.', category: 'high_risk', chapter: 'III' },

  // Provider & Deployer obligations
  { number: 'Art. 16', title_en: 'Obligations of providers', title_es: 'Obligaciones de los proveedores', summary_en: 'Providers must ensure compliance, implement QMS, keep documentation, undergo conformity assessment, register in EU database, and take corrective actions.', summary_es: 'Los proveedores deben garantizar el cumplimiento, implementar SGC, mantener documentación, someterse a evaluación de conformidad, registrarse en la base de datos de la UE y tomar acciones correctivas.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 26', title_en: 'Obligations of deployers', title_es: 'Obligaciones de los implementadores', summary_en: 'Deployers must use systems according to instructions, ensure human oversight, monitor operation, keep logs, and conduct impact assessments for high-risk systems.', summary_es: 'Los implementadores deben usar los sistemas según las instrucciones, garantizar supervisión humana, monitorear operación, mantener registros y realizar evaluaciones de impacto para sistemas de alto riesgo.', category: 'high_risk', chapter: 'III' },

  // Conformity
  { number: 'Art. 43', title_en: 'Conformity assessment', title_es: 'Evaluación de conformidad', summary_en: 'High-risk AI systems must undergo conformity assessment before being placed on the market. Can be self-assessment or third-party depending on the system.', summary_es: 'Los sistemas de IA de alto riesgo deben someterse a evaluación de conformidad antes de ser comercializados. Puede ser autoevaluación o de terceros según el sistema.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 47', title_en: 'EU declaration of conformity', title_es: 'Declaración UE de conformidad', summary_en: 'Provider must draw up a written EU declaration of conformity for each high-risk AI system stating it meets the requirements.', summary_es: 'El proveedor debe elaborar una declaración UE de conformidad por escrito para cada sistema de IA de alto riesgo indicando que cumple los requisitos.', category: 'high_risk', chapter: 'III' },
  { number: 'Art. 49', title_en: 'Registration in EU database', title_es: 'Registro en base de datos UE', summary_en: 'High-risk AI systems must be registered in the EU database before being placed on the market or put into service.', summary_es: 'Los sistemas de IA de alto riesgo deben registrarse en la base de datos de la UE antes de ser comercializados o puestos en servicio.', category: 'high_risk', chapter: 'III' },

  // Title IV — Transparency
  { number: 'Art. 50', title_en: 'Transparency obligations', title_es: 'Obligaciones de transparencia', summary_en: 'AI systems interacting with persons must disclose they are AI. Deepfakes and AI-generated content must be labeled. Emotion recognition must inform subjects.', summary_es: 'Los sistemas de IA que interactúan con personas deben revelar que son IA. Los deepfakes y contenido generado por IA deben etiquetarse. El reconocimiento de emociones debe informar a los sujetos.', category: 'limited_risk', chapter: 'IV' },

  // General Purpose AI
  { number: 'Art. 51', title_en: 'Classification of GPAI models', title_es: 'Clasificación de modelos GPAI', summary_en: 'General-purpose AI models with systemic risk (>10^25 FLOPs training or designated by Commission) have additional obligations.', summary_es: 'Los modelos de IA de propósito general con riesgo sistémico (>10^25 FLOPs de entrenamiento o designados por la Comisión) tienen obligaciones adicionales.', category: 'general', chapter: 'V' },
  { number: 'Art. 53', title_en: 'Obligations for GPAI providers', title_es: 'Obligaciones para proveedores GPAI', summary_en: 'Must provide technical documentation, instructions for use, comply with copyright directive, and publish training content summary.', summary_es: 'Deben proporcionar documentación técnica, instrucciones de uso, cumplir con la directiva de derechos de autor y publicar resumen del contenido de entrenamiento.', category: 'general', chapter: 'V' },

  // Governance
  { number: 'Art. 64', title_en: 'AI Office', title_es: 'Oficina de IA', summary_en: 'The European AI Office oversees implementation, monitors GPAI models, and supports national authorities.', summary_es: 'La Oficina Europea de IA supervisa la implementación, monitorea modelos GPAI y apoya a las autoridades nacionales.', category: 'governance', chapter: 'VII' },
  { number: 'Art. 70', title_en: 'National competent authorities', title_es: 'Autoridades nacionales competentes', summary_en: 'Each Member State designates national competent authorities and a market surveillance authority to enforce the regulation.', summary_es: 'Cada Estado miembro designa autoridades nacionales competentes y una autoridad de vigilancia del mercado para aplicar el reglamento.', category: 'governance', chapter: 'VII' },

  // Penalties
  { number: 'Art. 99', title_en: 'Penalties', title_es: 'Sanciones', summary_en: 'Prohibited AI: up to 35M EUR or 7% of global turnover. High-risk violations: up to 15M EUR or 3%. Incorrect information: up to 7.5M EUR or 1%. SME proportionality applies.', summary_es: 'IA prohibida: hasta 35M EUR o 7% de facturación global. Violaciones de alto riesgo: hasta 15M EUR o 3%. Información incorrecta: hasta 7,5M EUR o 1%. Se aplica proporcionalidad para PYMEs.', category: 'governance', chapter: 'XII' },

  // Minimal risk
  { number: 'Art. 95', title_en: 'Codes of conduct', title_es: 'Códigos de conducta', summary_en: 'The Commission and Member States encourage voluntary codes of conduct for non-high-risk AI systems covering ethics, accessibility, sustainability and diversity.', summary_es: 'La Comisión y los Estados miembros fomentan códigos de conducta voluntarios para sistemas de IA no de alto riesgo cubriendo ética, accesibilidad, sostenibilidad y diversidad.', category: 'minimal_risk', chapter: 'XI' },
]

const CATEGORY_CONFIG = {
  prohibited: { color: 'bg-red-600 text-white', icon: Ban, en: 'Prohibited', es: 'Prohibido' },
  high_risk: { color: 'bg-orange-500 text-white', icon: AlertTriangle, en: 'High Risk', es: 'Alto riesgo' },
  limited_risk: { color: 'bg-yellow-500 text-black', icon: Eye, en: 'Limited Risk', es: 'Riesgo limitado' },
  minimal_risk: { color: 'bg-emerald-500 text-white', icon: Shield, en: 'Minimal Risk', es: 'Riesgo mínimo' },
  general: { color: 'bg-blue-600 text-white', icon: BookOpen, en: 'General', es: 'General' },
  governance: { color: 'bg-purple-600 text-white', icon: Shield, en: 'Governance', es: 'Gobernanza' },
}

export default function KnowledgeBasePage() {
  const { lang } = useUIStore()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const isEs = lang === 'es'

  const filtered = EU_AI_ACT_ARTICLES.filter((a) => {
    const text = `${a.number} ${isEs ? a.title_es : a.title_en} ${isEs ? a.summary_es : a.summary_en}`.toLowerCase()
    const matchSearch = !search || text.includes(search.toLowerCase())
    const matchCat = categoryFilter === 'all' || a.category === categoryFilter
    return matchSearch && matchCat
  })

  const categories = ['all', 'prohibited', 'high_risk', 'limited_risk', 'minimal_risk', 'general', 'governance'] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{T[lang].knowledgeBase}</h1>
        <p className="text-muted-foreground mt-1">
          {isEs ? 'Referencia completa del EU AI Act (Reglamento (UE) 2024/1689)' :
           'Complete EU AI Act reference (Regulation (EU) 2024/1689)'}
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={isEs ? 'Buscar artículos...' : 'Search articles...'}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => {
          const cfg = cat === 'all' ? null : CATEGORY_CONFIG[cat]
          return (
            <Button
              key={cat}
              variant={categoryFilter === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategoryFilter(cat)}
            >
              {cat === 'all'
                ? (isEs ? 'Todos' : 'All')
                : (isEs ? cfg!.es : cfg!.en)}
              {cat !== 'all' && (
                <span className="ml-1 text-xs opacity-70">
                  ({EU_AI_ACT_ARTICLES.filter(a => a.category === cat).length})
                </span>
              )}
            </Button>
          )
        })}
      </div>

      {/* Stats */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-muted-foreground">{isEs ? 'Artículos totales' : 'Total Articles'}</p>
              <p className="text-xl font-bold">{EU_AI_ACT_ARTICLES.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <Ban className="h-5 w-5 text-red-600" />
            <div>
              <p className="text-xs text-muted-foreground">{isEs ? 'Prohibiciones' : 'Prohibitions'}</p>
              <p className="text-xl font-bold">{EU_AI_ACT_ARTICLES.filter(a => a.category === 'prohibited').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">{isEs ? 'Alto riesgo' : 'High Risk'}</p>
              <p className="text-xl font-bold">{EU_AI_ACT_ARTICLES.filter(a => a.category === 'high_risk').length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-3">
            <Shield className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-xs text-muted-foreground">{isEs ? 'Capítulos' : 'Chapters'}</p>
              <p className="text-xl font-bold">{new Set(EU_AI_ACT_ARTICLES.map(a => a.chapter)).size}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Penalties banner */}
      <Card className="border-red-500/30 bg-red-500/5">
        <CardContent className="flex items-start gap-3 py-4">
          <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold text-sm">{isEs ? 'Sanciones del EU AI Act' : 'EU AI Act Penalties'}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {isEs
                ? 'IA prohibida: hasta 35M EUR o 7% facturación. Alto riesgo: hasta 15M EUR o 3%. Información incorrecta: hasta 7,5M EUR o 1%.'
                : 'Prohibited AI: up to 35M EUR or 7% turnover. High-risk: up to 15M EUR or 3%. Incorrect info: up to 7.5M EUR or 1%.'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Articles list */}
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          {isEs ? `${filtered.length} artículos encontrados` : `${filtered.length} articles found`}
        </p>
        {filtered.map((article) => {
          const cfg = CATEGORY_CONFIG[article.category]
          const isExpanded = expanded === article.number
          return (
            <Card key={article.number}>
              <button
                className="w-full text-left"
                onClick={() => setExpanded(isExpanded ? null : article.number)}
              >
                <CardContent className="flex items-start gap-3 py-4">
                  <Badge className={`${cfg.color} shrink-0 mt-0.5`}>{article.number}</Badge>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">
                        {isEs ? article.title_es : article.title_en}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge variant="secondary" className="text-xs">Ch. {article.chapter}</Badge>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="mt-3 space-y-3">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {isEs ? article.summary_es : article.summary_en}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={cfg.color}>
                            {isEs ? cfg.es : cfg.en}
                          </Badge>
                          <a
                            href={`https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {isEs ? 'Ver texto completo' : 'Full text'} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </button>
            </Card>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center py-12">
            <Search className="h-12 w-12 text-muted-foreground/30 mb-3" />
            <p className="text-muted-foreground">
              {isEs ? 'No se encontraron artículos' : 'No articles found'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
