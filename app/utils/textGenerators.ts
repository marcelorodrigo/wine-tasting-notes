import type { AppearanceData, ConclusionsData, NoseData, PalateData } from '../types/tasting'
import type { ProfileType } from '../types/profiles'
import * as professional from './templates/professional'
import * as casual from './templates/casual'
import * as bartalk from './templates/bartalk'
import * as playful from './templates/playful'

const profileTemplates = { professional, casual, bartalk, playful } as const

/**
 * Generates the Appearance section text for the given profile.
 * Returns '' if the data section has no meaningful content.
 */
export function generateAppearanceText(data: AppearanceData, profile: ProfileType): string {
  return profileTemplates[profile].generateAppearanceText(data)
}

/**
 * Generates the Nose section text for the given profile.
 * Returns '' if the data section has no meaningful content.
 */
export function generateNoseText(data: NoseData, profile: ProfileType): string {
  return profileTemplates[profile].generateNoseText(data)
}

/**
 * Generates the Palate section text for the given profile.
 * Returns '' if the data section has no meaningful content.
 */
export function generatePalateText(data: PalateData, profile: ProfileType): string {
  return profileTemplates[profile].generatePalateText(data)
}

/**
 * Generates the Conclusions section text for the given profile.
 * Returns '' if the data section has no meaningful content.
 */
export function generateConclusionsText(data: ConclusionsData, profile: ProfileType): string {
  return profileTemplates[profile].generateConclusionsText(data)
}
