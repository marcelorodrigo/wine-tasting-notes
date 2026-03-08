<script setup lang="ts">
useSeoMeta({
  title: 'Wine Tasting Notes — WSET-Compliant Tasting Note Generator',
  description: 'Generate professional WSET Level 3-compliant wine tasting notes in four stylistic profiles. No data stored — everything stays on your device.'
})

const steps = [
  {
    number: '01',
    icon: 'i-lucide-eye',
    title: 'Appearance',
    description: 'Observe clarity, intensity, color and visual cues like legs, deposit or bubbles.'
  },
  {
    number: '02',
    icon: 'i-lucide-flower-2',
    title: 'Nose',
    description: 'Identify primary, secondary and tertiary aromas. Assess intensity and development.'
  },
  {
    number: '03',
    icon: 'i-lucide-glass-water',
    title: 'Palate',
    description: 'Evaluate sweetness, acidity, tannin, alcohol, body, flavors and finish length.'
  },
  {
    number: '04',
    icon: 'i-lucide-sparkles',
    title: 'Conclusions',
    description: 'Rate overall quality from faulty to outstanding and assess drinking readiness.'
  }
]

const features = [
  {
    icon: 'i-lucide-award',
    title: 'WSET Level 3 Compliant',
    description: 'Every field, scale and descriptor matches the official WSET Systematic Approach to Tasting (Issue 2, 2022).'
  },
  {
    icon: 'i-lucide-message-square-text',
    title: 'Four Writing Profiles',
    description: 'Generate notes in Professional, Casual, Bar Talk or Playful styles — switch instantly without re-entering data.'
  },
  {
    icon: 'i-lucide-smartphone',
    title: 'Mobile-First Design',
    description: 'Comfortable on any device with touch-friendly controls, generous tap targets and responsive layouts.'
  },
  {
    icon: 'i-lucide-shield-off',
    title: 'Nothing Leaves Your Device',
    description: 'Your observations live only in your browser session. No servers, no accounts, no tracking whatsoever.'
  }
]

const profiles = [
  {
    name: 'Professional',
    icon: 'i-lucide-briefcase',
    sample: 'APPEARANCE: Clear, medium intensity, ruby. NOSE: Clean, medium(+) intensity with developing aromas of blackcurrant, cedar, and vanilla.'
  },
  {
    name: 'Casual',
    icon: 'i-lucide-coffee',
    sample: 'This wine pours a lovely clear ruby. On the nose, it\'s generous — blackcurrant and cedar with a whisper of vanilla from oak ageing.'
  },
  {
    name: 'Bar Talk',
    icon: 'i-lucide-message-circle',
    sample: 'Nice ruby color. Big blackcurrant and cedar on the nose with some vanilla. Medium-plus intensity — this wine wants your attention.'
  },
  {
    name: 'Playful',
    icon: 'i-lucide-smile',
    sample: 'Picture a glass of liquid ruby catching the light. Take a sniff and you\'re transported — dark berries, a cedar chest, vanilla dreams.'
  }
]
</script>

<template>
  <div>
    <!-- ════════════════════════════════════════════════════ -->
    <!-- HERO                                                -->
    <!-- ════════════════════════════════════════════════════ -->
    <section class="relative isolate overflow-hidden">
      <!-- Decorative background blobs -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div
          class="animate-blob-float absolute -top-32 -right-32 size-[28rem] rounded-full bg-rose-400/20 blur-[100px] dark:bg-rose-500/10 sm:size-[36rem]"
        />
        <div
          class="animate-blob-float-reverse absolute -top-16 -left-16 size-[22rem] rounded-full bg-amber-300/20 blur-[100px] dark:bg-amber-500/[0.08] sm:size-[28rem]"
        />
        <div
          class="animate-blob-float absolute -bottom-20 left-1/3 h-[18rem] w-[36rem] rounded-full bg-rose-300/15 blur-[100px] dark:bg-rose-600/[0.08]"
        />
      </div>

      <div class="mx-auto max-w-7xl px-6 pt-20 pb-12 sm:pt-28 sm:pb-20 lg:pt-36 lg:pb-28">
        <!-- WSET badge -->
        <div class="mb-8 flex justify-center">
          <UBadge
            label="WSET Level 3 · SAT Issue 2 · 2022"
            variant="subtle"
            size="lg"
            icon="i-lucide-award"
          />
        </div>

        <!-- Headline -->
        <h1 class="font-display text-center text-5xl font-bold tracking-tight text-highlighted sm:text-7xl lg:text-8xl">
          Craft
          <span class="bg-linear-to-r from-rose-600 via-rose-500 to-amber-500 bg-clip-text text-transparent dark:from-rose-400 dark:via-rose-300 dark:to-amber-300">
            Professional
          </span>
          <br>
          Wine Tasting Notes
        </h1>

        <!-- Sub-heading -->
        <p class="mx-auto mt-8 max-w-2xl text-balance text-center text-lg leading-relaxed text-muted sm:text-xl">
          Walk through the WSET systematic approach step by step, then generate polished tasting notes in four distinctive styles — all in your browser.
        </p>

        <!-- CTA buttons -->
        <div class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <UButton
            to="/tasting"
            label="Start Tasting"
            icon="i-lucide-wine"
            size="xl"
            class="w-full sm:w-auto"
          />
          <UButton
            to="#how-it-works"
            label="See How It Works"
            variant="outline"
            trailing-icon="i-lucide-arrow-down"
            size="xl"
            class="w-full sm:w-auto"
          />
        </div>

        <!-- Preview card -->
        <div class="mx-auto mt-16 max-w-3xl sm:mt-20">
          <div class="card-shimmer rounded-2xl">
            <div class="overflow-hidden rounded-2xl border border-stone-200/60 bg-white/70 shadow-2xl backdrop-blur-xl dark:border-stone-700/40 dark:bg-stone-900/70 dark:shadow-stone-950/50">
              <!-- Window chrome -->
              <div class="flex items-center gap-3 border-b border-stone-200/60 px-6 py-3.5 dark:border-stone-700/40">
                <div class="flex gap-1.5">
                  <span class="size-3 rounded-full bg-rose-400 dark:bg-rose-500" />
                  <span class="size-3 rounded-full bg-amber-400 dark:bg-amber-500" />
                  <span class="size-3 rounded-full bg-emerald-400 dark:bg-emerald-500" />
                </div>
                <span class="text-xs font-medium text-muted">Professional Tasting Note</span>
              </div>
              <!-- Note content -->
              <div class="space-y-3 p-6 text-sm leading-relaxed sm:p-8 sm:text-base">
                <p class="text-muted">
                  <span class="font-semibold text-highlighted">APPEARANCE:</span>
                  Clear, medium intensity, ruby.
                </p>
                <p class="text-muted">
                  <span class="font-semibold text-highlighted">NOSE:</span>
                  Clean with medium(+) intensity. Developing aromas of blackcurrant, cedar, and vanilla with hints of leather and tobacco.
                </p>
                <p class="text-muted">
                  <span class="font-semibold text-highlighted">PALATE:</span>
                  Dry with high acidity, medium(+) fine-grained tannin, and medium alcohol. Full body with pronounced flavor intensity…
                </p>
                <p class="mt-1 text-xs italic text-dimmed">
                  ↑ Generated from your observations — no AI involved
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════ -->
    <!-- HOW IT WORKS                                        -->
    <!-- ════════════════════════════════════════════════════ -->
    <section
      id="how-it-works"
      class="relative py-24 sm:py-32"
    >
      <div class="mx-auto max-w-7xl px-6">
        <!-- Section heading -->
        <div class="mb-16 text-center sm:mb-20">
          <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 class="font-display text-3xl font-bold tracking-tight text-highlighted sm:text-5xl">
            Four steps to the perfect note
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted">
            Follow the WSET systematic approach from visual assessment through to your final conclusions.
          </p>
        </div>

        <!-- Step cards -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div
            v-for="step in steps"
            :key="step.title"
            class="group relative flex flex-col items-center rounded-2xl border border-stone-200/50 bg-stone-50/50 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/5 dark:border-stone-800/50 dark:bg-stone-900/50 dark:hover:shadow-rose-500/10"
          >
            <!-- Step number pill -->
            <span class="absolute -top-3 left-6 rounded-full border border-stone-200/50 bg-white px-2.5 py-1 text-xs font-bold text-primary dark:border-stone-700/50 dark:bg-stone-900">
              {{ step.number }}
            </span>

            <!-- Icon -->
            <div class="mb-5 flex size-14 items-center justify-center rounded-2xl bg-rose-500/10 text-primary transition-transform duration-300 group-hover:scale-110 dark:bg-rose-500/15">
              <UIcon
                :name="step.icon"
                class="size-7"
              />
            </div>

            <h3 class="mb-2 text-lg font-semibold text-highlighted">
              {{ step.title }}
            </h3>
            <p class="text-sm leading-relaxed text-muted">
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════ -->
    <!-- FEATURES                                            -->
    <!-- ════════════════════════════════════════════════════ -->
    <section class="relative py-24 sm:py-32">
      <!-- Subtle background blobs -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute left-0 top-1/2 size-[24rem] rounded-full bg-amber-300/10 blur-[100px] dark:bg-amber-500/5" />
        <div class="absolute bottom-0 right-0 size-[20rem] rounded-full bg-rose-300/10 blur-[100px] dark:bg-rose-500/5" />
      </div>

      <div class="mx-auto max-w-7xl px-6">
        <!-- Section heading -->
        <div class="mb-16 text-center sm:mb-20">
          <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 class="font-display text-3xl font-bold tracking-tight text-highlighted sm:text-5xl">
            Built for wine enthusiasts
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted">
            Everything you need to create detailed, standards-compliant tasting notes — nothing you don't.
          </p>
        </div>

        <!-- Feature cards -->
        <div class="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="group flex gap-5 rounded-2xl border border-stone-200/50 bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 dark:border-stone-800/50 dark:bg-stone-900 dark:hover:shadow-rose-500/10 sm:p-8"
          >
            <!-- Icon box -->
            <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-primary transition-transform duration-300 group-hover:scale-110 dark:bg-rose-500/15">
              <UIcon
                :name="feature.icon"
                class="size-6"
              />
            </div>
            <div>
              <h3 class="mb-1.5 text-base font-semibold text-highlighted">
                {{ feature.title }}
              </h3>
              <p class="text-sm leading-relaxed text-muted">
                {{ feature.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════ -->
    <!-- WRITING PROFILES                                    -->
    <!-- ════════════════════════════════════════════════════ -->
    <section class="relative py-24 sm:py-32">
      <div class="mx-auto max-w-7xl px-6">
        <!-- Section heading -->
        <div class="mb-16 text-center sm:mb-20">
          <p class="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Writing Profiles
          </p>
          <h2 class="font-display text-3xl font-bold tracking-tight text-highlighted sm:text-5xl">
            Your voice, your style
          </h2>
          <p class="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted">
            The same observations, four different voices. Switch between profiles instantly to match your audience.
          </p>
        </div>

        <!-- Profile cards -->
        <div class="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          <div
            v-for="profile in profiles"
            :key="profile.name"
            class="group overflow-hidden rounded-2xl border border-stone-200/50 bg-stone-50/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/5 dark:border-stone-800/50 dark:bg-stone-900/50 dark:hover:shadow-rose-500/10"
          >
            <!-- Profile header -->
            <div class="flex items-center gap-3 border-b border-stone-200/50 px-6 py-4 dark:border-stone-800/50">
              <div class="flex size-9 items-center justify-center rounded-lg bg-rose-500/10 text-primary dark:bg-rose-500/15">
                <UIcon
                  :name="profile.icon"
                  class="size-5"
                />
              </div>
              <span class="text-sm font-semibold text-highlighted">{{ profile.name }}</span>
            </div>
            <!-- Sample text -->
            <div class="p-6">
              <p class="text-sm italic leading-relaxed text-muted">
                "{{ profile.sample }}"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════════════════════════════ -->
    <!-- FINAL CTA                                           -->
    <!-- ════════════════════════════════════════════════════ -->
    <section class="relative overflow-hidden py-24 sm:py-32">
      <!-- Gradient wash -->
      <div class="absolute inset-0 -z-10">
        <div class="absolute inset-0 bg-linear-to-br from-rose-500/10 via-transparent to-amber-500/10 dark:from-rose-500/15 dark:to-amber-500/15" />
        <div class="absolute left-1/2 top-0 h-[36rem] w-[48rem] -translate-x-1/2 rounded-full bg-rose-400/10 blur-[120px] dark:bg-rose-500/[0.08]" />
      </div>

      <div class="mx-auto max-w-3xl px-6 text-center">
        <div class="mb-8 inline-flex size-16 items-center justify-center rounded-2xl bg-rose-500/10 text-primary dark:bg-rose-500/15">
          <UIcon
            name="i-lucide-wine"
            class="size-8"
          />
        </div>
        <h2 class="font-display text-3xl font-bold tracking-tight text-highlighted sm:text-5xl">
          Ready to describe your next bottle?
        </h2>
        <p class="mt-6 text-balance text-lg leading-relaxed text-muted">
          Work through the four-step wizard, then copy your tasting note in the style that suits the moment.
        </p>
        <div class="mt-10">
          <UButton
            to="/tasting"
            label="Start Tasting"
            icon="i-lucide-wine"
            trailing-icon="i-lucide-arrow-right"
            size="xl"
          />
        </div>
      </div>
    </section>
  </div>
</template>
