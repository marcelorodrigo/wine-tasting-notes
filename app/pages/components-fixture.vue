<script setup lang="ts">
import { ref } from 'vue'

const dialogOpen = ref(false)
</script>

<template>
  <div data-testid="base-ui-fixture">
    <section data-testid="section-buttons">
      <h2 class="font-editorial text-lg mb-3">Buttons</h2>
      <BaseButton data-testid="btn-primary">Primary action</BaseButton>
      <BaseButton data-testid="btn-secondary" variant="secondary">Secondary action</BaseButton>
      <BaseButton data-testid="btn-ghost" variant="ghost">Ghost action</BaseButton>
      <BaseButton data-testid="btn-danger" variant="danger">Danger action</BaseButton>
      <BaseButton data-testid="btn-busy" :busy="true">Busy action</BaseButton>
      <BaseButton data-testid="btn-disabled" disabled>Disabled action</BaseButton>
    </section>

    <section data-testid="section-cards">
      <h2 class="font-editorial text-lg mb-3">Cards</h2>
      <BaseCard data-testid="card-default">Default card</BaseCard>
      <BaseCard data-testid="card-outlined" variant="outlined">Outlined card</BaseCard>
      <BaseCard data-testid="card-elevated" variant="elevated">Elevated card</BaseCard>
    </section>

    <section data-testid="section-dialog">
      <h2 class="font-editorial text-lg mb-3">Dialog</h2>
      <BaseButton data-testid="dialog-trigger" @click="dialogOpen = true">Open dialog</BaseButton>
      <BaseDialog v-model:open="dialogOpen" title="Example dialog" data-testid="dialog-panel">
        <p>Dialog content</p>
        <template #footer>
          <BaseButton data-testid="dialog-action" @click="dialogOpen = false">Dialog action</BaseButton>
        </template>
      </BaseDialog>
    </section>

    <section data-testid="section-fieldset">
      <h2 class="font-editorial text-lg mb-3">Fieldset</h2>
      <BaseFieldset
        id="example-fieldset"
        legend="Example group"
        help="Example help text"
        error="Example error text"
        :invalid="true"
      >
        <p>Fieldset content</p>
      </BaseFieldset>
    </section>

    <section data-testid="section-progress">
      <h2 class="font-editorial text-lg mb-3">Progress</h2>
      <BaseProgress :value="65" label="Progress" :show-value="true" data-testid="progress-determinate" />
      <BaseProgress :value="null" label="Loading" data-testid="progress-indeterminate" />
    </section>

    <section data-testid="section-notices">
      <h2 class="font-editorial text-lg mb-3">Notices</h2>
      <InlineNotice tone="info" data-testid="notice-info">
        <template #title>Informational</template>
        This is an informational notice.
      </InlineNotice>
      <InlineNotice tone="error" role="alert" data-testid="notice-error">
        <template #title>Error</template>
        This is an error notice.
      </InlineNotice>
    </section>

    <section data-testid="section-skip-link">
      <h2 class="font-editorial text-lg mb-3">Skip Link</h2>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
    </section>

    <div id="main-content" data-testid="main-content" tabindex="-1">
      Main content target
    </div>
  </div>
</template>
