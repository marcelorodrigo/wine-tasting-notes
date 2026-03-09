<script setup lang="ts">
const { resetTastingData } = useTastingData()
const { goToStep } = useWizardNavigation()

useSeoMeta({
  title: 'Tasting Wizard — Wine Tasting Notes',
  description: 'Complete the four-step WSET Level 3 systematic tasting wizard to generate professional wine tasting notes.'
})

function handleStartOver(): void {
  resetTastingData()
  goToStep(1)
}
</script>

<template>
  <div>
    <WizardContainer />

    <div class="mx-auto mt-6 flex max-w-3xl items-center justify-center gap-4 px-4 sm:px-6">
      <UButton
        label="Start Over"
        variant="ghost"
        color="neutral"
        icon="i-lucide-rotate-ccw"
        size="sm"
        data-testid="start-over"
        @click="handleStartOver"
      />
      <UButton
        to="/"
        label="Back to Home"
        variant="ghost"
        color="neutral"
        icon="i-lucide-arrow-left"
        size="sm"
        data-testid="back-home"
      />
    </div>
  </div>
</template>
