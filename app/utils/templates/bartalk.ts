import type { AppearanceData, ConclusionsData, NoseData, PalateData } from '../../types/tasting'
import { capitalize, flatAromaItems, hasAromaData, joinWithAnd } from './_shared'

const BARTALK_ACIDITY: Record<string, string> = {
  'low': 'mellow acid',
  'medium(-)': 'soft acid',
  'medium': 'medium acid',
  'medium(+)': 'bright acid',
  'high': 'zippy acid'
}

const BARTALK_TANNIN: Record<string, string> = {
  'low': 'light tannins',
  'medium(-)': 'soft tannins',
  'medium': 'moderate tannins',
  'medium(+)': 'firm tannins',
  'high': 'grippy tannins'
}

const BARTALK_ALCOHOL: Record<string, string> = {
  low: 'Light on alcohol.',
  medium: 'Balanced alcohol.',
  high: 'Pretty warm.'
}

const BARTALK_BODY: Record<string, string> = {
  'light': 'Light-bodied.',
  'medium(-)': 'Fairly light-bodied.',
  'medium': 'Medium-bodied.',
  'medium(+)': 'Fairly full-bodied.',
  'full': 'Full-bodied.'
}

const BARTALK_FINISH: Record<string, string> = {
  'short': 'Quick finish.',
  'medium(-)': 'Decent finish.',
  'medium': 'Medium finish.',
  'medium(+)': 'Nice long finish.',
  'long': 'Long finish.'
}

const BARTALK_QUALITY: Record<string, string> = {
  'faulty': 'Something\'s off with this one',
  'poor': 'Not great',
  'acceptable': 'Drinkable',
  'good': 'Solid wine',
  'very good': 'Really nice wine',
  'outstanding': 'Knockout wine'
}

const BARTALK_READINESS: Record<string, string> = {
  'too young': 'needs more time',
  'can drink now, but has potential for ageing': 'drink it now or hold it',
  'drink now: not suitable for ageing or further ageing': 'drink it now',
  'too old': 'past its best'
}

export function generateAppearanceText(data: AppearanceData): string {
  const hasData = data.clarity || data.intensity || data.color
    || (data.otherObservations?.length ?? 0) > 0
  if (!hasData) return ''

  const attrs: string[] = []
  if (data.clarity) attrs.push(data.clarity)
  if (data.intensity) attrs.push(data.intensity)
  if (data.color) attrs.push(data.color)

  const obs = data.otherObservations ?? []

  if (attrs.length === 0) return `Shows ${joinWithAnd(obs)}.`

  const obsText = obs.length > 0 ? ` — with ${joinWithAnd(obs)}` : ''
  return `Looks ${joinWithAnd(attrs)}${obsText}.`
}

export function generateNoseText(data: NoseData): string {
  const hasData = data.condition || data.intensity || data.development || hasAromaData(data.aromas)
  if (!hasData) return ''

  const sentences: string[] = []

  if (data.condition === 'unclean') {
    sentences.push('Something\'s off on the nose.')
  }

  const hasAromas = hasAromaData(data.aromas)

  if (hasAromas) {
    const items = flatAromaItems(data.aromas!)
    const aromaText = joinWithAnd(items)

    if (data.condition === 'clean' && data.intensity) {
      sentences.push(`Clean, ${data.intensity} nose — ${aromaText}.`)
    } else if (data.condition === 'clean') {
      sentences.push(`Clean nose — ${aromaText}.`)
    } else if (data.intensity && data.condition !== 'unclean') {
      sentences.push(`${capitalize(data.intensity)} on the nose — ${aromaText}.`)
    } else {
      sentences.push(`Smells of ${aromaText}.`)
    }
  } else {
    if (data.condition === 'clean' && data.intensity) {
      sentences.push(`Clean, ${data.intensity} nose.`)
    } else if (data.condition === 'clean') {
      sentences.push('Clean nose.')
    } else if (data.intensity) {
      sentences.push(`${capitalize(data.intensity)} on the nose.`)
    }
  }

  if (data.development) {
    const devMap: Record<string, string> = {
      'youthful': 'Still young.',
      'developing': 'Developing nicely.',
      'fully developed': 'Fully developed.',
      'tired/past its best': 'A bit tired.'
    }
    sentences.push(devMap[data.development] ?? `${capitalize(data.development)}.`)
  }

  return sentences.join(' ')
}

export function generatePalateText(data: PalateData): string {
  const hasData = data.sweetness || data.acidity || data.tannin || data.alcohol
    || data.fortified || data.body || data.mousse || data.flavorIntensity
    || data.finish || hasAromaData(data.flavors)
  if (!hasData) return ''

  const sentences: string[] = []

  const structureParts: string[] = []
  if (data.sweetness) structureParts.push(data.sweetness)
  if (data.acidity) structureParts.push(BARTALK_ACIDITY[data.acidity] ?? `${data.acidity} acid`)
  if (data.tannin) structureParts.push(BARTALK_TANNIN[data.tannin] ?? `${data.tannin} tannin`)
  if (structureParts.length > 0) sentences.push(`${capitalize(joinWithAnd(structureParts))}.`)

  if (data.mousse) {
    const mousseMap: Record<string, string> = {
      delicate: 'Fine bubbles.',
      creamy: 'Creamy fizz.',
      aggressive: 'Aggressive fizz.'
    }
    sentences.push(mousseMap[data.mousse] ?? `${capitalize(data.mousse)} bubbles.`)
  }

  if (data.fortified) {
    sentences.push('Fortified — packs a punch.')
  } else if (data.alcohol) {
    sentences.push(BARTALK_ALCOHOL[data.alcohol] ?? `${capitalize(data.alcohol)} alcohol.`)
  }

  if (data.body) {
    sentences.push(BARTALK_BODY[data.body] ?? `${capitalize(data.body)} body.`)
  }

  if (hasAromaData(data.flavors)) {
    const items = flatAromaItems(data.flavors!)
    sentences.push(`Tastes of ${joinWithAnd(items)}.`)
  }

  if (data.finish) {
    sentences.push(BARTALK_FINISH[data.finish] ?? `${capitalize(data.finish)} finish.`)
  }

  return sentences.join(' ')
}

export function generateConclusionsText(data: ConclusionsData): string {
  const hasData = data.qualityLevel || data.readiness
  if (!hasData) return ''

  const qualityText = data.qualityLevel
    ? BARTALK_QUALITY[data.qualityLevel] ?? capitalize(data.qualityLevel)
    : null
  const readinessText = data.readiness
    ? BARTALK_READINESS[data.readiness] ?? data.readiness
    : null

  if (qualityText && readinessText) return `${qualityText} — ${readinessText}.`
  if (qualityText) return `${qualityText}.`
  return `${capitalize(readinessText!)}.`
}
