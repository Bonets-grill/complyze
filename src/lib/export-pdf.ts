'use client'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function mdToHtml(md: string): string {
  const lines = md.split('\n')
  const result: string[] = []
  let inTable = false
  let inList = false

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      if (inTable) { result.push('</table>'); inTable = false }
      if (inList) { result.push('</ul>'); inList = false }
      continue
    }

    // Headers
    if (line.startsWith('### ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h3>${applyInline(line.slice(4))}</h3>`)
      continue
    }
    if (line.startsWith('## ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h2>${applyInline(line.slice(3))}</h2>`)
      continue
    }
    if (line.startsWith('# ')) {
      if (inList) { result.push('</ul>'); inList = false }
      result.push(`<h1>${applyInline(line.slice(2))}</h1>`)
      continue
    }

    // Horizontal rule
    if (line.trim() === '---' || line.trim() === '***') {
      if (inList) { result.push('</ul>'); inList = false }
      result.push('<hr>')
      continue
    }

    // Table rows
    if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (inList) { result.push('</ul>'); inList = false }
      const cells = line.split('|').slice(1, -1)
      // Skip separator rows like |---|---|
      if (cells.every(c => /^[\s\-:]+$/.test(c))) continue
      if (!inTable) { result.push('<table>'); inTable = true }
      const isHeader = i + 1 < lines.length && /^\|[\s\-:|]+\|$/.test(lines[i + 1].trim())
      const tag = isHeader ? 'th' : 'td'
      const row = cells.map(c => `<${tag}>${applyInline(c.trim())}</${tag}>`).join('')
      result.push(`<tr>${row}</tr>`)
      continue
    }

    // Close table if we're no longer in table rows
    if (inTable) { result.push('</table>'); inTable = false }

    // List items
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      if (!inList) { result.push('<ul>'); inList = true }
      const content = line.trim().replace(/^[-*]\s+/, '')
      result.push(`<li>${applyInline(content)}</li>`)
      continue
    }

    // Numbered list
    if (/^\d+\.\s/.test(line.trim())) {
      if (!inList) { result.push('<ul>'); inList = true }
      const content = line.trim().replace(/^\d+\.\s+/, '')
      result.push(`<li>${applyInline(content)}</li>`)
      continue
    }

    // Close list if we're no longer in list items
    if (inList) { result.push('</ul>'); inList = false }

    // Regular paragraph
    result.push(`<p>${applyInline(line)}</p>`)
  }

  if (inTable) result.push('</table>')
  if (inList) result.push('</ul>')

  return result.join('\n')
}

function applyInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
}

function buildFullHTML(title: string, htmlContent: string, systemName: string): string {
  const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)} - ${escapeHtml(systemName)}</title>
<style>
@media print {
  body { margin: 0; padding: 15mm; }
  .no-print { display: none !important; }
}
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
  color: #1a1a1a;
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  line-height: 1.7;
  font-size: 14px;
  background: #fff;
}
.header {
  text-align: center;
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 3px solid #2563EB;
}
.logo {
  display: inline-block;
  background: #2563EB;
  color: white;
  font-weight: bold;
  font-size: 20px;
  width: 44px;
  height: 44px;
  line-height: 44px;
  border-radius: 10px;
}
.header h1 { margin: 12px 0 4px; font-size: 26px; color: #2563EB; letter-spacing: 2px; }
.header .subtitle { margin: 0; font-size: 12px; color: #888; }
.meta-box {
  margin-bottom: 30px;
  padding: 16px;
  background: #f7f8fa;
  border-radius: 8px;
  border-left: 4px solid #2563EB;
}
.meta-box .label { margin: 0 0 4px; font-size: 11px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
.meta-box .value { margin: 0; font-size: 15px; font-weight: 600; color: #1a1a1a; }
.content h1 { font-size: 22px; color: #111; margin: 32px 0 12px; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb; }
.content h2 { font-size: 18px; color: #2563EB; margin: 28px 0 10px; }
.content h3 { font-size: 15px; color: #333; margin: 22px 0 8px; }
.content p { margin: 8px 0; }
.content table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 13px; }
.content th, .content td { border: 1px solid #d1d5db; padding: 8px 12px; text-align: left; }
.content th { background: #f3f4f6; font-weight: 600; color: #374151; }
.content tr:nth-child(even) td { background: #f9fafb; }
.content ul { padding-left: 24px; margin: 8px 0; }
.content li { margin-bottom: 6px; }
.content hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
.content strong { color: #111; }
.content code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
.footer {
  margin-top: 50px;
  padding-top: 20px;
  border-top: 2px solid #e5e7eb;
  text-align: center;
}
.footer p { margin: 4px 0; font-size: 11px; color: #9ca3af; }
.actions {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 1000;
}
.btn {
  background: #2563EB;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.btn:hover { background: #1d4ed8; }
.btn-outline {
  background: white;
  color: #2563EB;
  border: 2px solid #2563EB;
}
.btn-outline:hover { background: #eff6ff; }
</style>
</head>
<body>
<div class="actions no-print">
  <button class="btn" onclick="window.print()">Save as PDF</button>
</div>

<div class="header">
  <div class="logo">C</div>
  <h1>COMPLYZE</h1>
  <p class="subtitle">EU AI Act Compliance Platform</p>
</div>

<div class="meta-box">
  <p class="label">AI System</p>
  <p class="value">${escapeHtml(systemName)}</p>
</div>

<div class="meta-box" style="border-left-color: #10B981;">
  <p class="label">Document</p>
  <p class="value">${escapeHtml(title)}</p>
</div>

<div class="content">
${htmlContent}
</div>

<div class="footer">
  <p><strong>Generated by Complyze</strong> — EU AI Act Compliance Platform</p>
  <p>This document is AI-generated and should be reviewed by qualified personnel before official use.</p>
  <p>Generation date: ${date}</p>
</div>

</body>
</html>`
}

export function exportDocumentToPDF(title: string, content: string, systemName: string) {
  const htmlContent = mdToHtml(content)
  const fullHtml = buildFullHTML(title, htmlContent, systemName)

  // Use Blob URL — works in Safari, Chrome, Firefox
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener'
  a.click()
  // Clean up after a delay
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}

export function exportAllDocumentsToPDF(
  documents: { title: string; content: string }[],
  systemName: string
) {
  const allHtmlContent = documents.map(doc => {
    const docHtml = mdToHtml(doc.content)
    return `<div style="page-break-after: always;">
      <h1 style="color: #2563EB; border-bottom: 2px solid #2563EB; padding-bottom: 10px;">${escapeHtml(doc.title)}</h1>
      ${docHtml}
    </div>`
  }).join('\n')

  const fullHtml = buildFullHTML(`All Documents — ${systemName}`, allHtmlContent, systemName)
  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
