export type Plan = 'trial' | 'starter' | 'professional' | 'enterprise'
export type Role = 'owner' | 'admin' | 'member' | 'viewer'
export type RiskCategory = 'prohibited' | 'high_risk' | 'limited_risk' | 'minimal_risk'
export type SystemStatus = 'draft' | 'under_review' | 'compliant' | 'non_compliant' | 'archived'
export type AssessmentType = 'initial' | 'periodic' | 'incident'
export type Assessor = 'ai' | 'human' | 'both'
export type DocType =
  | 'technical_doc'
  | 'conformity_declaration'
  | 'risk_management_plan'
  | 'data_governance'
  | 'transparency_notice'
  | 'human_oversight_plan'
  | 'incident_report'
  | 'audit_report'
export type DocStatus = 'draft' | 'review' | 'approved' | 'expired'
export type ChecklistStatus = 'not_started' | 'in_progress' | 'compliant' | 'non_compliant' | 'not_applicable'
export type AlertType = 'deadline' | 'regulation_change' | 'compliance_drift' | 'document_expiry' | 'incident'
export type Severity = 'info' | 'warning' | 'critical'
export type Lang = 'es' | 'en' | 'fr' | 'de' | 'it'

export interface Tenant {
  id: string
  name: string
  slug: string
  plan: Plan
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  tenant_id: string
  email: string
  full_name: string
  role: Role
  avatar_url: string | null
  created_at: string
}

export interface AISystem {
  id: string
  tenant_id: string
  name: string
  description: string | null
  provider: string | null
  model_name: string | null
  purpose: string | null
  category: RiskCategory | null
  risk_score: number | null
  status: SystemStatus
  classification_reasoning: string | null
  classified_at: string | null
  classified_by: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface RiskAssessment {
  id: string
  ai_system_id: string
  assessment_type: AssessmentType
  assessor: Assessor
  questions_answers: Record<string, unknown> | null
  risk_factors: Record<string, unknown> | null
  overall_score: number | null
  recommendations: Record<string, unknown> | null
  eu_articles_applicable: string[] | null
  completed_at: string | null
  created_at: string
}

export interface ComplianceDocument {
  id: string
  ai_system_id: string
  doc_type: DocType
  title: string
  content: string | null
  version: number
  status: DocStatus
  generated_by: 'ai' | 'manual'
  approved_by: string | null
  approved_at: string | null
  valid_until: string | null
  created_at: string
  updated_at: string
}

export interface ChecklistItem {
  id: string
  ai_system_id: string
  eu_article: string
  requirement: string
  description: string | null
  status: ChecklistStatus
  evidence_url: string | null
  notes: string | null
  due_date: string | null
  completed_at: string | null
  created_at: string
}

export interface MonitoringAlert {
  id: string
  tenant_id: string
  ai_system_id: string | null
  alert_type: AlertType
  severity: Severity
  title: string
  message: string | null
  is_read: boolean
  action_url: string | null
  created_at: string
}

export interface AuditLog {
  id: string
  tenant_id: string
  user_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export interface EURegulation {
  id: string
  article_number: string
  title: string
  full_text: string | null
  risk_category: string | null
  applies_to: string[] | null
  effective_date: string | null
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      tenants: { Row: Tenant; Insert: Partial<Tenant> & Pick<Tenant, 'name' | 'slug'>; Update: Partial<Tenant> }
      profiles: { Row: Profile; Insert: Partial<Profile> & Pick<Profile, 'id' | 'tenant_id' | 'email' | 'full_name'>; Update: Partial<Profile> }
      ai_systems: { Row: AISystem; Insert: Partial<AISystem> & Pick<AISystem, 'tenant_id' | 'name'>; Update: Partial<AISystem> }
      risk_assessments: { Row: RiskAssessment; Insert: Partial<RiskAssessment> & Pick<RiskAssessment, 'ai_system_id' | 'assessment_type' | 'assessor'>; Update: Partial<RiskAssessment> }
      compliance_documents: { Row: ComplianceDocument; Insert: Partial<ComplianceDocument> & Pick<ComplianceDocument, 'ai_system_id' | 'doc_type' | 'title' | 'generated_by'>; Update: Partial<ComplianceDocument> }
      checklist_items: { Row: ChecklistItem; Insert: Partial<ChecklistItem> & Pick<ChecklistItem, 'ai_system_id' | 'eu_article' | 'requirement'>; Update: Partial<ChecklistItem> }
      monitoring_alerts: { Row: MonitoringAlert; Insert: Partial<MonitoringAlert> & Pick<MonitoringAlert, 'tenant_id' | 'alert_type' | 'severity' | 'title'>; Update: Partial<MonitoringAlert> }
      audit_logs: { Row: AuditLog; Insert: Partial<AuditLog> & Pick<AuditLog, 'tenant_id' | 'action'>; Update: Partial<AuditLog> }
      eu_regulations: { Row: EURegulation; Insert: Partial<EURegulation> & Pick<EURegulation, 'article_number' | 'title'>; Update: Partial<EURegulation> }
    }
  }
}
