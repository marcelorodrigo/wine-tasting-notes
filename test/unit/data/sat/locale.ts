import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..')
const LOCALE_PATH = join(ROOT, 'app', 'i18n', 'locales', 'en.json')

const locale = JSON.parse(readFileSync(LOCALE_PATH, 'utf-8')) as Record<string, unknown>

export function localeValue(key: string): unknown {
  return key.split('.').reduce<unknown>((node, segment) => {
    if (node && typeof node === 'object') {
      return (node as Record<string, unknown>)[segment]
    }
    return undefined
  }, locale)
}

export function hasLocaleKey(key: string): boolean {
  return typeof localeValue(key) === 'string'
}
