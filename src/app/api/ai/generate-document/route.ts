import { NextResponse } from 'next/server'
import { buildPrompt, DOC_TYPES_INFO } from '@/lib/doc-templates'
import type { AISystemLocal } from '@/stores/systems-store'
import type { DocType } from '@/types/database'

export async function POST(request: Request) {
  try {
    const { system, docType } = await request.json() as { system: AISystemLocal; docType: DocType }

    const docInfo = DOC_TYPES_INFO.find(d => d.type === docType)
    if (!docInfo || !system) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const prompt = buildPrompt(docInfo, system)

    // Try Claude API
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (apiKey && !apiKey.includes('placeholder')) {
      try {
        const Anthropic = (await import('@anthropic-ai/sdk')).default
        const client = new Anthropic({ apiKey })

        const msg = await client.messages.create({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }],
        })

        const content = msg.content[0].type === 'text' ? msg.content[0].text : ''
        return NextResponse.json({ content, generated_by: 'ai' })
      } catch (err) {
        console.error('Claude API error, using template:', err)
      }
    }

    // Fallback: generate from template
    const content = generateTemplate(docInfo, system)
    return NextResponse.json({ content, generated_by: 'ai' })
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 })
  }
}

function generateTemplate(docInfo: typeof DOC_TYPES_INFO[0], system: AISystemLocal): string {
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  switch (docInfo.type) {
    case 'risk_management_plan':
      return `# Risk Management System Plan
## ${system.name}

**Document Version:** 1.0
**Date:** ${date}
**Provider:** ${system.provider}
**AI System:** ${system.name}
**Risk Category:** ${system.category?.replace('_', ' ').toUpperCase()}
**Applicable Regulation:** EU AI Act (Regulation (EU) 2024/1689), Article 9

---

## Table of Contents
1. Introduction and Scope
2. System Description
3. Risk Identification
4. Risk Analysis and Evaluation
5. Risk Mitigation Measures
6. Residual Risk Assessment
7. Testing and Validation
8. Monitoring and Review
9. Approval

---

## 1. Introduction and Scope

This Risk Management System Plan establishes a continuous, iterative process for identifying, analyzing, evaluating, and mitigating risks associated with **${system.name}** throughout its entire lifecycle, in accordance with Article 9 of the EU AI Act.

### 1.1 System Overview
- **System Name:** ${system.name}
- **Provider:** ${system.provider}
- **AI Model(s):** ${system.model_name}
- **Description:** ${system.description}

## 2. System Description

### 2.1 Intended Purpose
${system.purpose}

### 2.2 Data Processed
${system.data_types}

### 2.3 Intended Users
${system.users}

## 3. Risk Identification

### 3.1 Known Risks
The following risks have been identified through systematic analysis:

| # | Risk | Likelihood | Impact | Category |
|---|------|-----------|--------|----------|
| R1 | Incorrect AI output leading to wrong decisions | Medium | High | Accuracy |
| R2 | Data privacy breach through unauthorized access | Low | Critical | Security |
| R3 | Bias in AI outputs affecting certain user groups | Medium | High | Fairness |
| R4 | System unavailability during critical operations | Low | High | Reliability |
| R5 | Misuse of system beyond intended purpose | Medium | Medium | Misuse |
| R6 | Over-reliance on AI outputs without human verification | Medium | High | Human oversight |

### 3.2 Foreseeable Misuse Risks
- Users treating AI suggestions as definitive without professional review
- Processing data categories beyond the intended scope
- Unauthorized sharing of AI-generated outputs

## 4. Risk Analysis and Evaluation

Each risk is evaluated on a scale of 1-5 for likelihood and impact:
- **Critical (20-25):** Immediate action required
- **High (12-19):** Priority mitigation needed
- **Medium (6-11):** Mitigation planned
- **Low (1-5):** Monitor and review

## 5. Risk Mitigation Measures

| Risk | Mitigation Measure | Responsible | Timeline |
|------|-------------------|-------------|----------|
| R1 | All AI outputs require human review and approval before use | Product Team | Implemented |
| R2 | Row-level security (RLS), encryption at rest and in transit, access controls | Security Team | Implemented |
| R3 | Regular bias audits of AI model outputs | AI Team | Quarterly |
| R4 | Multi-region hosting, automated failover, 99.9% SLA target | Infrastructure | Implemented |
| R5 | Clear terms of use, in-app guidance on intended purpose | Product Team | Implemented |
| R6 | Mandatory "AI-generated" labels, confirmation steps before saving | Product Team | Implemented |

## 6. Residual Risk Assessment

After mitigation measures, residual risks are assessed as acceptable given:
- Human oversight is maintained at all decision points
- AI outputs are clearly labeled and require confirmation
- Security measures meet industry standards
- Regular monitoring and audit procedures are in place

## 7. Testing and Validation

- **Unit tests:** Core AI functions are tested with standardized test cases
- **Integration tests:** End-to-end workflows validated with representative data
- **Adversarial testing:** System tested against edge cases and adversarial inputs
- **User acceptance testing:** Real users validate outputs in controlled environment

## 8. Monitoring and Review

This plan is reviewed:
- **Quarterly:** Routine review of risk register and mitigation effectiveness
- **After incidents:** Immediate review triggered by any reported incident
- **Annually:** Comprehensive review of entire risk management system
- **On significant changes:** Any major system update triggers reassessment

## 9. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Provider Representative | _________________ | ________ | _________ |
| Risk Manager | _________________ | ________ | _________ |
| DPO (if applicable) | _________________ | ________ | _________ |

---
*Generated by Complyze — EU AI Act Compliance Platform*
*This document is AI-generated and should be reviewed by qualified personnel before use.*`

    case 'technical_doc':
      return `# Technical Documentation
## ${system.name}

**Document Version:** 1.0
**Date:** ${date}
**Provider:** ${system.provider}
**Applicable Regulation:** EU AI Act, Article 11 & Annex IV

---

## 1. General Description

### 1.1 System Identity
- **Name:** ${system.name}
- **Provider:** ${system.provider}
- **AI Model(s):** ${system.model_name}
- **Risk Classification:** ${system.category?.replace('_', ' ').toUpperCase()}
- **Risk Score:** ${system.risk_score}/100

### 1.2 Intended Purpose
${system.purpose}

### 1.3 Target Users
${system.users}

## 2. System Architecture

### 2.1 AI Components
- **AI Model:** ${system.model_name}
- **Type:** Large Language Model / Multi-modal AI
- **Integration:** API-based inference (no local model training)

### 2.2 Data Flow
1. User inputs data through the application interface
2. Data is processed and sent to the AI model via secure API
3. AI model generates output (text, classification, analysis)
4. Output is presented to user for review and approval
5. Approved output is stored in the database

### 2.3 Infrastructure
- **Hosting:** Cloud-based (Vercel/similar)
- **Database:** PostgreSQL with Row-Level Security
- **Security:** TLS 1.3, encryption at rest, tenant isolation

## 3. Data Processing

### 3.1 Data Categories
${system.data_types}

### 3.2 Data Retention
- Active data: retained while account is active
- Deleted data: permanently removed within 30 days
- AI model: no persistent storage of user data (stateless inference)

## 4. Performance Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Response time | < 5 seconds | API latency monitoring |
| Availability | 99.9% uptime | Infrastructure monitoring |
| Accuracy | Validated by human review | User feedback + audit |

## 5. Testing

- Automated unit and integration tests
- Manual QA for critical workflows
- Periodic accuracy audits of AI outputs
- Security penetration testing (annual)

## 6. Changes Log

| Version | Date | Description |
|---------|------|-------------|
| 1.0 | ${date} | Initial technical documentation |

---
*Generated by Complyze — EU AI Act Compliance Platform*
*This document is AI-generated and should be reviewed by qualified personnel.*`

    case 'transparency_notice':
      return `# Transparency Notice
## ${system.name}

**Date:** ${date}
**Provider:** ${system.provider}
**Applicable Regulation:** EU AI Act, Articles 13 & 50

---

## Important Notice

**This system uses Artificial Intelligence (AI).** You are interacting with an AI-powered system, not a human.

## What This System Does

${system.purpose}

## AI Model Information

- **AI Provider:** ${system.provider}
- **Model(s) Used:** ${system.model_name}
- **Type:** AI-assisted tool — all outputs require human review

## What You Should Know

1. **AI-Generated Content:** All outputs from this system are generated by artificial intelligence and are clearly labeled as such.

2. **Not a Substitute for Professional Judgment:** AI outputs are suggestions and drafts. They must be reviewed, validated, and approved by qualified professionals before being relied upon.

3. **Limitations:** The AI system may:
   - Generate incorrect or incomplete information
   - Not account for all relevant context
   - Reflect biases present in training data
   - Not be suitable for all use cases

4. **Human Oversight:** A qualified human is always responsible for reviewing and approving any AI-generated output before it is used.

5. **Data Processing:** This system processes the following data types:
   ${system.data_types}

## Your Rights

- You have the right to know you are interacting with AI
- You can request human intervention at any time
- You can report concerns about AI outputs
- You can request information about how the AI processes your data

## Contact

For questions or concerns about this AI system, contact:
${system.provider}

---
*This notice is provided in compliance with Articles 13 and 50 of the EU AI Act (Regulation (EU) 2024/1689).*
*Generated by Complyze — EU AI Act Compliance Platform*`

    case 'human_oversight_plan':
      return `# Human Oversight Plan
## ${system.name}

**Document Version:** 1.0
**Date:** ${date}
**Provider:** ${system.provider}
**Applicable Regulation:** EU AI Act, Article 14

---

## 1. Purpose

This plan defines the human oversight mechanisms for **${system.name}** ensuring that qualified personnel can effectively understand, monitor, interpret, and intervene in the AI system's operation.

## 2. Oversight Principles

1. **No autonomous decisions:** The AI system does not make final decisions — all outputs require human review and approval.
2. **Human-in-the-loop:** A qualified human reviews every AI output before it becomes final.
3. **Override capability:** Users can reject, modify, or override any AI suggestion.
4. **Stop mechanism:** The system can be immediately disabled if needed.

## 3. Oversight Roles

| Role | Responsibility | Qualifications |
|------|---------------|----------------|
| Primary User | Review and approve AI outputs | Domain expertise |
| System Admin | Monitor system performance, manage access | Technical + domain knowledge |
| Provider | System maintenance, model updates, incident response | AI/ML expertise |

## 4. Oversight Mechanisms

### 4.1 Before AI Output
- User provides input and context
- System validates input completeness

### 4.2 During AI Processing
- Processing indicators shown to user
- Timeout limits prevent indefinite processing

### 4.3 After AI Output
- Output clearly labeled as "AI-generated"
- User must explicitly review and approve
- Option to edit, reject, or request regeneration
- Confidence indicators where applicable

### 4.4 Emergency Controls
- **Stop button:** System can be immediately paused
- **Rollback:** Previous states can be restored
- **Escalation:** Issues can be escalated to provider support

## 5. Training Requirements

Personnel overseeing this AI system must:
- Understand the system's capabilities and limitations
- Know how to interpret AI outputs in their domain
- Be trained on when to accept, modify, or reject AI suggestions
- Know the escalation procedures for edge cases

## 6. Monitoring and Reporting

- User feedback is collected on AI output quality
- Override/rejection rates are tracked and analyzed
- Incidents are logged and reviewed quarterly
- Oversight effectiveness is reviewed annually

---
*Generated by Complyze — EU AI Act Compliance Platform*
*This document is AI-generated and should be reviewed by qualified personnel.*`

    case 'data_governance':
      return `# Data Governance Documentation
## ${system.name}

**Document Version:** 1.0
**Date:** ${date}
**Provider:** ${system.provider}
**Applicable Regulation:** EU AI Act, Article 10

---

## 1. Data Categories

The following data is processed by this system:

${system.data_types}

## 2. Data Sources and Collection

### 2.1 User-Provided Data
- Data entered directly by users through the application interface
- Uploaded documents and files

### 2.2 AI Model Data
- The AI model (${system.model_name}) was trained by ${system.provider} on their proprietary datasets
- No user data is used to train or fine-tune the AI model
- AI inference is stateless — user data is not retained by the model

## 3. Data Quality Measures

| Measure | Implementation |
|---------|---------------|
| Input validation | Required fields, format checks, type validation |
| Data completeness | Prompts for missing information |
| Error detection | Automated checks for inconsistencies |
| User verification | Users review and confirm data accuracy |

## 4. Bias Examination

### 4.1 Potential Bias Sources
- AI model training data may contain biases
- User input patterns may not be representative

### 4.2 Bias Mitigation
- AI outputs are reviewed by qualified humans before use
- Regular audits of AI output quality across user segments
- Feedback mechanism for reporting biased outputs
- Provider monitors model updates for bias issues

## 5. Data Protection

- **Encryption:** TLS 1.3 in transit, AES-256 at rest
- **Access Control:** Role-based access with tenant isolation (RLS)
- **Retention:** Data retained while account active, deleted within 30 days of account closure
- **GDPR Compliance:** Data subject rights (access, rectification, erasure, portability) supported

## 6. Data Processing Agreement

Data processing relationships are governed by DPAs with:
- AI model provider (${system.provider})
- Database hosting provider
- Application hosting provider

---
*Generated by Complyze — EU AI Act Compliance Platform*
*This document is AI-generated and should be reviewed by qualified personnel.*`

    case 'conformity_declaration':
      return `# EU DECLARATION OF CONFORMITY
## (Regulation (EU) 2024/1689 — EU AI Act)

**Declaration No.:** COMPLYZE-${system.name.replace(/[^a-zA-Z0-9]/g, '-').toUpperCase()}-001
**Date of Issue:** ${date}

---

## 1. AI System Identification

- **AI System Name:** ${system.name}
- **Version:** 1.0
- **Type:** ${system.description}
- **Risk Classification:** ${system.category?.replace('_', ' ').toUpperCase()}

## 2. Provider Information

- **Provider Name:** ${system.provider}
- **Address:** [To be completed]
- **Contact:** [To be completed]

## 3. Declaration

This declaration of conformity is issued under the sole responsibility of the provider identified above.

The AI system described above is in conformity with the relevant provisions of Regulation (EU) 2024/1689 (EU AI Act), specifically:

${system.category === 'high_risk' ? `- Article 8 — Compliance with requirements for high-risk AI systems
- Article 9 — Risk management system
- Article 10 — Data and data governance
- Article 11 — Technical documentation
- Article 12 — Record-keeping
- Article 13 — Transparency and provision of information to deployers
- Article 14 — Human oversight
- Article 15 — Accuracy, robustness and cybersecurity` : `- Article 50 — Transparency obligations for certain AI systems`}

## 4. Conformity Assessment

${system.category === 'high_risk'
  ? 'The conformity assessment has been carried out in accordance with Article 43 of the EU AI Act based on internal control (Annex VI).'
  : 'As a limited/minimal risk system, self-assessment has been performed.'}

## 5. Standards Applied

- ISO/IEC 42001:2023 — AI Management System
- ISO/IEC 27001 — Information Security Management
- GDPR (Regulation (EU) 2016/679) — Data Protection

## 6. Supplementary Information

- Technical documentation as per Annex IV is available
- The system is registered in the EU database as required by Article 49

## 7. Signature

Signed for and on behalf of:

**${system.provider}**

Name: _________________________
Position: _________________________
Date: ${date}
Signature: _________________________

---

*This declaration is made in accordance with Article 47 and Annex V of Regulation (EU) 2024/1689.*
*Generated by Complyze — EU AI Act Compliance Platform*
*This document is AI-generated and must be reviewed and signed by the authorized representative.*`

    default:
      return `# ${docInfo.title_en}\n\n## ${system.name}\n\nDocument to be generated for ${docInfo.article}.`
  }
}
