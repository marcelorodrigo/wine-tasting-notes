import { computed, ref } from 'vue'
import type { ProfileType } from '../types/profiles'
import {
  generateAppearanceText,
  generateConclusionsText,
  generateNoseText,
  generatePalateText
} from '../utils/textGenerators'

export function useNoteGenerator() {
  const { tastingData } = useTastingData()
  const selectedProfile = ref<ProfileType>('professional')

  const generatedNote = computed(() => {
    const sections = [
      generateAppearanceText(tastingData.value.appearance, selectedProfile.value),
      generateNoseText(tastingData.value.nose, selectedProfile.value),
      generatePalateText(tastingData.value.palate, selectedProfile.value),
      generateConclusionsText(tastingData.value.conclusions, selectedProfile.value)
    ].filter(Boolean)

    return sections.join('\n\n')
  })

  return {
    selectedProfile,
    generatedNote
  }
}
