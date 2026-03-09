<script setup lang="ts">
import AppearanceStep from './steps/AppearanceStep.vue'
import NoseStep from './steps/NoseStep.vue'
import PalateStep from './steps/PalateStep.vue'
import ConclusionsStep from './steps/ConclusionsStep.vue'

const { currentStep, goNext, goPrevious, stepLabels } = useWizardNavigation()

const stepComponents = [AppearanceStep, NoseStep, PalateStep, ConclusionsStep] as const

function handleGenerate(): void {
  alert('Tasting note generation coming soon!')
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
    <WizardProgress />

    <UCard
      class="mt-6"
      data-testid="wizard-card"
      :ui="{ body: 'p-4 sm:p-6' }"
    >
      <template #header>
        <div class="flex items-center gap-2">
          <span class="text-muted text-sm font-medium">
            Step {{ currentStep }} of 4
          </span>
          <span class="text-muted">·</span>
          <span class="font-display text-lg font-semibold text-highlighted">
            {{ stepLabels[currentStep - 1] }}
          </span>
        </div>
      </template>

      <Transition
        name="fade"
        mode="out-in"
      >
        <component
          :is="stepComponents[currentStep - 1]"
          :key="currentStep"
        />
      </Transition>

      <template #footer>
        <WizardNavigation
          @previous="goPrevious"
          @next="goNext"
          @generate="handleGenerate"
        />
      </template>
    </UCard>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
