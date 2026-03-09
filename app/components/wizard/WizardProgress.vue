<script setup lang="ts">
const { currentStep, goToStep, totalSteps, stepLabels, stepIcons } = useWizardNavigation()

type StepState = 'completed' | 'active' | 'upcoming'

function getStepState(stepNumber: number): StepState {
  if (stepNumber < currentStep.value) return 'completed'
  if (stepNumber === currentStep.value) return 'active'
  return 'upcoming'
}
</script>

<template>
  <nav
    aria-label="Tasting wizard progress"
    class="w-full"
  >
    <ol class="flex items-center justify-between gap-0">
      <li
        v-for="step in totalSteps"
        :key="step"
        class="flex items-center"
        :class="step < totalSteps ? 'flex-1' : ''"
      >
        <!-- Step button -->
        <button
          type="button"
          class="group flex flex-col items-center gap-1.5 focus-visible:outline-none"
          :aria-current="getStepState(step) === 'active' ? 'step' : undefined"
          :aria-label="`Step ${step}: ${stepLabels[step - 1]}`"
          :data-state="getStepState(step)"
          @click="goToStep(step)"
        >
          <!-- Indicator circle -->
          <span
            class="flex size-9 items-center justify-center rounded-full border-2 transition-all duration-200 sm:size-10"
            :class="{
              'border-primary bg-primary text-white shadow-sm': getStepState(step) === 'active',
              'border-primary bg-primary/10 text-primary': getStepState(step) === 'completed',
              'border-muted text-muted group-hover:border-muted-foreground/50': getStepState(step) === 'upcoming'
            }"
          >
            <UIcon
              v-if="getStepState(step) === 'completed'"
              name="i-lucide-check"
              class="size-4 sm:size-5"
            />
            <UIcon
              v-else
              :name="stepIcons[step - 1]"
              class="size-4 sm:size-5"
            />
          </span>

          <!-- Step label (hidden on mobile) -->
          <span
            class="hidden text-xs font-medium transition-colors duration-200 sm:block"
            :class="{
              'text-primary font-semibold': getStepState(step) === 'active',
              'text-primary': getStepState(step) === 'completed',
              'text-muted': getStepState(step) === 'upcoming'
            }"
          >
            {{ stepLabels[step - 1] }}
          </span>
        </button>

        <!-- Connector line -->
        <div
          v-if="step < totalSteps"
          class="mx-2 h-0.5 flex-1 transition-colors duration-200 sm:mx-3"
          :class="step < currentStep ? 'bg-primary' : 'bg-muted'"
          aria-hidden="true"
        />
      </li>
    </ol>
  </nav>
</template>
