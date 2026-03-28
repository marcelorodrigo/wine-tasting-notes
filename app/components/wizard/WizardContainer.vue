<script setup lang="ts">
import AppearanceStep from './steps/AppearanceStep.vue'
import NoseStep from './steps/NoseStep.vue'
import PalateStep from './steps/PalateStep.vue'
import ConclusionsStep from './steps/ConclusionsStep.vue'

const { currentStep, goNext, goPrevious, goToStep, stepLabels } = useWizardNavigation()
const { resetTastingData } = useTastingData()
const { selectedProfile, generatedNote } = useNoteGenerator()

const stepComponents = [AppearanceStep, NoseStep, PalateStep, ConclusionsStep] as const

const showResults = ref(false)

function handleGenerate(): void {
  showResults.value = true
}

function handleBackToEditing(): void {
  showResults.value = false
}

function handleStartNewTasting(): void {
  showResults.value = false
  resetTastingData()
  goToStep(1)
}
</script>

<template>
  <div class="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
    <WizardProgress v-if="!showResults" />

    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      mode="out-in"
    >
      <!-- Results view -->
      <div
        v-if="showResults"
        key="results"
        data-testid="results-view"
      >
        <div class="mb-6">
          <ProfileSelector v-model="selectedProfile" />
        </div>

        <TastingNoteDisplay :text="generatedNote" />

        <div class="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div class="flex flex-col gap-3 sm:flex-row sm:gap-3 w-full sm:w-auto">
            <UButton
              label="Back to Editing"
              variant="outline"
              color="neutral"
              icon="i-lucide-pencil"
              size="lg"
              class="min-h-[44px] w-full sm:w-auto justify-center"
              data-testid="back-to-editing"
              @click="handleBackToEditing"
            />
            <CopyToClipboard
              class="w-full sm:w-auto justify-center"
              :text="generatedNote"
            />
          </div>
          <UButton
            label="Start New Tasting"
            variant="ghost"
            color="neutral"
            icon="i-lucide-rotate-ccw"
            size="lg"
            class="min-h-[44px] w-full sm:w-auto justify-center"
            data-testid="start-new-tasting"
            @click="handleStartNewTasting"
          />
        </div>
      </div>

      <!-- Wizard view -->
      <UCard
        v-else
        key="wizard"
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
          enter-active-class="transition-opacity duration-200"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
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
    </Transition>
  </div>
</template>
