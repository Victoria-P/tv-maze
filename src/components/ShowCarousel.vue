<script setup lang="ts">
import { nextTick, watch } from 'vue';
import type { Show } from '@/types/show.type';
import { useHorizontalPager } from '@/composables/useHorizontalPager';
import BaseButton from '@/components/common/BaseButton.vue';
import Card from '@/components/common/Card.vue';

const props = defineProps<{ title: string; shows: Show[] }>();

const { scroller, page, totalPages, onScroll, scrollByPage, resetToStart } = useHorizontalPager();

watch(
  () => props.shows.length,
  async () => {
    await nextTick();
    resetToStart();
  },
);
</script>

<template>
  <section class="carousel-section">
    <div class="flex flex-between items-center">
      <h2 class="heading-md m-0">{{ title }}</h2>

      <div class="flex items-center gap-8">
        <span class="carousel-badge text-muted font-medium">{{ page }} / {{ totalPages }}</span>

        <BaseButton icon variant="ghost" size="sm" :disabled="page === 1" @click="scrollByPage(-1)">
          ‹
        </BaseButton>

        <BaseButton
          icon
          variant="ghost"
          size="sm"
          :disabled="page === totalPages"
          @click="scrollByPage(1)"
        >
          ›
        </BaseButton>
      </div>
    </div>

    <div
      ref="scroller"
      class="carousel-scroller scrollbar-hide"
      role="list"
      :aria-label="`${title} shows`"
      @scroll.passive="onScroll"
    >
      <div class="carousel-item" v-for="show in shows" :key="show.id" role="listitem">
        <router-link class="link-unstyled" :to="`/shows/${show.id}`">
          <Card
            :name="show.name"
            :badgeLabel="show.rating"
            :img="show.image?.medium || show.image?.original || ''"
          />
        </router-link>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.carousel-section {
  margin: 18px 0 26px;
}

.heading-md {
  margin: 0;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.2px;
}

.carousel-badge {
  font-size: 12px;
  border: 1px solid var(--border);
  background: var(--surface-opacity-6);
  padding: 4px 10px;
  border-radius: 999px;
  min-width: 64px;
  text-align: center;
}

.carousel-scroller {
  margin-top: 12px;
  display: flex;
  gap: 14px;
  overflow-x: auto;
  padding-bottom: 10px;
  scroll-behavior: smooth;
}

.carousel-item {
  flex: 0 0 auto;
}
</style>
