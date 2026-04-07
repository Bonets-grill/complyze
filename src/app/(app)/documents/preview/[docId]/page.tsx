'use client'

import { useParams, useRouter } from 'next/navigation'
import { useDocumentsStore } from '@/stores/documents-store'
import { useSystemsStore } from '@/stores/systems-store'
import { useEffect, useState } from 'react'

function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inTable = false
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    if (!line.trim()) {
      if (inTable) { out.push('</table>'); inTable = false }
      if (inList) { out.push('</ul>'); inList = false }
      continue
    }

    if (line.startsWith('### ')) { if (inList) { out.push('</ul>'); inList = false }; out.push(`<h3>${inline(line.slice(4))}</h3>`); continue }
    if (line.startsWith('## ')) { if (inList) { out.push('</ul>'); inList = false }; out.push(`<h2>${inline(line.slice(3))}</h2>`); continue }
    if (line.startsWith('# ')) { if (inList) { out.push('</ul>'); inList = false }; out.push(`<h1>${inline(line.slice(2))}</h1>`); continue }
    if (line.trim() === '---' || line.trim() === '***') { out.push('<hr>'); continue }

    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inList) { out.push('</ul>'); inList = false }
      const cells = line.split('|').slice(1, -1)
      if (cells.every(c => /^[\s\-:]+$/.test(c))) continue
      if (!inTable) { out.push('<table>'); inTable = true }
      const nextLine = i + 1 < lines.length ? lines[i + 1] : ''
      const isHeader = /^\|[\s\-:|]+\|$/.test(nextLine.trim())
      const tag = isHeader ? 'th' : 'td'
      out.push(`<tr>${cells.map(c => `<${tag}>${inline(c.trim())}</${tag}>`).join('')}</tr>`)
      continue
    }

    if (inTable) { out.push('</table>'); inTable = false }

    if (/^[\s]*[-*]\s/.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(line.replace(/^[\s]*[-*]\s+/, ''))}</li>`)
      continue
    }
    if (/^[\s]*\d+\.\s/.test(line)) {
      if (!inList) { out.push('<ul>'); inList = true }
      out.push(`<li>${inline(line.replace(/^[\s]*\d+\.\s+/, ''))}</li>`)
      continue
    }

    if (inList) { out.push('</ul>'); inList = false }
    out.push(`<p>${inline(line)}</p>`)
  }

  if (inTable) out.push('</table>')
  if (inList) out.push('</ul>')
  return out.join('\n')
}

function inline(t: string): string {
  return t
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
}

export default function DocumentPreviewPage() {
  const params = useParams()
  const router = useRouter()
  const docId = params.docId as string
  const { getDocument } = useDocumentsStore()
  const { getSystem } = useSystemsStore()
  const [ready, setReady] = useState(false)

  const doc = getDocument(docId)
  const system = doc ? getSystem(doc.ai_system_id) : undefined

  useEffect(() => {
    setReady(true)
  }, [])

  if (!ready) return null

  if (!doc || !system) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <p>Document not found</p>
        <button onClick={() => router.back()}>Go back</button>
      </div>
    )
  }

  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
  const htmlContent = mdToHtml(doc.content)

  return (
    <>
      <style jsx global>{`
        @media print {
          body > *:not(#print-root) { display: none !important; }
          #print-root { position: absolute; top: 0; left: 0; width: 100%; }
          .no-print { display: none !important; }
          aside, header, nav { display: none !important; }
        }
      `}</style>

      <div id="print-root">
        {/* Action bar */}
        <div className="no-print" style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: '#2563EB', padding: '12px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderRadius: 8, marginBottom: 24
        }}>
          <button
            onClick={() => router.back()}
            style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}
          >
            &larr; Back
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => window.print()}
              style={{
                background: 'white', color: '#2563EB', border: 'none',
                padding: '8px 20px', borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: 'pointer'
              }}
            >
              Save as PDF
            </button>
          </div>
        </div>

        {/* Document */}
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif',
          color: '#1a1a1a', maxWidth: 800, margin: '0 auto',
          lineHeight: 1.7, fontSize: 14, background: '#fff',
          padding: 40, borderRadius: 8, border: '1px solid #e5e7eb'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, paddingBottom: 20, borderBottom: '3px solid #2563EB' }}>
            <div style={{
              display: 'inline-block', background: '#2563EB', color: 'white',
              fontWeight: 'bold', fontSize: 20, width: 44, height: 44,
              lineHeight: '44px', borderRadius: 10
            }}>C</div>
            <h1 style={{ margin: '12px 0 4px', fontSize: 26, color: '#2563EB', letterSpacing: 2 }}>COMPLYZE</h1>
            <p style={{ margin: 0, fontSize: 12, color: '#888' }}>EU AI Act Compliance Platform</p>
          </div>

          {/* Meta */}
          <div style={{
            marginBottom: 16, padding: 16, background: '#f7f8fa',
            borderRadius: 8, borderLeft: '4px solid #2563EB'
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>AI System</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{system.name}</p>
          </div>
          <div style={{
            marginBottom: 30, padding: 16, background: '#f7f8fa',
            borderRadius: 8, borderLeft: '4px solid #10B981'
          }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: 1 }}>Document</p>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{doc.title}</p>
            <p style={{ margin: '4px 0 0', fontSize: 11, color: '#888' }}>Version {doc.version} &middot; Status: {doc.status}</p>
          </div>

          {/* Content */}
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{ fontSize: 14, lineHeight: 1.7 }}
          />

          {/* Footer */}
          <div style={{
            marginTop: 50, paddingTop: 20, borderTop: '2px solid #e5e7eb', textAlign: 'center'
          }}>
            <p style={{ margin: '4px 0', fontSize: 11, color: '#9ca3af' }}>
              <strong>Generated by Complyze</strong> — EU AI Act Compliance Platform
            </p>
            <p style={{ margin: '4px 0', fontSize: 11, color: '#9ca3af' }}>
              This document is AI-generated and should be reviewed by qualified personnel before official use.
            </p>
            <p style={{ margin: '4px 0', fontSize: 11, color: '#9ca3af' }}>
              Generation date: {date}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
