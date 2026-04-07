-- Tenants (multi-tenant)
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  plan text NOT NULL DEFAULT 'trial' CHECK (plan IN ('trial','starter','professional','enterprise')),
  stripe_customer_id text,
  stripe_subscription_id text,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Users
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  email text NOT NULL,
  full_name text NOT NULL,
  role text NOT NULL DEFAULT 'member' CHECK (role IN ('owner','admin','member','viewer')),
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- AI Systems Registry
CREATE TABLE ai_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  name text NOT NULL,
  description text,
  provider text,
  model_name text,
  purpose text,
  category text CHECK (category IN ('prohibited','high_risk','limited_risk','minimal_risk')),
  risk_score int,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','under_review','compliant','non_compliant','archived')),
  classification_reasoning text,
  classified_at timestamptz,
  classified_by text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Risk Assessment
CREATE TABLE risk_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_system_id uuid REFERENCES ai_systems(id) ON DELETE CASCADE NOT NULL,
  assessment_type text NOT NULL CHECK (assessment_type IN ('initial','periodic','incident')),
  assessor text NOT NULL CHECK (assessor IN ('ai','human','both')),
  questions_answers jsonb,
  risk_factors jsonb,
  overall_score int,
  recommendations jsonb,
  eu_articles_applicable text[],
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Compliance Documents
CREATE TABLE compliance_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_system_id uuid REFERENCES ai_systems(id) ON DELETE CASCADE NOT NULL,
  doc_type text NOT NULL CHECK (doc_type IN ('technical_doc','conformity_declaration','risk_management_plan','data_governance','transparency_notice','human_oversight_plan','incident_report','audit_report')),
  title text NOT NULL,
  content text,
  version int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','approved','expired')),
  generated_by text NOT NULL CHECK (generated_by IN ('ai','manual')),
  approved_by uuid REFERENCES profiles(id),
  approved_at timestamptz,
  valid_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Compliance Checklist Items
CREATE TABLE checklist_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_system_id uuid REFERENCES ai_systems(id) ON DELETE CASCADE NOT NULL,
  eu_article text NOT NULL,
  requirement text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started','in_progress','compliant','non_compliant','not_applicable')),
  evidence_url text,
  notes text,
  due_date date,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Monitoring & Alerts
CREATE TABLE monitoring_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  ai_system_id uuid REFERENCES ai_systems(id) ON DELETE SET NULL,
  alert_type text NOT NULL CHECK (alert_type IN ('deadline','regulation_change','compliance_drift','document_expiry','incident')),
  severity text NOT NULL CHECK (severity IN ('info','warning','critical')),
  title text NOT NULL,
  message text,
  is_read boolean DEFAULT false,
  action_url text,
  created_at timestamptz DEFAULT now()
);

-- Audit Trail
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) NOT NULL,
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  details jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- EU AI Act Knowledge Base
CREATE TABLE eu_regulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_number text NOT NULL,
  title text NOT NULL,
  full_text text,
  risk_category text,
  applies_to text[],
  effective_date date,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE eu_regulations ENABLE ROW LEVEL SECURITY;

-- Helper: get current user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS uuid AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get current user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS text AS $$
  SELECT role FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- TENANTS RLS
CREATE POLICY "Users can view own tenant" ON tenants
  FOR SELECT USING (id = get_user_tenant_id());
CREATE POLICY "Owner/Admin can update tenant" ON tenants
  FOR UPDATE USING (id = get_user_tenant_id() AND get_user_role() IN ('owner','admin'));

-- PROFILES RLS
CREATE POLICY "Users can view profiles in own tenant" ON profiles
  FOR SELECT USING (tenant_id = get_user_tenant_id());
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = auth.uid());
CREATE POLICY "Owner/Admin can manage profiles" ON profiles
  FOR ALL USING (tenant_id = get_user_tenant_id() AND get_user_role() IN ('owner','admin'));
CREATE POLICY "New user can insert own profile" ON profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- AI SYSTEMS RLS
CREATE POLICY "View systems in own tenant" ON ai_systems
  FOR SELECT USING (tenant_id = get_user_tenant_id());
CREATE POLICY "Owner/Admin/Member can create systems" ON ai_systems
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id() AND get_user_role() IN ('owner','admin','member'));
CREATE POLICY "Owner/Admin/Member can update systems" ON ai_systems
  FOR UPDATE USING (tenant_id = get_user_tenant_id() AND get_user_role() IN ('owner','admin','member'));
CREATE POLICY "Owner/Admin can delete systems" ON ai_systems
  FOR DELETE USING (tenant_id = get_user_tenant_id() AND get_user_role() IN ('owner','admin'));

-- RISK ASSESSMENTS RLS
CREATE POLICY "View assessments in own tenant" ON risk_assessments
  FOR SELECT USING (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Create assessments in own tenant" ON risk_assessments
  FOR INSERT WITH CHECK (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()) AND get_user_role() IN ('owner','admin','member'));
CREATE POLICY "Update assessments in own tenant" ON risk_assessments
  FOR UPDATE USING (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()) AND get_user_role() IN ('owner','admin','member'));

-- COMPLIANCE DOCUMENTS RLS
CREATE POLICY "View documents in own tenant" ON compliance_documents
  FOR SELECT USING (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Create documents in own tenant" ON compliance_documents
  FOR INSERT WITH CHECK (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()) AND get_user_role() IN ('owner','admin','member'));
CREATE POLICY "Update documents in own tenant" ON compliance_documents
  FOR UPDATE USING (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()) AND get_user_role() IN ('owner','admin','member'));

-- CHECKLIST ITEMS RLS
CREATE POLICY "View checklist in own tenant" ON checklist_items
  FOR SELECT USING (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()));
CREATE POLICY "Manage checklist in own tenant" ON checklist_items
  FOR ALL USING (ai_system_id IN (SELECT id FROM ai_systems WHERE tenant_id = get_user_tenant_id()) AND get_user_role() IN ('owner','admin','member'));

-- MONITORING ALERTS RLS
CREATE POLICY "View alerts in own tenant" ON monitoring_alerts
  FOR SELECT USING (tenant_id = get_user_tenant_id());
CREATE POLICY "Update alerts in own tenant" ON monitoring_alerts
  FOR UPDATE USING (tenant_id = get_user_tenant_id());

-- AUDIT LOGS RLS
CREATE POLICY "View audit logs in own tenant" ON audit_logs
  FOR SELECT USING (tenant_id = get_user_tenant_id());
CREATE POLICY "Create audit logs" ON audit_logs
  FOR INSERT WITH CHECK (tenant_id = get_user_tenant_id());

-- EU REGULATIONS RLS (public read)
CREATE POLICY "Anyone can read regulations" ON eu_regulations
  FOR SELECT USING (true);

-- Auto-create tenant + profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
DECLARE
  new_tenant_id uuid;
  user_name text;
  company_name text;
  company_slug text;
BEGIN
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email);
  company_name := COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Organization');
  company_slug := LOWER(REGEXP_REPLACE(company_name, '[^a-zA-Z0-9]', '-', 'g')) || '-' || SUBSTRING(NEW.id::text, 1, 8);

  INSERT INTO tenants (name, slug)
  VALUES (company_name, company_slug)
  RETURNING id INTO new_tenant_id;

  INSERT INTO profiles (id, tenant_id, email, full_name, role)
  VALUES (NEW.id, new_tenant_id, NEW.email, user_name, 'owner');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON tenants FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON ai_systems FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON compliance_documents FOR EACH ROW EXECUTE FUNCTION update_updated_at();
