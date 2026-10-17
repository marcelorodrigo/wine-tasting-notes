import { readFileSync, readdirSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const ROOT = resolve(import.meta.dirname, '..', '..', '..', '..')
const SAT_SOURCE_DIRS = [
  join(ROOT, 'app', 'domain', 'sat'),
  join(ROOT, 'app', 'data', 'sat'),
]
const BANNED_SPECIFIERS = ['vue', 'nuxt', 'pinia', '@vue/', '@nuxt/', '@pinia/']

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.ts'))
    .map((entry) => join(entry.parentPath ?? entry.path, entry.name))
}

describe('SAT data module boundaries', () => {
  const files = SAT_SOURCE_DIRS.flatMap(sourceFiles)

  it('discovers the SAT source files to check', () => {
    expect(files.length).toBeGreaterThan(0)
  })

  it('keeps SAT types and data free of Vue, Nuxt, and Pinia imports', () => {
    const violations: string[] = []
    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      const specifiers = [...content.matchAll(/from\s+['"]([^'"]+)['"]/g)].map(
        (match) => match[1],
      )
      for (const specifier of specifiers) {
        const banned = BANNED_SPECIFIERS.some(
          (candidate) =>
            specifier === candidate || specifier.startsWith(candidate),
        )
        if (banned) {
          violations.push(`${file} -> ${specifier}`)
        }
      }
    }
    expect(violations).toEqual([])
  })
})
