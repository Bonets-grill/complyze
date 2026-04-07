import type { RiskCategory } from '@/types/database'

export interface ComplianceAction {
  id: string
  title_en: string
  title_es: string
  description_en: string
  description_es: string
  article: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'documentation' | 'technical' | 'organizational' | 'transparency'
}

const PROHIBITED_ACTIONS: ComplianceAction[] = [
  { id: 'p1', title_en: 'Cease operation immediately', title_es: 'Cesar operación inmediatamente', description_en: 'This AI system falls under prohibited practices. It must be decommissioned and removed from service.', description_es: 'Este sistema de IA está bajo prácticas prohibidas. Debe ser descomisionado y retirado del servicio.', article: 'Art. 5', priority: 'critical', category: 'organizational' },
  { id: 'p2', title_en: 'Document decommissioning', title_es: 'Documentar descomisión', description_en: 'Create a record of why the system was decommissioned and what alternatives will be used.', description_es: 'Crear un registro de por qué se descomisionó el sistema y qué alternativas se usarán.', article: 'Art. 5', priority: 'critical', category: 'documentation' },
]

const HIGH_RISK_ACTIONS: ComplianceAction[] = [
  { id: 'h1', title_en: 'Implement risk management system', title_es: 'Implementar sistema de gestión de riesgos', description_en: 'Establish a continuous, iterative risk management process covering identification, analysis, evaluation and mitigation of risks throughout the AI lifecycle.', description_es: 'Establecer un proceso continuo e iterativo de gestión de riesgos cubriendo identificación, análisis, evaluación y mitigación de riesgos durante todo el ciclo de vida de la IA.', article: 'Art. 9', priority: 'critical', category: 'organizational' },
  { id: 'h2', title_en: 'Establish data governance', title_es: 'Establecer gobernanza de datos', description_en: 'Ensure training data is relevant, representative, free of errors. Document data sources, collection methods, and bias examination procedures.', description_es: 'Asegurar que los datos de entrenamiento son relevantes, representativos, libres de errores. Documentar fuentes de datos, métodos de recolección y procedimientos de examen de sesgos.', article: 'Art. 10', priority: 'critical', category: 'technical' },
  { id: 'h3', title_en: 'Create technical documentation', title_es: 'Crear documentación técnica', description_en: 'Draw up comprehensive technical documentation covering system design, development methodology, testing procedures, and performance metrics.', description_es: 'Elaborar documentación técnica completa cubriendo diseño del sistema, metodología de desarrollo, procedimientos de pruebas y métricas de rendimiento.', article: 'Art. 11', priority: 'critical', category: 'documentation' },
  { id: 'h4', title_en: 'Enable automatic logging', title_es: 'Habilitar registro automático', description_en: 'Implement automatic event logging for traceability. Logs must cover inputs, outputs, and key system decisions throughout the lifecycle.', description_es: 'Implementar registro automático de eventos para trazabilidad. Los logs deben cubrir entradas, salidas y decisiones clave del sistema durante todo el ciclo de vida.', article: 'Art. 12', priority: 'high', category: 'technical' },
  { id: 'h5', title_en: 'Provide transparency information', title_es: 'Proporcionar información de transparencia', description_en: 'Create clear instructions for use enabling deployers to interpret outputs. Include system capabilities, limitations, and intended purpose.', description_es: 'Crear instrucciones de uso claras que permitan a los implementadores interpretar los resultados. Incluir capacidades, limitaciones y propósito del sistema.', article: 'Art. 13', priority: 'high', category: 'transparency' },
  { id: 'h6', title_en: 'Design human oversight mechanisms', title_es: 'Diseñar mecanismos de supervisión humana', description_en: 'Implement controls allowing humans to understand, monitor, interpret and override/intervene in the AI system\'s operation.', description_es: 'Implementar controles que permitan a los humanos comprender, monitorear, interpretar y anular/intervenir en la operación del sistema de IA.', article: 'Art. 14', priority: 'high', category: 'technical' },
  { id: 'h7', title_en: 'Ensure accuracy and robustness', title_es: 'Garantizar precisión y robustez', description_en: 'Test and validate system accuracy. Implement cybersecurity measures and ensure resilience against adversarial attacks and errors.', description_es: 'Probar y validar la precisión del sistema. Implementar medidas de ciberseguridad y garantizar resiliencia contra ataques adversarios y errores.', article: 'Art. 15', priority: 'high', category: 'technical' },
  { id: 'h8', title_en: 'Conduct conformity assessment', title_es: 'Realizar evaluación de conformidad', description_en: 'Complete the conformity assessment procedure before placing the system on the market.', description_es: 'Completar el procedimiento de evaluación de conformidad antes de comercializar el sistema.', article: 'Art. 43', priority: 'high', category: 'organizational' },
  { id: 'h9', title_en: 'Create EU Declaration of Conformity', title_es: 'Crear Declaración UE de Conformidad', description_en: 'Draw up a written declaration stating the system meets all applicable requirements.', description_es: 'Elaborar una declaración escrita indicando que el sistema cumple todos los requisitos aplicables.', article: 'Art. 47', priority: 'high', category: 'documentation' },
  { id: 'h10', title_en: 'Register in EU database', title_es: 'Registrar en base de datos UE', description_en: 'Register the AI system in the EU database before market placement or service deployment.', description_es: 'Registrar el sistema de IA en la base de datos de la UE antes de su comercialización o puesta en servicio.', article: 'Art. 49', priority: 'medium', category: 'organizational' },
  { id: 'h11', title_en: 'Implement post-market monitoring', title_es: 'Implementar monitoreo post-comercialización', description_en: 'Set up continuous monitoring of the AI system in operation to detect issues and ensure ongoing compliance.', description_es: 'Configurar monitoreo continuo del sistema de IA en operación para detectar problemas y garantizar cumplimiento continuo.', article: 'Art. 72', priority: 'medium', category: 'organizational' },
  { id: 'h12', title_en: 'Establish incident reporting', title_es: 'Establecer reporte de incidentes', description_en: 'Create procedures for reporting serious incidents to national authorities within prescribed timeframes.', description_es: 'Crear procedimientos para reportar incidentes graves a las autoridades nacionales dentro de los plazos establecidos.', article: 'Art. 73', priority: 'medium', category: 'organizational' },
]

const LIMITED_RISK_ACTIONS: ComplianceAction[] = [
  { id: 'l1', title_en: 'Add AI interaction disclosure', title_es: 'Añadir aviso de interacción con IA', description_en: 'Clearly inform users that they are interacting with an AI system, not a human. This must be done before or at the start of the interaction.', description_es: 'Informar claramente a los usuarios que están interactuando con un sistema de IA, no con un humano. Esto debe hacerse antes o al inicio de la interacción.', article: 'Art. 50(1)', priority: 'critical', category: 'transparency' },
  { id: 'l2', title_en: 'Label AI-generated content', title_es: 'Etiquetar contenido generado por IA', description_en: 'All content generated by the AI system (text, images, audio, video) must be clearly marked as AI-generated in a machine-readable format.', description_es: 'Todo el contenido generado por el sistema de IA (texto, imágenes, audio, vídeo) debe marcarse claramente como generado por IA en formato legible por máquina.', article: 'Art. 50(2)', priority: 'critical', category: 'transparency' },
  { id: 'l3', title_en: 'Document system capabilities', title_es: 'Documentar capacidades del sistema', description_en: 'Create documentation describing what the AI system can and cannot do, its intended purpose, and known limitations.', description_es: 'Crear documentación describiendo lo que el sistema de IA puede y no puede hacer, su propósito previsto y limitaciones conocidas.', article: 'Art. 50', priority: 'high', category: 'documentation' },
  { id: 'l4', title_en: 'Implement user feedback mechanism', title_es: 'Implementar mecanismo de feedback', description_en: 'Provide a way for users to report issues, inaccuracies, or concerns about the AI system\'s outputs.', description_es: 'Proporcionar una forma para que los usuarios reporten problemas, inexactitudes o preocupaciones sobre los resultados del sistema de IA.', article: 'Art. 50', priority: 'medium', category: 'organizational' },
  { id: 'l5', title_en: 'Follow voluntary code of conduct', title_es: 'Seguir código de conducta voluntario', description_en: 'Consider adopting voluntary codes of conduct covering AI ethics, environmental sustainability, accessibility, and stakeholder participation.', description_es: 'Considerar adoptar códigos de conducta voluntarios cubriendo ética de IA, sostenibilidad ambiental, accesibilidad y participación de partes interesadas.', article: 'Art. 95', priority: 'low', category: 'organizational' },
]

const MINIMAL_RISK_ACTIONS: ComplianceAction[] = [
  { id: 'm1', title_en: 'Consider voluntary codes of conduct', title_es: 'Considerar códigos de conducta voluntarios', description_en: 'While not mandatory, adopting voluntary codes of conduct for ethics, transparency and sustainability is encouraged.', description_es: 'Aunque no es obligatorio, se fomenta adoptar códigos de conducta voluntarios sobre ética, transparencia y sostenibilidad.', article: 'Art. 95', priority: 'low', category: 'organizational' },
  { id: 'm2', title_en: 'Maintain basic documentation', title_es: 'Mantener documentación básica', description_en: 'As best practice, keep records of the system\'s purpose, data sources, and key design decisions.', description_es: 'Como buena práctica, mantener registros del propósito del sistema, fuentes de datos y decisiones clave de diseño.', article: 'Art. 95', priority: 'low', category: 'documentation' },
  { id: 'm3', title_en: 'Ensure basic transparency', title_es: 'Garantizar transparencia básica', description_en: 'Inform users when they interact with AI as a best practice, even if not legally required for minimal risk systems.', description_es: 'Informar a los usuarios cuando interactúan con IA como buena práctica, aunque no sea legalmente obligatorio para sistemas de riesgo mínimo.', article: 'Art. 95', priority: 'low', category: 'transparency' },
]

export function getActionsForCategory(category: RiskCategory | null): ComplianceAction[] {
  switch (category) {
    case 'prohibited': return PROHIBITED_ACTIONS
    case 'high_risk': return HIGH_RISK_ACTIONS
    case 'limited_risk': return LIMITED_RISK_ACTIONS
    case 'minimal_risk': return MINIMAL_RISK_ACTIONS
    default: return []
  }
}

export function getComplianceScore(category: RiskCategory | null, completedActions: string[]): number {
  const actions = getActionsForCategory(category)
  if (actions.length === 0) return 100
  const done = completedActions.filter(id => actions.some(a => a.id === id)).length
  return Math.round((done / actions.length) * 100)
}
