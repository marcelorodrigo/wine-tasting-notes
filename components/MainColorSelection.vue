<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div v-if="!selectedWine" class="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl w-full">
      <button
          v-for="wine in wines"
          :key="wine.type"
          @click="selectWine(wine.type)"
          class="relative group overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <div
            class="absolute inset-0 bg-cover bg-center opacity-70 group-hover:opacity-80 transition-opacity duration-300"
            :style="{ backgroundImage: `url(${wine.image})` }"></div>
        <div class="relative p-6 text-center">
          <h2 class="text-2xl font-bold text-shadow-md text-shadow-white text-red-300">{{ wine.type }}</h2>
        </div>
      </button>
    </div>

    <div v-else class="text-center">
      <h2 class="text-3xl font-semibold text-gray-800 mb-4">You selected {{ selectedWine }}!</h2>
      <button
          @click="resetSelection"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        Choose Again
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Wine {
  type: 'Red' | 'Rosé' | 'White'
  bgColor: string
  description: string
  image: string
}

const wines: Wine[] = [
  {
    type: 'Red',
    bgColor: 'bg-red-300',
    description: 'Bold and rich flavors',
    image: '/images/red-glass.jpg'
  },
  {
    type: 'Rosé',
    bgColor: 'bg-pink-100',
    description: 'Light and refreshing',
    image: '/images/rose-glass.jpg'
  },
  {
    type: 'White',
    bgColor: 'bg-amber-100',
    description: 'Crisp and vibrant',
    image: '/images/white-glass.jpg'
  },
]

const selectedWine = ref<Wine['type'] | null>(null)

const selectWine = (type: Wine['type']): void => {
  selectedWine.value = type
}

const resetSelection = (): void => {
  selectedWine.value = null
}
</script>

<style scoped>
/* No additional styles needed as TailwindCSS classes are used */
</style>