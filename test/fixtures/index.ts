export interface WineNote {
  wine: string
  vintage: number
  score: number
  notes: string
}

export function createWineNote(overrides: Partial<WineNote> = {}): WineNote {
  return {
    wine: 'Château Margaux',
    vintage: 2018,
    score: 95,
    notes: 'Elegant with fine tannins',
    ...overrides,
  }
}

export interface TastingSession {
  id: string
  host: string
  wines: WineNote[]
}

export function createTastingSession(
  overrides: Partial<TastingSession> = {},
): TastingSession {
  return {
    id: 'session-1',
    host: 'Marcelo',
    wines: [createWineNote()],
    ...overrides,
  }
}
