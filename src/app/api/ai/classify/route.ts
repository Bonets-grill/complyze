import { NextResponse } from 'next/server'

interface ClassifyRequest {
  name: string
  description: string
  provider: string
  model_name: string
  purpose: string
  data_types: string
  users: string
}

interface ClassifyResponse {
  category: 'prohibited' | 'high_risk' | 'limited_risk' | 'minimal_risk'
  risk_score: number
  reasoning: string
  eu_articles: string[]
}

function mockClassify(data: ClassifyRequest): ClassifyResponse {
  const text = `${data.purpose} ${data.description} ${data.data_types} ${data.users}`.toLowerCase()

  // Prohibited (Art. 5)
  if (
    text.includes('social scoring') ||
    text.includes('biometric') && text.includes('real-time') ||
    text.includes('subliminal') ||
    text.includes('exploit') && text.includes('vulnerabilit')
  ) {
    return {
      category: 'prohibited',
      risk_score: 95,
      reasoning: 'This AI system falls under prohibited practices as defined in Article 5 of the EU AI Act. Systems involving real-time biometric identification, social scoring, or subliminal manipulation are explicitly banned.',
      eu_articles: ['Art. 5'],
    }
  }

  // High risk (Art. 6, Annex III)
  if (
    text.includes('hiring') || text.includes('recruitment') || text.includes('employment') ||
    text.includes('credit') || text.includes('insurance scoring') ||
    text.includes('law enforcement') || text.includes('border') ||
    text.includes('medical') || text.includes('diagnostic') || text.includes('health') ||
    text.includes('education') || text.includes('grading') || text.includes('exam') ||
    text.includes('critical infrastructure') || text.includes('safety') ||
    text.includes('migration') || text.includes('asylum') ||
    text.includes('justice') || text.includes('court') || text.includes('judicial')
  ) {
    return {
      category: 'high_risk',
      risk_score: 75,
      reasoning: 'This AI system is classified as high-risk under Article 6 and Annex III of the EU AI Act. It operates in a domain (employment, credit, healthcare, education, law enforcement, or critical infrastructure) that requires mandatory compliance with Articles 8-15, including risk management, data governance, transparency, human oversight, and technical documentation.',
      eu_articles: ['Art. 6', 'Art. 8', 'Art. 9', 'Art. 10', 'Art. 11', 'Art. 12', 'Art. 13', 'Art. 14', 'Art. 15'],
    }
  }

  // Limited risk (Art. 50)
  if (
    text.includes('chatbot') || text.includes('customer service') || text.includes('support') ||
    text.includes('content generation') || text.includes('text generation') ||
    text.includes('image generation') || text.includes('deepfake') ||
    text.includes('emotion recognition') ||
    text.includes('translation') || text.includes('summariz')
  ) {
    return {
      category: 'limited_risk',
      risk_score: 40,
      reasoning: 'This AI system is classified as limited risk under Article 50 of the EU AI Act. It has transparency obligations: users must be informed they are interacting with an AI system, and AI-generated content must be labeled as such.',
      eu_articles: ['Art. 50'],
    }
  }

  // Minimal risk
  return {
    category: 'minimal_risk',
    risk_score: 15,
    reasoning: 'This AI system is classified as minimal risk. While no mandatory requirements apply under the EU AI Act, voluntary codes of conduct (Art. 95) are encouraged. We recommend maintaining basic documentation and transparency as best practice.',
    eu_articles: ['Art. 95'],
  }
}

export async function POST(request: Request) {
  try {
  const data: ClassifyRequest = await request.json()

  if (!data.name || !data.purpose) {
    return NextResponse.json(
      { error: 'name and purpose are required' },
      { status: 400 }
    )
  }

  // Try Claude API if key exists
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (apiKey && !apiKey.includes('placeholder')) {
    try {
      const Anthropic = (await import('@anthropic-ai/sdk')).default
      const client = new Anthropic({ apiKey })

      const prompt = `You are an EU AI Act compliance expert. Classify the following AI system by risk level according to the EU AI Act (Regulation (EU) 2024/1689).

AI System Details:
- Name: ${data.name}
- Provider: ${data.provider}
- Model: ${data.model_name}
- Description: ${data.description}
- Purpose: ${data.purpose}
- Data processed: ${data.data_types}
- Users: ${data.users}

Risk Categories:
1. PROHIBITED (Art. 5): Social scoring, real-time biometric ID, subliminal manipulation, exploitation of vulnerabilities
2. HIGH_RISK (Art. 6, Annex III): Employment, credit, healthcare, education, law enforcement, critical infrastructure, migration, justice
3. LIMITED_RISK (Art. 50): Chatbots, content generation, emotion recognition, deepfakes
4. MINIMAL_RISK (Art. 95): Everything else, voluntary codes of conduct

Respond in this exact JSON format:
{"category": "prohibited|high_risk|limited_risk|minimal_risk", "risk_score": 0-100, "reasoning": "detailed explanation", "eu_articles": ["Art. X", "Art. Y"]}`

      const msg = await client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = msg.content[0].type === 'text' ? msg.content[0].text : ''
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]) as ClassifyResponse
        return NextResponse.json(result)
      }
    } catch (err) {
      console.error('Claude API error, falling back to mock:', err)
    }
  }

  // Fallback: keyword-based mock classification
  const result = mockClassify(data)
  return NextResponse.json(result)
  } catch {
    return NextResponse.json(
      { error: 'Classification failed' },
      { status: 500 }
    )
  }
}
