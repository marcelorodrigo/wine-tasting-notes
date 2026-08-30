<script setup lang="ts">
withDefaults(defineProps<{
  href?: string
}>(), {
  href: '#main-content',
})
</script>

<template>
  <a
    :href="href"
    class="visually-hidden focus-visible:visible focus:not-sr-only focus:[clip:auto] focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-action focus:text-on-action focus:px-5 focus:py-3 focus:rounded-control focus:shadow-dialog focus:font-interface focus:text-base focus:no-underline"
  >
    <slot />
  </a>
</template>
