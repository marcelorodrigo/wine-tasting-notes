<script setup lang="ts">
useSeoMeta({
  title: 'Wine Tasting Notes — WSET-Compliant Tasting Note Generator',
  description: 'Generate professional WSET Level 3-compliant wine tasting notes in four stylistic profiles. No data stored — everything stays on your device.'
})
</script>

<template>
  <div>
    <UPageHero
      title="Craft Professional Wine Tasting Notes"
      description="Guided by WSET Level 3 standards, describe what you see, smell and taste — then generate polished notes in four stylistic profiles. Nothing is stored; everything stays on your device."
      :links="[{
        label: 'Start Tasting',
        to: '/tasting',
        trailingIcon: 'i-lucide-wine',
        size: 'xl'
      }]"
    >
      <template #headline>
        <UBadge
          label="WSET Level 3 · Issue 2 · 2022"
          variant="subtle"
          size="md"
          icon="i-lucide-award"
        />
      </template>
    </UPageHero>

    <UPageSection
      id="features"
      title="Everything you need for great tasting notes"
      description="A structured, mobile-first wizard walks you through every dimension of wine evaluation — from appearance to conclusions."
      :features="[{
        icon: 'i-lucide-award',
        title: 'WSET Level 3 Compliant',
        description: 'All fields, scales and descriptors match the official WSET SAT (Issue 2, 2022). Every structured assessment step is covered.'
      }, {
        icon: 'i-lucide-message-square-text',
        title: 'Four Writing Profiles',
        description: 'Generate notes in Professional, Casual, Bar Talk or Playful styles. Switch between them instantly without re-entering your data.'
      }, {
        icon: 'i-lucide-smartphone',
        title: 'Mobile-First Design',
        description: 'Comfortable on any device — from phone to desktop. Touch-friendly controls and generous tap targets throughout.'
      }, {
        icon: 'i-lucide-shield-off',
        title: 'No Data Stored',
        description: 'Your observations live only in your browser session. Nothing is sent to any server. Close the tab and it\'s gone.'
      }]"
    />

    <UPageSection>
      <UPageCTA
        title="Ready to describe your next bottle?"
        description="Work through the four-step wizard, then copy your tasting note in the style that suits the moment."
        variant="subtle"
        :links="[{
          label: 'Start Tasting',
          to: '/tasting',
          trailingIcon: 'i-lucide-arrow-right'
        }]"
      />
    </UPageSection>
  </div>
</template>
