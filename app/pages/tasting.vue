<script setup lang="ts">
useSeoMeta({
  title: 'Tasting Wizard — Wine Tasting Notes',
  description: 'Complete the four-step WSET Level 3 systematic tasting wizard to generate professional wine tasting notes.'
})
</script>

<template>
  <div class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
    <div class="mb-6 flex size-16 items-center justify-center rounded-2xl bg-rose-500/10 text-primary">
      <UIcon
        name="i-lucide-wine"
        class="size-8"
      />
    </div>

    <h1 class="font-display text-4xl font-bold tracking-tight text-highlighted sm:text-5xl">
      Tasting Wizard
    </h1>

    <p class="mt-4 max-w-md text-balance text-lg text-muted">
      The four-step wizard is coming soon. You'll be able to describe your wine and generate polished tasting notes here.
    </p>

    <div class="mt-10">
      <UButton
        to="/"
        label="Back to Home"
        variant="outline"
        leading-icon="i-lucide-arrow-left"
      />
    </div>
  </div>
</template>
