<script setup lang="ts">
import { useShowsStore } from '@/stores/shows';

defineProps<{
  title?: string;
}>();

const showsStore = useShowsStore();

const onHomeClick = () => {
  showsStore.resetSearch();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<template>
  <header class="header">
    <div class="container inner">
      <router-link to="/" class="brand" aria-label="Go to Home" @click.prevent="onHomeClick">
        <span class="font-bold">{{ title ?? 'TV Dashboard' }}</span>
      </router-link>

      <div class="actions">
        <slot></slot>
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.72), rgba(0, 0, 0, 0.35), transparent);
  border-bottom: 1px solid var(--surface-opacity-6);
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 68px;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
