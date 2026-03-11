import type { AppearanceData, ConclusionsData, NoseData, PalateData } from '../../types/tasting'
import { formatAromaList } from '../aromaCategorizer'
import { AROMA_LABELS, capitalize, hasAromaData, joinWithAnd } from './_shared'

export function generateAppearanceText(data: AppearanceData): string {
  const hasData = data.clarity || data.intensity || data.color
    || (data.otherObservations?.length ?? 0) > 0
  if (!hasData) return ''

  const mainParts: string[] = []
  if (data.clarity) mainParts.push(data.clarity)
  if (data.intensity && data.color) {
    mainParts.push(`${data.intensity} ${data.color} in color`)
  } else if (data.color) {
    mainParts.push(`${data.color} in color`)
  } else if (data.intensity) {
    mainParts.push(`${data.intensity} in intensity`)
  }

  const sentence = capitalize(joinWithAnd(mainParts))
  const obs = data.otherObservations ?? []
  const obsSuffix = obs.length > 0 ? `, showing ${joinWithAnd(obs)}` : ''

  return `APPEARANCE: ${sentence}${obsSuffix}.`
}

export function generateNoseText(data: NoseData): string {
  const hasData = data.condition || data.intensity || data.development || hasAromaData(data.aromas)
  if (!hasData) return ''

  const sentences: string[] = []

  const condIntParts: string[] = []
  if (data.condition) condIntParts.push(capitalize(data.condition))
  if (data.intensity) condIntParts.push(`with ${data.intensity} intensity`)
  if (condIntParts.length > 0) sentences.push(condIntParts.join(', ') + '.')

  if (hasAromaData(data.aromas)) {
    const aromaText = formatAromaList(data.aromas!, AROMA_LABELS)
    sentences.push(`Detected ${aromaText} aromas.`)
  }

  if (data.development) sentences.push(`${capitalize(data.development)}.`)

  return `NOSE: ${sentences.join(' ')}`
}

export function generatePalateText(data: PalateData): string {
  const hasData = data.sweetness || data.acidity || data.tannin || data.alcohol
    || data.fortified || data.body || data.mousse || data.flavorIntensity
    || data.finish || hasAromaData(data.flavors)
  if (!hasData) return ''

  const sentences: string[] = []

  const structureParts: string[] = []
  if (data.sweetness) structureParts.push(capitalize(data.sweetness))
  const acidTanninParts: string[] = []
  if (data.acidity) acidTanninParts.push(`${data.acidity} acidity`)
  if (data.tannin) acidTanninParts.push(`${data.tannin} tannin`)
  if (acidTanninParts.length > 0) structureParts.push(`with ${joinWithAnd(acidTanninParts)}`)
  if (structureParts.length > 0) sentences.push(structureParts.join(', ') + '.')

  if (data.mousse) sentences.push(`Mousse is ${data.mousse}.`)

  if (data.fortified) {
    sentences.push('Fortified.')
  } else if (data.alcohol) {
    sentences.push(`${capitalize(data.alcohol)} alcohol.`)
  }

  const bodyFIParts: string[] = []
  if (data.body) bodyFIParts.push(`body is ${data.body}`)
  if (data.flavorIntensity) bodyFIParts.push(`with ${data.flavorIntensity} flavor intensity`)
  if (bodyFIParts.length > 0) sentences.push(capitalize(bodyFIParts.join(', ')) + '.')

  if (hasAromaData(data.flavors)) {
    const flavorText = formatAromaList(data.flavors!, AROMA_LABELS)
    sentences.push(`Detected ${flavorText} flavors.`)
  }

  if (data.finish) sentences.push(`${capitalize(data.finish)} finish.`)

  return `PALATE: ${sentences.join(' ')}`
}

export function generateConclusionsText(data: ConclusionsData): string {
  const hasData = data.qualityLevel || data.readiness
  if (!hasData) return ''

  const sentences: string[] = []
  if (data.qualityLevel) sentences.push(`This wine is of ${data.qualityLevel} quality.`)
  if (data.readiness) sentences.push(`${capitalize(data.readiness)}.`)

  return `CONCLUSIONS: ${sentences.join(' ')}`
}
