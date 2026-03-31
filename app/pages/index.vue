<template>
  <div class="min-h-screen">
    <main>
      <section class="wine-hero relative overflow-hidden">
        <div class="wine-gradient absolute inset-0" />
        <div class="wine-pattern absolute inset-0 opacity-10" />

        <UContainer class="relative py-24 md:py-32 lg:py-40">
          <div class="max-w-3xl mx-auto text-center space-y-8">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm mb-4">
              <span class="text-3xl">🍷</span>
            </div>

            <h1 class="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Discover Your Palate
            </h1>

            <p class="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
              Professional wine tasting notes in seconds
            </p>

            <UButton
              to="/tasting"
              size="xl"
              variant="solid"
              class="mt-8 bg-white text-[#722F37] hover:bg-white/90 border-0"
              trailing-icon="i-lucide-arrow-right"
            >
              Start Tasting
            </UButton>
          </div>
        </UContainer>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <UIcon
            name="i-lucide-chevron-down"
            aria-label="Scroll down"
            class="w-6 h-6 text-white/60"
          />
        </div>
      </section>

      <UPageSection
        id="features"
        title="Your Wine Journey Starts Here"
        description="Capture every detail of your wine experience with our guided tasting wizard."
        :features="[{
          icon: 'i-lucide-graduation-cap',
          title: 'Learn as You Taste',
          description: 'Follow our guided steps to evaluate appearance, nose, and palate like a sommelier.'
        }, {
          icon: 'i-lucide-flask-conical',
          title: 'Professional Framework',
          description: 'Use industry-standard aroma wheel and structured assessment methodology.'
        }, {
          icon: 'i-lucide-message-square-heart',
          title: 'Beautiful Notes',
          description: 'Generate elegant tasting notes in multiple styles - from technical to poetic.'
        }]"
      />

      <UPageSection>
        <UPageCTA
          title="Ready to explore your palate?"
          description="Join wine enthusiasts capturing their tasting experiences."
          :links="[{
            label: 'Start Tasting',
            to: '/tasting',
            trailingIcon: 'i-lucide-arrow-right'
          }]"
        />
      </UPageSection>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Wine Tasting Notes - Discover Your Palate',
  meta: [
    { name: 'description', content: 'Professional wine tasting notes in seconds. Discover your palate with our guided wine tasting wizard.' }
  ]
})
</script>

<style scoped>
.wine-hero {
  min-height: 80vh;
  display: flex;
  align-items: center;
}

.wine-gradient {
  background: linear-gradient(135deg, #722F37 0%, #4A1942 50%, #2D1B4E 100%);
}

.wine-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
