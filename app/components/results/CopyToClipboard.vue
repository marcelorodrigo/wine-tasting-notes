<script setup lang="ts">
const props = defineProps<{
  text?: string | null
}>()

const toast = useToast()
const copied = ref(false)
let timeout: ReturnType<typeof setTimeout> | undefined

async function copyToClipboard() {
  if (!props.text?.trim()) return

  let success = false
  try {
    await navigator.clipboard.writeText(props.text)
    success = true
  } catch {
    success = fallbackCopy(props.text)
  }

  if (success) {
    toast.add({
      title: 'Copied to clipboard!',
      icon: 'i-lucide-check',
      color: 'success'
    })

    copied.value = true
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const result = document.execCommand('copy')
  document.body.removeChild(textarea)
  return result
}

onUnmounted(() => {
  clearTimeout(timeout)
})
</script>

<template>
  <UButton
    data-testid="copy-to-clipboard"
    :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
    :label="copied ? 'Copied!' : 'Copy to Clipboard'"
    :color="copied ? 'success' : 'primary'"
    variant="outline"
    size="lg"
    :disabled="!text?.trim()"
    @click="copyToClipboard"
  />
</template>
