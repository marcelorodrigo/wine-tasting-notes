import { defineStore } from 'pinia'

export type WineType = 'white' | 'red' | 'rosé' | 'sparkling' | 'dessert' | null

export interface Appearance {
  color: string
  intensity: 'light' | 'medium' | 'deep' | null
}

export interface Palate {
  tannins: 'low' | 'medium' | 'high' | null
  acidity: 'low' | 'medium' | 'high' | null
  body: 'light' | 'medium' | 'full' | null
}

export interface Conclusions {
  finish: 'short' | 'medium' | 'long' | null
  agingPotential: 'drink-now' | 'hold-1-3' | 'hold-5-plus' | null
  wineName: string
}

export interface TastingState {
  wineType: WineType
  appearance: Appearance
  aromas: {
    primary: string[]
    secondary: string[]
    tertiary: string[]
  }
  palate: Palate
  palateAromas: string[]
  conclusions: Conclusions
  currentStep: number
}

export const useTastingStore = defineStore('tasting', {
  state: (): TastingState => ({
    wineType: null,
    appearance: {
      color: '',
      intensity: null
    },
    aromas: {
      primary: [],
      secondary: [],
      tertiary: []
    },
    palate: {
      tannins: null,
      acidity: null,
      body: null
    },
    palateAromas: [],
    conclusions: {
      finish: null,
      agingPotential: null,
      wineName: ''
    },
    currentStep: 0
  }),

  getters: {
    isComplete: (state): boolean => {
      return state.wineType !== null
        && (state.appearance.color !== ''
          || state.appearance.intensity !== null
          || state.aromas.primary.length > 0
          || state.aromas.secondary.length > 0
          || state.aromas.tertiary.length > 0
          || state.palate.tannins !== null
          || state.palate.acidity !== null
          || state.palate.body !== null
          || state.conclusions.finish !== null
          || state.conclusions.agingPotential !== null)
    },

    selectedAromas: (state): string[] => {
      return [
        ...state.aromas.primary,
        ...state.aromas.secondary,
        ...state.aromas.tertiary,
        ...state.palateAromas
      ]
    },

    currentStepName: (state): string => {
      const steps = ['wine-type', 'appearance', 'nose', 'palate', 'conclusions']
      return steps[state.currentStep] || 'wine-type'
    },

    totalSteps: (): number => 5,

    progressPercentage: (state): number => {
      return ((state.currentStep + 1) / 5) * 100
    }
  },

  actions: {
    setWineType(type: WineType) {
      this.wineType = type
      if (type !== null) {
        this.currentStep = 1
      }
    },

    setAppearance(appearance: Partial<Appearance>) {
      this.appearance = { ...this.appearance, ...appearance }
    },

    setAromas(tier: 'primary' | 'secondary' | 'tertiary', aromas: string[]) {
      this.aromas[tier] = aromas
    },

    addAroma(tier: 'primary' | 'secondary' | 'tertiary', aroma: string) {
      if (!this.aromas[tier].includes(aroma)) {
        this.aromas[tier].push(aroma)
      }
    },

    removeAroma(tier: 'primary' | 'secondary' | 'tertiary', aroma: string) {
      const index = this.aromas[tier].indexOf(aroma)
      if (index > -1) {
        this.aromas[tier].splice(index, 1)
      }
    },

    setPalate(palate: Partial<Palate>) {
      this.palate = { ...this.palate, ...palate }
    },

    setPalateAromas(aromas: string[]) {
      this.palateAromas = aromas
    },

    addPalateAroma(aroma: string) {
      if (!this.palateAromas.includes(aroma)) {
        this.palateAromas.push(aroma)
      }
    },

    removePalateAroma(aroma: string) {
      const index = this.palateAromas.indexOf(aroma)
      if (index > -1) {
        this.palateAromas.splice(index, 1)
      }
    },

    setConclusions(conclusions: Partial<Conclusions>) {
      this.conclusions = { ...this.conclusions, ...conclusions }
    },

    nextStep() {
      if (this.currentStep < 4) {
        this.currentStep++
      }
    },

    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },

    goToStep(step: number) {
      if (step >= 0 && step <= 4) {
        this.currentStep = step
      }
    },

    reset() {
      this.$reset()
    }
  }
})
