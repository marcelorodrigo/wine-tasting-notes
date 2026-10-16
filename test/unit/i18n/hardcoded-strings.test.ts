import { readFileSync, readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { parse, type SFCTemplateBlock } from 'vue/compiler-sfc'

const ROOT = join(import.meta.dirname, '..', '..', '..')
const APP_DIR = join(ROOT, 'app')

const SCANNED_DIRS = ['components', 'pages', 'layouts']
const SCANNED_FILES = ['error.vue']
const EXCLUDED_FILES = ['components-fixture.vue']

function collectVueFiles(): string[] {
  const files: string[] = []

  for (const dir of SCANNED_DIRS) {
    const dirPath = join(APP_DIR, dir)
    try {
      const entries = readdirSync(dirPath, { recursive: true, withFileTypes: true })
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.vue')) {
          const filePath = join(entry.parentPath ?? entry.path, entry.name)
          if (!EXCLUDED_FILES.includes(entry.name)) {
            files.push(filePath)
          }
        }
      }
    } catch {
      // directory may not exist yet
    }
  }

  for (const file of SCANNED_FILES) {
    const filePath = join(APP_DIR, file)
    try {
      readFileSync(filePath, 'utf-8')
      files.push(filePath)
    } catch {
      // file may not exist
    }
  }

  return files
}

interface ASTNode {
  type: number
  content?: string
  children?: ASTNode[]
  props?: Array<{ name: string; value?: { content: string } }>
}

function walkNodes(
  node: ASTNode,
  visitor: (node: ASTNode) => void,
): void {
  visitor(node)
  if (node.children) {
    for (const child of node.children) {
      walkNodes(child, visitor)
    }
  }
}

function isHardcodedText(content: string): boolean {
  const trimmed = content.trim()
  if (!trimmed) return false
  if (/^[\s\d\-–—.,;:!?'"()&/\\|=+<>#@$%^*[\]{}~`]+$/.test(trimmed)) return false
  if (/^\d+[\d.,]*\s*(px|rem|em|%|vh|vw|deg|s|ms)?$/.test(trimmed)) return false
  if (/^&\w+;$/.test(trimmed)) return false
  return /[a-zA-Z]/.test(trimmed)
}

function resolveTemplateAst(
  template: SFCTemplateBlock,
  file: string,
  relativePath: string,
): ASTNode | undefined {
  if (template.src) {
    const externalPath = resolve(dirname(file), template.src)

    let externalSource: string
    try {
      externalSource = readFileSync(externalPath, 'utf-8')
    } catch {
      throw new Error(
        `${relativePath} references external template "${template.src}" that is missing at ${externalPath}`,
      )
    }

    // External templates are plain HTML fragments; wrap them so the SFC
    // compiler produces the same AST shape as an inline template.
    const { descriptor, errors } = parse(
      `<template>${externalSource}</template>`,
      { filename: externalPath },
    )
    const templateAst = descriptor.template?.ast
    if (errors.length > 0 || !templateAst) {
      throw new Error(
        `${relativePath} references external template "${template.src}" that could not be audited`,
      )
    }

    return templateAst
  }

  return template.ast
}

describe('template audit: no hardcoded product strings', () => {
  const files = collectVueFiles()

  for (const file of files) {
    const relativePath = file.replace(`${ROOT}/`, '')

    it(`${relativePath} has no hardcoded visible text`, () => {
      const source = readFileSync(file, 'utf-8')
      const { descriptor, errors } = parse(source, { filename: file })

      if (errors.length > 0) {
        return
      }

      const template = descriptor.template
      if (!template) return

      const templateAst = resolveTemplateAst(template, file, relativePath)
      if (!templateAst) return

      const hardcoded: string[] = []

      walkNodes(templateAst, (node) => {
        if (node.type === 2 && node.content && isHardcodedText(node.content)) {
          hardcoded.push(node.content.trim())
        }
      })

      expect(
        hardcoded,
        `Found hardcoded text in ${relativePath}: ${hardcoded.join(', ')}`,
      ).toEqual([])
    })
  }
})
