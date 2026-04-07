#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

function walk(dir, prefix = '') {
  const entries = [];
  if (!fs.existsSync(dir)) return entries;
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.name.startsWith('.') || item.name === 'node_modules' || item.name === '.next') continue;
    const rel = path.join(prefix, item.name);
    if (item.isDirectory()) {
      entries.push(...walk(path.join(dir, item.name), rel));
    } else if (/\.(ts|tsx|js|jsx|sql|css)$/.test(item.name)) {
      entries.push(rel);
    }
  }
  return entries;
}

function getPages() {
  const appDir = path.join(SRC, 'app');
  const pages = [];
  function scan(dir, route = '') {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name.startsWith('.') || item.name === 'node_modules') continue;
      if (item.isDirectory()) {
        const seg = item.name.startsWith('(') ? '' : '/' + item.name;
        scan(path.join(dir, item.name), route + seg);
      } else if (item.name === 'page.tsx' || item.name === 'page.ts') {
        pages.push(route || '/');
      }
    }
  }
  scan(appDir);
  return pages.sort();
}

function getApiRoutes() {
  const apiDir = path.join(SRC, 'app', 'api');
  const routes = [];
  function scan(dir, route = '/api') {
    if (!fs.existsSync(dir)) return;
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      if (item.name.startsWith('.')) continue;
      if (item.isDirectory()) {
        scan(path.join(dir, item.name), route + '/' + item.name);
      } else if (item.name === 'route.ts' || item.name === 'route.js') {
        routes.push(route);
      }
    }
  }
  scan(apiDir);
  return routes.sort();
}

function getComponents() {
  const compDir = path.join(SRC, 'components');
  return walk(compDir).filter(f => /\.(tsx|ts)$/.test(f));
}

function getStores() {
  const storeDir = path.join(SRC, 'stores');
  return walk(storeDir).filter(f => /\.(ts|tsx)$/.test(f));
}

function getLibFiles() {
  const libDir = path.join(SRC, 'lib');
  return walk(libDir).filter(f => /\.(ts|tsx)$/.test(f));
}

function getMigrations() {
  const migDir = path.join(ROOT, 'supabase', 'migrations');
  if (!fs.existsSync(migDir)) return [];
  return fs.readdirSync(migDir).filter(f => f.endsWith('.sql'));
}

function countFiles(dir) {
  if (!fs.existsSync(dir)) return 0;
  return walk(dir).length;
}

// Build the map
const pages = getPages();
const apiRoutes = getApiRoutes();
const components = getComponents();
const stores = getStores();
const libs = getLibFiles();
const migrations = getMigrations();
const totalFiles = countFiles(SRC);

const now = new Date().toISOString().split('T')[0];

let md = `# CODEBASE_MAP.md — Complyze

> Auto-generated on ${now} by \`node scripts/generate-codemap.js\`

## Overview

- **Project**: Complyze — EU AI Act Compliance Platform
- **Stack**: Next.js 16 + React 19 + Supabase + Tailwind 4 + shadcn/ui + Zustand
- **Total source files**: ${totalFiles}
- **Pages**: ${pages.length}
- **API Routes**: ${apiRoutes.length}
- **Components**: ${components.length}
- **Stores**: ${stores.length}

## Pages

| Route | File |
|-------|------|
${pages.map(p => '| `' + p + '` | `src/app/.../' + (p === '/' ? '(marketing)' : p.slice(1)) + '/page.tsx` |').join('\n')}

## API Routes

| Endpoint | File |
|----------|------|
${apiRoutes.map(r => `| \`${r}\` | \`src/app${r}/route.ts\` |`).join('\n')}

## Components

| File |
|------|
${components.map(f => `| \`src/components/${f}\` |`).join('\n')}

## Stores

| File |
|------|
${stores.map(f => `| \`src/stores/${f}\` |`).join('\n')}

## Libraries

| File |
|------|
${libs.map(f => `| \`src/lib/${f}\` |`).join('\n')}

## Database Migrations

| File |
|------|
${migrations.map(f => `| \`supabase/migrations/${f}\` |`).join('\n')}

## Architecture

\`\`\`
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Auth pages (login, register, forgot-password)
│   ├── (app)/        # Protected app pages (dashboard, systems, etc.)
│   ├── (marketing)/  # Public landing page
│   └── api/          # API routes
├── components/
│   ├── ui/           # shadcn/ui components
│   ├── layout/       # AppShell, Sidebar, Header, Breadcrumbs
│   └── ...           # Feature-specific components
├── lib/
│   ├── supabase/     # Supabase client + server + middleware
│   ├── i18n/         # Translation engine + 5 locales
│   ├── ai/           # Claude API helpers (future)
│   └── stripe/       # Stripe helpers (future)
├── stores/           # Zustand stores (auth, ui)
└── types/            # TypeScript types (database)
\`\`\`

## i18n Languages

ES (Spanish), EN (English), FR (French), DE (German), IT (Italian)
`;

fs.writeFileSync(path.join(ROOT, 'CODEBASE_MAP.md'), md);
console.log(`CODEBASE_MAP.md generated: ${totalFiles} files, ${pages.length} pages, ${apiRoutes.length} API routes`);
