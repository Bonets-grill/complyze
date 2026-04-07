import type { DocType } from '@/types/database'
import type { AISystemLocal } from '@/stores/systems-store'

export interface DocTypeInfo {
  type: DocType
  article: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  requiredFor: ('high_risk' | 'limited_risk' | 'minimal_risk' | 'prohibited')[]
}

export const DOC_TYPES_INFO: DocTypeInfo[] = [
  {
    type: 'risk_management_plan',
    article: 'Art. 9',
    title_en: 'Risk Management System Plan',
    title_es: 'Plan de Sistema de Gestión de Riesgos',
    description_en: 'Continuous risk identification, analysis, evaluation and mitigation throughout the AI lifecycle.',
    description_es: 'Identificación, análisis, evaluación y mitigación continua de riesgos durante todo el ciclo de vida de la IA.',
    requiredFor: ['high_risk'],
  },
  {
    type: 'data_governance',
    article: 'Art. 10',
    title_en: 'Data Governance Documentation',
    title_es: 'Documentación de Gobernanza de Datos',
    description_en: 'Data quality, representativeness, bias examination, and data management practices.',
    description_es: 'Calidad de datos, representatividad, examen de sesgos y prácticas de gestión de datos.',
    requiredFor: ['high_risk'],
  },
  {
    type: 'technical_doc',
    article: 'Art. 11',
    title_en: 'Technical Documentation',
    title_es: 'Documentación Técnica',
    description_en: 'System design, development methodology, testing procedures, and performance metrics.',
    description_es: 'Diseño del sistema, metodología de desarrollo, procedimientos de pruebas y métricas de rendimiento.',
    requiredFor: ['high_risk'],
  },
  {
    type: 'transparency_notice',
    article: 'Art. 13/50',
    title_en: 'Transparency Notice',
    title_es: 'Aviso de Transparencia',
    description_en: 'Information enabling deployers to interpret output and use the system appropriately.',
    description_es: 'Información que permite a los implementadores interpretar los resultados y usar el sistema apropiadamente.',
    requiredFor: ['high_risk', 'limited_risk'],
  },
  {
    type: 'human_oversight_plan',
    article: 'Art. 14',
    title_en: 'Human Oversight Plan',
    title_es: 'Plan de Supervisión Humana',
    description_en: 'Mechanisms for human understanding, monitoring, interpretation and intervention/override.',
    description_es: 'Mecanismos para comprensión, monitoreo, interpretación e intervención/anulación humana.',
    requiredFor: ['high_risk'],
  },
  {
    type: 'conformity_declaration',
    article: 'Art. 47',
    title_en: 'EU Declaration of Conformity',
    title_es: 'Declaración UE de Conformidad',
    description_en: 'Formal declaration that the AI system meets all applicable EU AI Act requirements.',
    description_es: 'Declaración formal de que el sistema de IA cumple todos los requisitos aplicables del EU AI Act.',
    requiredFor: ['high_risk'],
  },
]

export function getRequiredDocs(category: string | null): DocTypeInfo[] {
  if (!category) return []
  return DOC_TYPES_INFO.filter(d => d.requiredFor.includes(category as never))
}

export function buildPrompt(docType: DocTypeInfo, system: AISystemLocal): string {
  return `You are an EU AI Act compliance expert generating official compliance documentation.

Generate a complete "${docType.title_en}" document (${docType.article}) for the following AI system.

## AI SYSTEM DETAILS
- **Name**: ${system.name}
- **Provider**: ${system.provider}
- **AI Model(s)**: ${system.model_name}
- **Description**: ${system.description}
- **Purpose**: ${system.purpose}
- **Data Processed**: ${system.data_types}
- **Users**: ${system.users}
- **Risk Category**: ${system.category}
- **Risk Score**: ${system.risk_score}/100

## DOCUMENT REQUIREMENTS
${getDocRequirements(docType.type)}

## FORMAT
Generate the document in professional Markdown format with:
- Document title and metadata (version, date, system name, provider)
- Table of contents
- Numbered sections and subsections
- Specific, actionable content tailored to THIS system (not generic)
- References to applicable EU AI Act articles
- Signature/approval section at the end

Write in English. Be thorough but practical. Use the system details provided to make the content specific, not generic boilerplate.`
}

function getDocRequirements(type: DocType): string {
  switch (type) {
    case 'risk_management_plan':
      return `Per Article 9, the Risk Management Plan must include:
1. Identification and analysis of known and reasonably foreseeable risks
2. Estimation and evaluation of risks that may emerge during intended use and foreseeable misuse
3. Evaluation of risks based on post-market monitoring data
4. Adoption of appropriate and targeted risk management measures
5. Testing procedures to ensure the system performs consistently
6. Residual risk assessment and risk acceptance criteria
7. Risk communication to deployers and users`

    case 'data_governance':
      return `Per Article 10, Data Governance Documentation must cover:
1. Design choices for training, validation and testing data sets
2. Data collection processes and data origin
3. Data preparation operations (annotation, labeling, cleaning, enrichment)
4. Data quality criteria and examination for possible biases
5. Measures to detect, prevent and mitigate biases
6. Identification of relevant data gaps and how they are addressed
7. Data protection impact assessment (if personal data is involved)`

    case 'technical_doc':
      return `Per Article 11 and Annex IV, Technical Documentation must include:
1. General description of the AI system (intended purpose, developer, version)
2. Detailed description of system elements and development process
3. Information about monitoring, functioning and control
4. Risk management system description
5. Description of changes throughout the lifecycle
6. List of harmonised standards or common specifications applied
7. EU declaration of conformity reference
8. Performance metrics and testing results`

    case 'transparency_notice':
      return `Per Articles 13 and 50, the Transparency Notice must include:
1. Clear disclosure that users are interacting with an AI system
2. System capabilities and limitations
3. Level of accuracy and known error rates
4. Intended purpose and conditions of use
5. Identity and contact of the provider
6. Information about human oversight measures
7. How to report issues or concerns
8. Labeling requirements for AI-generated content`

    case 'human_oversight_plan':
      return `Per Article 14, the Human Oversight Plan must include:
1. Measures to allow human understanding of the system's capacities and limitations
2. Monitoring mechanisms during operation
3. How humans can interpret the AI system's output
4. Ability to decide not to use the system or disregard/reverse its output
5. Ability to intervene or interrupt the system (stop button)
6. Competency and training requirements for oversight personnel
7. Escalation procedures for edge cases`

    case 'conformity_declaration':
      return `Per Article 47 and Annex V, the EU Declaration of Conformity must state:
1. AI system name, type, and unique identification
2. Name and address of the provider
3. Statement that the declaration is issued under sole responsibility of the provider
4. Statement that the AI system complies with the EU AI Act
5. References to relevant harmonised standards or specifications
6. Where applicable, notified body details and conformity assessment reference
7. Place and date of issue, signature of authorized person`

    default:
      return 'Generate appropriate compliance documentation following EU AI Act requirements.'
  }
}
