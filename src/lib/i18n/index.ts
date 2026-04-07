import type { Lang } from '@/types/database'
import { T } from './translations'

export { T, LANGUAGES } from './translations'

const STORAGE_KEY = 'complyze_lang'

export function detectLanguage(): Lang {
  if (typeof window === 'undefined') return 'en'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && isValidLang(stored)) return stored
  const browser = navigator.language.slice(0, 2).toLowerCase()
  if (isValidLang(browser)) return browser
  return 'en'
}

export function setLanguage(lang: Lang) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang)
  }
}

export function t(lang: Lang, key: keyof typeof T['en']): string {
  return T[lang][key] ?? T['en'][key] ?? key
}

function isValidLang(v: string): v is Lang {
  return ['es', 'en', 'fr', 'de', 'it'].includes(v)
}
