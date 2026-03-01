<script setup lang="ts">
import DOMPurify from 'dompurify';
import { computed } from 'vue';
import type { Show } from '@/types/show.type';
import { htmlToText, truncateText } from '@/utils/show-util';
import BaseButton from '@/components/common/BaseButton.vue';

const props = defineProps<{
  show: Show;
  label?: string;
}>();

const sanitizedSummaryHtml = computed(() =>
  DOMPurify.sanitize(props.show.summaryHtml ?? '', {
    USE_PROFILES: { html: true },
  }),
);

const heroImage = computed(() => props.show.image?.original || props.show.image?.medium || '');

const summary = computed(() => {
  const text = htmlToText(sanitizedSummaryHtml.value);
  return text ? truncateText(text) : '';
});

const subtitle = computed(() => {
  const parts: string[] = [];
  if (props.show.genres?.length) parts.push(props.show.genres.slice(0, 3).join(' • '));
  if (props.show.premiered)
    parts.push(new Intl.DateTimeFormat('en-GB').format(new Date(props.show.premiered)));
  return parts.join(' • ');
});

const bgStyle = computed(() =>
  heroImage.value ? ({ '--bg': `url("${heroImage.value}")` } as Record<string, string>) : undefined,
);
</script>

<template>
  <section class="hero" :style="bgStyle">
    <div class="bg"></div>

    <div class="container inner">
      <div class="content">
        <div class="label">{{ label ?? 'Featured' }}</div>

        <h1 class="title">{{ show.name }}</h1>

        <div class="meta">
          <span v-if="show.rating != null" class="font-bold">★ {{ show.rating }}</span>
          <span v-if="subtitle">• {{ subtitle }}</span>
        </div>

        <p v-if="summary" class="summary">
          {{ summary }}
        </p>

        <div class="mt-18">
          <BaseButton :to="`/shows/${show.id}`"> Details </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.hero {
  position: relative;
  min-height: 420px;
  overflow: hidden;
  border-radius: var(--r-xl);
}

.bg {
  position: absolute;
  inset: 0;
  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  transform: scale(1.04);
  filter: saturate(1.05) contrast(1.08);
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(0, 0, 0, 0.82) 0%,
      rgba(0, 0, 0, 0.58) 35%,
      rgba(0, 0, 0, 0.28) 60%,
      rgba(0, 0, 0, 0.12) 80%,
      transparent 100%
    ),
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.55) 0%,
      rgba(0, 0, 0, 0.05) 60%,
      rgba(0, 0, 0, 0.45) 100%
    );
}

.inner {
  position: relative;
  display: flex;
  align-items: center;
  min-height: 420px;
}

.content {
  max-width: 520px;
}

.label {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: var(--muted);
}

.title {
  margin: 12px 0 6px;
  font-size: 48px;
  line-height: 1.02;
  font-weight: 900;
  letter-spacing: -0.6px;
}

.meta {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.75);
}

.summary {
  margin-top: 14px;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.85);
}

@media (max-width: 760px) {
  .title {
    font-size: 36px;
  }
}
</style>
