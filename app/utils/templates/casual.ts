import type { AppearanceData, ConclusionsData, NoseData, PalateData } from '../../types/tasting'
import { formatAromaList } from '../aromaCategorizer'
import { AROMA_LABELS, capitalize, hasAromaData, joinWithAnd } from './_shared'

export function generateAppearanceText(data: AppearanceData): string {
  const hasData = data.clarity || data.intensity || data.color
    || (data.otherObservations?.length ?? 0) > 0
  if (!hasData) return ''

  const attrs: string[] = []
  if (data.clarity) attrs.push(data.clarity)
  if (data.intensity) attrs.push(data.intensity)
  if (data.color) attrs.push(data.color)

  let sentence = ''
  if (attrs.length > 0) sentence = `This wine shows a ${attrs.join(', ')} color`

  const obs = data.otherObservations ?? []
  if (obs.length > 0) {
    const obsText = joinWithAnd(obs)
    sentence = sentence ? `${sentence}, with ${obsText} noted` : `Showing ${obsText}`
  }

  return sentence ? `Appearance: ${sentence}.` : ''
}

export function generateNoseText(data: NoseData): string {
  const hasData = data.condition || data.intensity || data.development || hasAromaData(data.aromas)
  if (!hasData) return ''

  const sentences: string[] = []

  const condIntParts: string[] = []
  if (data.condition) condIntParts.push(data.condition)
  if (data.intensity) condIntParts.push(`${data.intensity} intensity`)
  if (condIntParts.length > 0) {
    sentences.push(`The nose is ${joinWithAnd(condIntParts)}.`)
  }

  if (hasAromaData(data.aromas)) {
    const aromaText = formatAromaList(data.aromas!, AROMA_LABELS)
    sentences.push(`On the nose you'll find notes of ${aromaText}.`)
  }

  if (data.development) sentences.push(`${capitalize(data.development)}.`)

  return `On the nose: ${sentences.join(' ')}`
}

export function generatePalateText(data: PalateData): string {
  const hasData = data.sweetness || data.acidity || data.tannin || data.alcohol
    || data.fortified || data.body || data.mousse || data.flavorIntensity
    || data.finish || hasAromaData(data.flavors)
  if (!hasData) return ''

  const sentences: string[] = []

  const structureParts: string[] = []
  if (data.sweetness) structureParts.push(data.sweetness)
  if (data.acidity) structureParts.push(`${data.acidity} acidity`)
  if (data.tannin) structureParts.push(`${data.tannin} tannin`)
  if (structureParts.length > 0) sentences.push(`${capitalize(joinWithAnd(structureParts))}.`)

  if (data.mousse) sentences.push(`The bubbles are ${data.mousse}.`)

  if (data.fortified) {
    sentences.push('This is a fortified wine.')
  } else if (data.alcohol) {
    sentences.push(`Alcohol feels ${data.alcohol}.`)
  }

  const bodyParts: string[] = []
  if (data.body) bodyParts.push(`${data.body} body`)
  if (data.flavorIntensity) bodyParts.push(`${data.flavorIntensity} flavor intensity`)
  if (bodyParts.length > 0) sentences.push(`${capitalize(joinWithAnd(bodyParts))}.`)

  if (hasAromaData(data.flavors)) {
    const flavorText = formatAromaList(data.flavors!, AROMA_LABELS)
    sentences.push(`You can taste ${flavorText}.`)
  }

  if (data.finish) sentences.push(`The finish is ${data.finish}.`)

  return `On the palate: ${sentences.join(' ')}`
}

export function generateConclusionsText(data: ConclusionsData): string {
  const hasData = data.qualityLevel || data.readiness
  if (!hasData) return ''

  const sentences: string[] = []
  if (data.qualityLevel) sentences.push(`Overall, this is a ${data.qualityLevel} wine.`)
  if (data.readiness) sentences.push(`${capitalize(data.readiness)}.`)

  return `Overall: ${sentences.join(' ')}`
}
