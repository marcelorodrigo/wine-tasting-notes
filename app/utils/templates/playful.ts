import type { AppearanceData, ConclusionsData, NoseData, PalateData } from '../../types/tasting'
import { formatAromaList } from '../aromaCategorizer'
import { AROMA_LABELS, capitalize, hasAromaData, joinWithAnd } from './_shared'

const PLAYFUL_COLORS: Record<string, string> = {
  'lemon-green': 'lemon-green — practically electric',
  'lemon': 'lemony — like bottled sunshine',
  'gold': 'golden — liquid treasure',
  'amber': 'amber — like liquid caramel',
  'brown': 'brown — serious vintage vibes',
  'pink': 'pink — blushing beautifully',
  'salmon': 'salmon — sunset in a glass',
  'orange': 'orange — copper-kissed',
  'purple': 'deep purple — moody and brooding',
  'ruby': 'ruby — like a jewel in the glass',
  'garnet': 'garnet — gorgeously aged',
  'tawny': 'tawny — autumn in a glass'
}

const PLAYFUL_SWEETNESS: Record<string, string> = {
  'dry': 'bone dry',
  'off-dry': 'barely sweet',
  'medium-dry': 'lightly sweet',
  'medium-sweet': 'noticeably sweet',
  'sweet': 'properly sweet',
  'luscious': 'gloriously sweet'
}

const PLAYFUL_ACIDITY: Record<string, string> = {
  'low': 'lazy acidity',
  'medium(-)': 'gentle acidity',
  'medium': 'balanced acidity',
  'medium(+)': 'lively acidity',
  'high': 'zippy acidity'
}

const PLAYFUL_TANNIN: Record<string, string> = {
  'low': 'silky tannin',
  'medium(-)': 'soft tannin',
  'medium': 'balanced tannin',
  'medium(+)': 'firm tannin',
  'high': 'grippy tannin'
}

const PLAYFUL_MOUSSE: Record<string, string> = {
  delicate: 'Tiny, playful bubbles.',
  creamy: 'Bubbles smooth as silk.',
  aggressive: 'Bubbles going wild!'
}

const PLAYFUL_FINISH: Record<string, string> = {
  'short': 'short but sweet finish',
  'medium(-)': 'decent finish',
  'medium': 'satisfying finish',
  'medium(+)': 'lingering finish',
  'long': 'epic finish'
}

const PLAYFUL_QUALITY: Record<string, string> = {
  'faulty': 'something went wrong here',
  'poor': 'not having its best day',
  'acceptable': 'gets the job done',
  'good': 'solid sipper',
  'very good': 'serious stuff',
  'outstanding': 'absolutely outstanding'
}

const PLAYFUL_READINESS: Record<string, string> = {
  'too young': 'still a baby — needs more time in the cellar',
  'can drink now, but has potential for ageing': 'delicious now, but worth the wait if you can resist',
  'drink now: not suitable for ageing or further ageing': 'drink up — no point waiting',
  'too old': 'past its prime — should have opened this sooner'
}

export function generateAppearanceText(data: AppearanceData): string {
  const hasData = data.clarity || data.intensity || data.color
    || (data.otherObservations?.length ?? 0) > 0
  if (!hasData) return ''

  const parts: string[] = []
  if (data.clarity) parts.push(data.clarity)

  if (data.color) {
    const colorText = PLAYFUL_COLORS[data.color]
    if (data.intensity && colorText) {
      parts.push(`${data.intensity} ${colorText}`)
    } else if (colorText) {
      parts.push(colorText)
    } else if (data.intensity) {
      parts.push(`${data.intensity} ${data.color}`)
    } else {
      parts.push(data.color)
    }
  } else if (data.intensity) {
    parts.push(data.intensity)
  }

  const obs = data.otherObservations ?? []
  const obsSuffix = obs.length > 0 ? ` — showing ${joinWithAnd(obs)}` : ''

  if (parts.length === 0) return `Shows ${joinWithAnd(obs)}.`

  return `${capitalize(joinWithAnd(parts))}${obsSuffix}.`
}

export function generateNoseText(data: NoseData): string {
  const hasData = data.condition || data.intensity || data.development || hasAromaData(data.aromas)
  if (!hasData) return ''

  const sentences: string[] = []

  if (data.condition === 'unclean') {
    sentences.push('Watch out — something smells off here.')
  }

  const hasAromas = hasAromaData(data.aromas)

  if (hasAromas) {
    const aromaText = formatAromaList(data.aromas!, AROMA_LABELS)

    if (data.condition === 'clean' && data.intensity === 'pronounced') {
      sentences.push(`Your nose is in for a treat — ${aromaText}.`)
    } else if (data.condition === 'clean' && data.intensity) {
      sentences.push(`A delightful ${data.intensity} nose of ${aromaText}.`)
    } else {
      sentences.push(`A delightful mix of ${aromaText}.`)
    }
  } else {
    if (data.condition === 'clean' && data.intensity === 'pronounced') {
      sentences.push('Your nose is in for a treat!')
    } else if (data.condition === 'clean' && data.intensity) {
      sentences.push(`Clean and ${data.intensity} on the nose.`)
    } else if (data.condition === 'clean') {
      sentences.push('Clean on the nose.')
    } else if (data.intensity) {
      sentences.push(`${capitalize(data.intensity)} on the nose.`)
    }
  }

  if (data.development) {
    const devMap: Record<string, string> = {
      'youthful': 'Still fresh and youthful.',
      'developing': 'Nicely developing.',
      'fully developed': 'Fully developed and complex.',
      'tired/past its best': 'A bit tired — probably past its best.'
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
  if (data.sweetness) structureParts.push(PLAYFUL_SWEETNESS[data.sweetness] ?? data.sweetness)
  if (data.acidity) structureParts.push(PLAYFUL_ACIDITY[data.acidity] ?? `${data.acidity} acidity`)
  if (data.tannin) structureParts.push(PLAYFUL_TANNIN[data.tannin] ?? `${data.tannin} tannin`)
  if (structureParts.length > 0) sentences.push(`${capitalize(joinWithAnd(structureParts))}.`)

  if (data.mousse) {
    sentences.push(PLAYFUL_MOUSSE[data.mousse] ?? `${capitalize(data.mousse)} bubbles.`)
  }

  if (data.fortified) {
    sentences.push('Fortified — packs a punch!')
  } else if (data.alcohol) {
    const alcoholMap: Record<string, string> = {
      low: 'Light on alcohol.',
      medium: 'Nicely balanced alcohol.',
      high: 'Warming alcohol — it shows.'
    }
    sentences.push(alcoholMap[data.alcohol] ?? `${capitalize(data.alcohol)} alcohol.`)
  }

  if (data.body) {
    const bodyMap: Record<string, string> = {
      'light': 'Light as a feather.',
      'medium(-)': 'On the lighter side.',
      'medium': 'Medium-bodied.',
      'medium(+)': 'Nicely full.',
      'full': 'Full-bodied powerhouse.'
    }
    sentences.push(bodyMap[data.body] ?? `${capitalize(data.body)} body.`)
  }

  if (hasAromaData(data.flavors)) {
    const flavorText = formatAromaList(data.flavors!, AROMA_LABELS)
    sentences.push(`Flavors burst with ${flavorText}.`)
  }

  if (data.flavorIntensity) {
    const fiMap: Record<string, string> = {
      'light': 'Subtle flavors.',
      'medium(-)': 'Gently flavored.',
      'medium': 'Nice flavor intensity.',
      'medium(+)': 'Packed with flavor.',
      'pronounced': 'Flavor bomb!'
    }
    sentences.push(fiMap[data.flavorIntensity] ?? `${capitalize(data.flavorIntensity)} flavor intensity.`)
  }

  if (data.finish) sentences.push(`${capitalize(PLAYFUL_FINISH[data.finish] ?? data.finish)}.`)

  return sentences.join(' ')
}

export function generateConclusionsText(data: ConclusionsData): string {
  const hasData = data.qualityLevel || data.readiness
  if (!hasData) return ''

  const sentences: string[] = []
  if (data.qualityLevel) {
    sentences.push(`${capitalize(PLAYFUL_QUALITY[data.qualityLevel] ?? data.qualityLevel)}!`)
  }
  if (data.readiness) {
    sentences.push(capitalize(PLAYFUL_READINESS[data.readiness] ?? data.readiness) + '.')
  }

  return sentences.join(' ')
}
