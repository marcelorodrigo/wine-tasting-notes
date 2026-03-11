import type { AppearanceData, ConclusionsData, NoseData, PalateData } from '../../types/tasting'
import { capitalize, flatAromaItems, hasAromaData, joinWithAnd } from './_shared'

export function generateAppearanceText(data: AppearanceData): string {
  const hasData = data.clarity || data.intensity || data.color
    || (data.otherObservations?.length ?? 0) > 0
  if (!hasData) return ''

  const attrs: string[] = []
  if (data.clarity) attrs.push(data.clarity)
  if (data.intensity) attrs.push(data.intensity)
  if (data.color) attrs.push(data.color)

  const obs = data.otherObservations ?? []
  const obsText = obs.length > 0 ? `. Shows ${joinWithAnd(obs)}` : ''

  if (attrs.length === 0) return `Shows ${joinWithAnd(obs)}.`

  return `Looks ${joinWithAnd(attrs)}${obsText}.`
}

export function generateNoseText(data: NoseData): string {
  const hasData = data.condition || data.intensity || data.development || hasAromaData(data.aromas)
  if (!hasData) return ''

  const sentences: string[] = []

  const introParts: string[] = []
  if (data.condition && data.condition !== 'clean') introParts.push('Off on the nose')
  else if (data.condition === 'clean' && data.intensity) introParts.push(`Clean, ${data.intensity} nose`)
  else if (data.condition === 'clean') introParts.push('Clean nose')
  else if (data.intensity) introParts.push(`${capitalize(data.intensity)} nose`)

  if (introParts.length > 0) sentences.push(`${introParts.join('')}.`)

  if (hasAromaData(data.aromas)) {
    const items = flatAromaItems(data.aromas!)
    sentences.push(`Smells of ${joinWithAnd(items)}.`)
  }

  if (data.development) sentences.push(`${capitalize(data.development)}.`)

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
  if (data.acidity) structureParts.push(`${data.acidity} acid`)
  if (data.tannin) structureParts.push(`${data.tannin} tannin`)
  if (structureParts.length > 0) sentences.push(`${capitalize(joinWithAnd(structureParts))}.`)

  if (data.mousse) sentences.push(`Bubbles are ${data.mousse}.`)

  if (data.fortified) {
    sentences.push('Fortified.')
  } else if (data.alcohol) {
    sentences.push(`${capitalize(data.alcohol)} alcohol.`)
  }

  if (data.body) sentences.push(`${capitalize(data.body)} body.`)

  if (hasAromaData(data.flavors)) {
    const items = flatAromaItems(data.flavors!)
    sentences.push(`Tastes of ${joinWithAnd(items)}.`)
  }

  if (data.finish) sentences.push(`${capitalize(data.finish)} finish.`)

  return sentences.join(' ')
}

export function generateConclusionsText(data: ConclusionsData): string {
  const hasData = data.qualityLevel || data.readiness
  if (!hasData) return ''

  const sentences: string[] = []
  if (data.qualityLevel) sentences.push(`${capitalize(data.qualityLevel)} wine.`)
  if (data.readiness) sentences.push(`${capitalize(data.readiness)}.`)

  return sentences.join(' ')
}
