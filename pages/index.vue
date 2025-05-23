<template>
  <div>
    <UCard class="mb-8">
      <template #header>
        <h1 class="text-2xl font-bold text-purple-900">Wine Tasting Notes Generator</h1>
      </template>
      
      <p class="mb-6">
        Welcome to the Wine Tasting Notes Generator, a tool designed to help you create
        professional wine tasting notes following the WSET methodology.
      </p>
      
      <UButton to="/about" color="purple" size="lg">
        Learn More About WSET Methodology
      </UButton>
    </UCard>
    
    <!-- Placeholder for the future wine tasting form -->
    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Start a New Tasting Note</h2>
      </template>
      
      <p class="text-gray-500 italic">
        Wine tasting form coming soon...
      </p>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
});
</script>
