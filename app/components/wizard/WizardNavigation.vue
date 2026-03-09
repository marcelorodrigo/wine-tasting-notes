<script setup lang="ts">
const { isFirstStep, isLastStep } = useWizardNavigation()

const emit = defineEmits<{
  previous: []
  next: []
  generate: []
}>()
</script>

<template>
  <nav
    aria-label="Wizard navigation"
    class="flex items-center gap-3 pt-6"
    :class="isFirstStep ? 'justify-end' : 'justify-between'"
  >
    <UButton
      v-if="!isFirstStep"
      label="Previous"
      variant="outline"
      color="neutral"
      icon="i-lucide-arrow-left"
      size="lg"
      class="min-h-[44px] min-w-[44px]"
      data-testid="wizard-previous"
      @click="emit('previous')"
    />

    <UButton
      v-if="!isLastStep"
      label="Next"
      variant="solid"
      trailing-icon="i-lucide-arrow-right"
      size="lg"
      class="min-h-[44px] min-w-[44px]"
      data-testid="wizard-next"
      @click="emit('next')"
    />

    <UButton
      v-if="isLastStep"
      label="Generate Notes"
      variant="solid"
      icon="i-lucide-sparkles"
      size="xl"
      class="min-h-[44px] min-w-[44px] font-semibold"
      data-testid="wizard-generate"
      @click="emit('generate')"
    />
  </nav>
</template>
