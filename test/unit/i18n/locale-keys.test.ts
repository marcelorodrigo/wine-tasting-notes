import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(import.meta.dirname, '..', '..', '..')
const LOCALE_PATH = join(ROOT, 'app', 'i18n', 'locales', 'en.json')
const APP_DIR = join(ROOT, 'app')

const REQUIRED_NAMESPACES = [
  'app',
  'shell',
  'error',
  'academy',
  'sat',
  'tasting',
  'validation',
  'note',
  'share',
  'legal',
  'offline',
  'errors',
]

function readRawLocale(): string {
  return readFileSync(LOCALE_PATH, 'utf-8')
}

function readLocaleJson(): Record<string, unknown> {
  return JSON.parse(readRawLocale())
}

function flattenLeafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenLeafKeys(value as Record<string, unknown>, path))
    } else {
      keys.push(path)
    }
  }
  return keys
}

function flattenAllKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = []
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key
    keys.push(path)
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...flattenAllKeys(value as Record<string, unknown>, path))
    }
  }
  return keys
}

function hasLeafKey(obj: Record<string, unknown>): boolean {
  for (const value of Object.values(obj)) {
    if (typeof value === 'string') return true
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if (hasLeafKey(value as Record<string, unknown>)) return true
    }
  }
  return false
}

function scanAppSourceForTKeys(): string[] {
  const refs: string[] = []
  const files = readdirSync(APP_DIR, { recursive: true, withFileTypes: true })
    .filter((f) => f.isFile() && (f.name.endsWith('.vue') || f.name.endsWith('.ts')))
    .map((f) => join(f.parentPath ?? f.path, f.name))

  for (const file of files) {
    const content = readFileSync(file, 'utf-8')
    const matches = content.matchAll(/\bt\(\s*['"]([^'"]+)['"]/g)
    for (const match of matches) {
      refs.push(match[1])
    }
  }

  return [...new Set(refs)]
}

function detectDuplicateKeysInRawJson(raw: string): string[] {
  const duplicates: string[] = []
  let index = 0

  function skipWhitespace(): void {
    while (index < raw.length && /\s/.test(raw[index] ?? '')) {
      index += 1
    }
  }

  function readString(): string {
    index += 1 // opening quote
    let value = ''
    while (index < raw.length) {
      const char = raw[index]
      if (char === '\\') {
        value += raw[index + 1] ?? ''
        index += 2
        continue
      }
      if (char === '"') {
        index += 1
        return value
      }
      value += char
      index += 1
    }
    throw new Error('Unterminated string while scanning locale JSON')
  }

  function readLiteral(): void {
    while (index < raw.length && !/[\s,\]}]/.test(raw[index] ?? '')) {
      index += 1
    }
  }

  function readObject(path: string): void {
    index += 1 // opening brace
    const seen = new Set<string>()
    skipWhitespace()
    if (raw[index] === '}') {
      index += 1
      return
    }
    while (index < raw.length) {
      skipWhitespace()
      const key = readString()
      const fullPath = path ? `${path}.${key}` : key
      if (seen.has(key)) {
        duplicates.push(fullPath)
      } else {
        seen.add(key)
      }
      skipWhitespace()
      if (raw[index] === ':') {
        index += 1
      }
      readValue(fullPath)
      skipWhitespace()
      if (raw[index] === ',') {
        index += 1
        continue
      }
      if (raw[index] === '}') {
        index += 1
        return
      }
      throw new Error(`Unexpected token in locale JSON at index ${index}`)
    }
  }

  function readArray(path: string): void {
    index += 1 // opening bracket
    skipWhitespace()
    if (raw[index] === ']') {
      index += 1
      return
    }
    while (index < raw.length) {
      readValue(path)
      skipWhitespace()
      if (raw[index] === ',') {
        index += 1
        continue
      }
      if (raw[index] === ']') {
        index += 1
        return
      }
      throw new Error(`Unexpected token in locale JSON at index ${index}`)
    }
  }

  function readValue(path: string): void {
    skipWhitespace()
    const char = raw[index]
    if (char === '{') {
      readObject(path)
    } else if (char === '[') {
      readArray(path)
    } else if (char === '"') {
      readString()
    } else {
      readLiteral()
    }
  }

  readValue('')

  return duplicates
}

describe('locale key contract', () => {
  const locale = readLocaleJson()
  const allLeafKeys = flattenLeafKeys(locale)
  const allKeys = flattenAllKeys(locale)

  it('has no duplicate keys at any level', () => {
    const duplicates = detectDuplicateKeysInRawJson(readRawLocale())
    expect(duplicates).toEqual([])
  })

  it.each(REQUIRED_NAMESPACES)('has namespace "%s"', (ns) => {
    expect(locale).toHaveProperty(ns)
  })

  it('has at least one leaf key per populated namespace', () => {
    const populatedNamespaces = ['app', 'shell', 'error', 'errors']
    for (const ns of populatedNamespaces) {
      const value = locale[ns]
      expect(value).toBeDefined()
      if (typeof value === 'object' && value !== null) {
        expect(hasLeafKey(value as Record<string, unknown>)).toBe(true)
      }
    }
  })

  it('every referenced t() key resolves to a locale key', () => {
    const refs = scanAppSourceForTKeys()
    const missing = refs.filter((key) => !allKeys.includes(key))
    expect(missing).toEqual([])
  })

  it('values do not embed canonical dot-IDs as labels', () => {
    const dotIdPattern = /^[a-z][a-z0-9]*(\.[a-z0-9-]+)+$/
    const violations = allLeafKeys.filter((key) => {
      const value = key.split('.').reduce((obj: Record<string, unknown>, k) => {
        return (obj?.[k] ?? {}) as Record<string, unknown>
      }, locale)
      if (typeof value !== 'string') return false
      return dotIdPattern.test(value.trim())
    })
    expect(violations).toEqual([])
  })
})
