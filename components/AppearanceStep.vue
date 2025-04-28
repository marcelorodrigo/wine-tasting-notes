<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  wineData: any
}>()

const emit = defineEmits(['update:wine-data', 'next-step'])

const wineTypes = {
  'White': ['lemon-green', 'lemon', 'gold', 'amber', 'brown'],
  'Rosé': ['pink', 'salmon', 'orange'],
  'Red': ['purple', 'ruby', 'garnet', 'tawny']
}

const localData = ref({
  type: props.wineData?.appearance?.type || '',
  color: props.wineData?.appearance?.color || ''
})

const showColors = computed(() => Boolean(localData.value.type))
const availableColors = computed(() => wineTypes[localData.value.type as keyof typeof wineTypes] || [])
const isValid = computed(() => localData.value.type && localData.value.color)

const handleTypeSelection = (type: string) => {
  localData.value.type = type
  localData.value.color = ''
  emit('update:wine-data', { appearance: localData.value })
}

const handleColorSelection = (color: string) => {
  localData.value.color = color
  emit('update:wine-data', { appearance: localData.value })
}
</script>

<template>
  <div class="space-y-8">
    <!-- Wine Type Selection -->
    <div :class="['transition-all duration-300', showColors ? 'scale-95' : '']">
      <h2 class="text-xl font-medium text-gray-900 mb-4">What are you tasting?</h2>
      <div class="grid grid-cols-3 gap-4">
        <template v-for="type in Object.keys(wineTypes)" :key="type">
          <button
              @click="handleTypeSelection(type)"
              :class="[
                'h-32 rounded-lg flex items-center justify-center transition-colors',
                localData.type === type
                  ? 'bg-wine-600 text-white'
                  : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
              ]"
          >
            <span class="text-lg font-medium">{{ type }}</span>
          </button>
        </template>
      </div>
    </div>

    <!-- Color Selection -->
    <div v-if="showColors" class="transition-all duration-300">
      <label class="block text-sm font-medium text-gray-700 mb-3">Select the wine color</label>
      <div class="flex flex-wrap gap-2">
        <template v-for="color in availableColors" :key="color">
          <label :class="[
            'relative flex cursor-pointer rounded-lg px-4 py-2 focus:outline-none',
            localData.color === color
              ? 'bg-wine-600 text-white'
              : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
          ]">
            <input
                type="radio"
                :value="color"
                v-model="localData.color"
                class="sr-only"
                :name="'color-option'"
                @change="handleColorSelection(color)"
            />
            <span class="text-sm font-semibold">{{ color }}</span>
          </label>
        </template>
      </div>
    </div>

    <!-- Next Button -->
    <div class="flex justify-end">
      <button
          type="button"
          @click="$emit('next-step')"
          :disabled="!isValid"
          class="inline-flex justify-center rounded-md border border-transparent bg-wine-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-wine-700 focus:outline-none focus:ring-2 focus:ring-wine-500 focus:ring-offset-2 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>