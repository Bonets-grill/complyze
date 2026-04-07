'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface LegalEntity {
  companyName: string
  companyType: string // S.L., S.A., Autónomo, GmbH, etc.
  address: string
  city: string
  postalCode: string
  country: string
  vatId: string // NIF/CIF/USt-IdNr
  phone: string
  email: string
  legalEmail: string // legal@complyze.eu
  privacyEmail: string // privacy@complyze.eu
  responsiblePerson: string
  responsibleRole: string
  commercialRegister: string
  commercialRegisterNumber: string
}

export interface DPASubprocessor {
  id: string
  name: string
  purpose: string
  location: string
  dpaUrl: string
  dpaSigned: boolean
  dpaSignedDate: string
  notes: string
}

export interface TaxConfig {
  taxRegime: string // IVA, IGIC, VAT
  taxRate: string // 21%, 7%, etc.
  vatOssRegistered: boolean
  vatOssNumber: string
  stripeTaxEnabled: boolean
  stripeTaxId: string
  invoicePrefix: string
  invoiceNextNumber: number
}

export interface InsuranceConfig {
  hasInsurance: boolean
  provider: string
  policyNumber: string
  coverageAmount: string
  coverageType: string
  expiryDate: string
  contactEmail: string
}

export interface LawyerConfig {
  hasConsulted: boolean
  lawyerName: string
  firmName: string
  consultationDate: string
  reviewStatus: string // pending, scheduled, completed, approved
  notes: string
  contactEmail: string
}

export interface LegalConfigState {
  entity: LegalEntity
  subprocessors: DPASubprocessor[]
  tax: TaxConfig
  insurance: InsuranceConfig
  lawyer: LawyerConfig
  lastUpdated: string
  setEntity: (entity: Partial<LegalEntity>) => void
  setSubprocessors: (subprocessors: DPASubprocessor[]) => void
  updateSubprocessor: (id: string, data: Partial<DPASubprocessor>) => void
  addSubprocessor: (sub: DPASubprocessor) => void
  removeSubprocessor: (id: string) => void
  setTax: (tax: Partial<TaxConfig>) => void
  setInsurance: (insurance: Partial<InsuranceConfig>) => void
  setLawyer: (lawyer: Partial<LawyerConfig>) => void
}

const defaultSubprocessors: DPASubprocessor[] = [
  { id: 'supabase', name: 'Supabase', purpose: 'Database hosting, authentication', location: 'USA/EU', dpaUrl: 'https://supabase.com/legal/dpa', dpaSigned: false, dpaSignedDate: '', notes: '' },
  { id: 'anthropic', name: 'Anthropic', purpose: 'AI processing (Claude API)', location: 'USA', dpaUrl: 'https://www.anthropic.com/legal/commercial-terms', dpaSigned: false, dpaSignedDate: '', notes: '' },
  { id: 'stripe', name: 'Stripe', purpose: 'Payment processing', location: 'USA/EU', dpaUrl: 'https://stripe.com/legal/dpa', dpaSigned: false, dpaSignedDate: '', notes: '' },
  { id: 'vercel', name: 'Vercel', purpose: 'Application hosting, CDN', location: 'USA/EU', dpaUrl: 'https://vercel.com/legal/dpa', dpaSigned: false, dpaSignedDate: '', notes: '' },
]

export const useLegalConfigStore = create<LegalConfigState>()(
  persist(
    (set) => ({
      entity: {
        companyName: '',
        companyType: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Spain',
        vatId: '',
        phone: '',
        email: '',
        legalEmail: 'legal@complyze.eu',
        privacyEmail: 'privacy@complyze.eu',
        responsiblePerson: '',
        responsibleRole: '',
        commercialRegister: '',
        commercialRegisterNumber: '',
      },
      subprocessors: defaultSubprocessors,
      tax: {
        taxRegime: 'IGIC',
        taxRate: '7%',
        vatOssRegistered: false,
        vatOssNumber: '',
        stripeTaxEnabled: false,
        stripeTaxId: '',
        invoicePrefix: 'CMP',
        invoiceNextNumber: 1,
      },
      insurance: {
        hasInsurance: false,
        provider: '',
        policyNumber: '',
        coverageAmount: '',
        coverageType: 'Professional liability (RC profesional)',
        expiryDate: '',
        contactEmail: '',
      },
      lawyer: {
        hasConsulted: false,
        lawyerName: '',
        firmName: '',
        consultationDate: '',
        reviewStatus: 'pending',
        notes: '',
        contactEmail: '',
      },
      lastUpdated: '',
      setEntity: (entity) =>
        set((s) => ({ entity: { ...s.entity, ...entity }, lastUpdated: new Date().toISOString() })),
      setSubprocessors: (subprocessors) =>
        set({ subprocessors, lastUpdated: new Date().toISOString() }),
      updateSubprocessor: (id, data) =>
        set((s) => ({
          subprocessors: s.subprocessors.map((sub) =>
            sub.id === id ? { ...sub, ...data } : sub
          ),
          lastUpdated: new Date().toISOString(),
        })),
      addSubprocessor: (sub) =>
        set((s) => ({ subprocessors: [...s.subprocessors, sub], lastUpdated: new Date().toISOString() })),
      removeSubprocessor: (id) =>
        set((s) => ({ subprocessors: s.subprocessors.filter((sub) => sub.id !== id), lastUpdated: new Date().toISOString() })),
      setTax: (tax) =>
        set((s) => ({ tax: { ...s.tax, ...tax }, lastUpdated: new Date().toISOString() })),
      setInsurance: (insurance) =>
        set((s) => ({ insurance: { ...s.insurance, ...insurance }, lastUpdated: new Date().toISOString() })),
      setLawyer: (lawyer) =>
        set((s) => ({ lawyer: { ...s.lawyer, ...lawyer }, lastUpdated: new Date().toISOString() })),
    }),
    { name: 'complyze_legal_config' }
  )
)
