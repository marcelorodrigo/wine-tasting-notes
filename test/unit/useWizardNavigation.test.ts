import { beforeEach, describe, expect, it } from 'vitest'
import { useWizardNavigation } from '../../app/composables/useWizardNavigation'

describe('useWizardNavigation', () => {
  let nav: ReturnType<typeof useWizardNavigation>

  beforeEach(() => {
    nav = useWizardNavigation()
    nav.goToStep(1)
  })

  describe('initial state', () => {
    it('starts on step 1', () => {
      expect(nav.currentStep.value).toBe(1)
    })

    it('exposes totalSteps as 4', () => {
      expect(nav.totalSteps).toBe(4)
    })

    it('exposes the correct step labels', () => {
      expect(nav.stepLabels).toEqual(['Appearance', 'Nose', 'Palate', 'Conclusions'])
    })

    it('exposes 4 step icons', () => {
      expect(nav.stepIcons).toHaveLength(4)
    })

    it('stepIcons are i-lucide-* strings', () => {
      for (const icon of nav.stepIcons) {
        expect(icon).toMatch(/^i-lucide-/)
      }
    })
  })

  describe('isFirstStep / isLastStep', () => {
    it('isFirstStep is true on step 1', () => {
      nav.goToStep(1)
      expect(nav.isFirstStep.value).toBe(true)
    })

    it('isFirstStep is false when not on step 1', () => {
      nav.goToStep(2)
      expect(nav.isFirstStep.value).toBe(false)
    })

    it('isLastStep is true on step 4', () => {
      nav.goToStep(4)
      expect(nav.isLastStep.value).toBe(true)
    })

    it('isLastStep is false when not on step 4', () => {
      nav.goToStep(3)
      expect(nav.isLastStep.value).toBe(false)
    })

    it('isFirstStep and isLastStep are both false on middle steps', () => {
      nav.goToStep(2)
      expect(nav.isFirstStep.value).toBe(false)
      expect(nav.isLastStep.value).toBe(false)
    })
  })

  describe('goNext()', () => {
    it('increments the step', () => {
      nav.goToStep(1)
      nav.goNext()
      expect(nav.currentStep.value).toBe(2)
    })

    it('does not exceed totalSteps', () => {
      nav.goToStep(4)
      nav.goNext()
      expect(nav.currentStep.value).toBe(4)
    })

    it('can advance through all steps', () => {
      nav.goToStep(1)
      nav.goNext()
      nav.goNext()
      nav.goNext()
      expect(nav.currentStep.value).toBe(4)
    })
  })

  describe('goPrevious()', () => {
    it('decrements the step', () => {
      nav.goToStep(3)
      nav.goPrevious()
      expect(nav.currentStep.value).toBe(2)
    })

    it('does not go below step 1', () => {
      nav.goToStep(1)
      nav.goPrevious()
      expect(nav.currentStep.value).toBe(1)
    })

    it('can go back through all steps', () => {
      nav.goToStep(4)
      nav.goPrevious()
      nav.goPrevious()
      nav.goPrevious()
      expect(nav.currentStep.value).toBe(1)
    })
  })

  describe('goToStep()', () => {
    it('jumps to a specific step', () => {
      nav.goToStep(3)
      expect(nav.currentStep.value).toBe(3)
    })

    it('ignores steps below 1', () => {
      nav.goToStep(2)
      nav.goToStep(0)
      expect(nav.currentStep.value).toBe(2)
    })

    it('ignores steps above totalSteps', () => {
      nav.goToStep(2)
      nav.goToStep(5)
      expect(nav.currentStep.value).toBe(2)
    })

    it('accepts steps 1 through 4', () => {
      for (let step = 1; step <= 4; step++) {
        nav.goToStep(step)
        expect(nav.currentStep.value).toBe(step)
      }
    })
  })

  describe('shared singleton state', () => {
    it('returns the same currentStep ref from multiple calls', () => {
      const a = useWizardNavigation()
      const b = useWizardNavigation()
      expect(a.currentStep).toBe(b.currentStep)
    })

    it('mutations from one call are visible from another', () => {
      const a = useWizardNavigation()
      const b = useWizardNavigation()

      a.goToStep(3)

      expect(b.currentStep.value).toBe(3)
    })
  })
})
