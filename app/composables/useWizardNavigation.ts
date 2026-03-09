import { computed, ref } from 'vue'

const TOTAL_STEPS = 4

const stepLabels = ['Appearance', 'Nose', 'Palate', 'Conclusions'] as const
const stepIcons = [
  'i-lucide-eye',
  'i-lucide-wind',
  'i-lucide-grape',
  'i-lucide-check-circle'
] as const

const currentStep = ref(1)

export function useWizardNavigation() {
  const totalSteps = TOTAL_STEPS

  const isFirstStep = computed(() => currentStep.value === 1)
  const isLastStep = computed(() => currentStep.value === TOTAL_STEPS)

  function goNext(): void {
    if (currentStep.value < TOTAL_STEPS) {
      currentStep.value++
    }
  }

  function goPrevious(): void {
    if (currentStep.value > 1) {
      currentStep.value--
    }
  }

  function goToStep(step: number): void {
    if (Number.isFinite(step) && Number.isInteger(step) && step >= 1 && step <= TOTAL_STEPS) {
      currentStep.value = step
    }
  }

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    goNext,
    goPrevious,
    goToStep,
    stepLabels,
    stepIcons
  }
}
