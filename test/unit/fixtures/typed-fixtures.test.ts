import { describe, expect, it } from 'vitest'
import {
  createTastingSession,
  createWineNote,
} from '../../fixtures'

describe('typed fixtures', () => {
  it('creates a wine note with defaults', () => {
    const note = createWineNote()
    expect(note.wine).toBe('Château Margaux')
    expect(note.vintage).toBe(2018)
    expect(note.score).toBe(95)
  })

  it('allows overriding defaults', () => {
    const note = createWineNote({ wine: 'Opus One', score: 98 })
    expect(note.wine).toBe('Opus One')
    expect(note.score).toBe(98)
    expect(note.vintage).toBe(2018)
  })

  it('creates a tasting session with nested fixtures', () => {
    const session = createTastingSession({ id: 's-42' })
    expect(session.id).toBe('s-42')
    expect(session.wines).toHaveLength(1)
    expect(session.wines[0].wine).toBe('Château Margaux')
  })
})
